import { config } from './core/config.js';
export const LINE_WIDTH = 56 // Refactor: Make into a setting.

// Load configuration.
config.load().then(res => {
    // TODO
});


function toLedger(stmt) {
    const fmt = new Intl.DateTimeFormat('en-CA') // YYYY/MM/DD
    stmt.sort((lhs,rhs) => lhs.date - rhs.date);

    let out = [];
    for (let tx of stmt) {
        const acc = config.getSourceAccount(tx.account);

        const src = acc.name;
        const dst = config.getDestinationAccount(tx.details);

        const date = fmt.format(tx.date);
        const currency = tx.currency || acc.currency; // Use currency hint when specified.
        const amt = `${tx.amount} ${currency}`;

        const spacing = LINE_WIDTH - tx.amount.length;

        let entry = `${date} * ${tx.details}\n`;
        if (tx.direction > 0) {
            const pad = Array(spacing - src.length + 1).join(' ');
            entry += `    ${src}${pad}${amt}\n    ${dst}`;
        } else {
            const pad = Array(spacing - dst.length + 1).join(' ');
            entry += `    ${dst}${pad}${amt}\n    ${src}`;
        }
        out.push(entry);
    }
    return out.join('\n\n');
}

function collectTransactions() {
    let pending = [];
    for (let e of tabs) {
        const id = e[0];
        const port = e[1];
        pending.push(new Promise(resolve => {
            port.onMessage.addListener(m => {
                // FIXME: Should validate message type.
                resolve(m.content);
            });
            port.onDisconnect.addListener(e => {
                resolve(null);
            });
            console.debug('Sending extract to tab ' + id);
            port.postMessage({ type: "extract" });
        }));
    }

    Promise.all(pending).then( res => {
        // Dropping the provider here for simplicity.
        const all = res.filter(x => x != null)
                       .map(x => x.result)
                       .reduce((acc, cur) => acc.concat(cur))
        navigator.clipboard.writeText(toLedger(all));
        // TODO: Add user feedback.
    })
}

const tabs = new Map(); // State of each registered tabs.
browser.runtime.onConnect.addListener(p => {
    const id = p.sender.tab.id;
    console.debug(`Tab ${id} registered`);
    tabs.set(id, p);

    p.onDisconnect.addListener(x => {
        if (x.error) console.error(x.error);
        tabs.delete(id);
    });
});

browser.browserAction.onClicked.addListener((tab, clickData) => {
    console.debug('Ledgerize invoked for collection.');
    collectTransactions();
});
