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
        const port = e[1].port;
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

    Promise.all(pending).then(res => {
        const all = res.filter(x => x != null)
                       .map(x => x.result)
                       .reduce((acc, cur) => acc.concat(cur))
        navigator.clipboard.writeText(toLedger(all));
        // TODO: Add user feedback.
    })
}

const tabs = new Map(); // State of each registered tabs. (id -> TabInfo)

function handleTab(p) {
    const id = p.sender.tab.id;

    p.onMessage.addListener(m => {
        // Tab will send the account name.
        if (m.type === 'available') {
            console.debug(`Tab ${id} registered with account:`);
            tabs.set(id, { port: p, account: m.data });

            // TODO: Push the tabinfo to the popup if it's open. (TODO)
            if (popup) popup.postMessage({type: 'popup.add', data: null});
        }
    });

    p.onDisconnect.addListener(x => {
        if (x.error) console.error(x.error);
        tabs.delete(id);
        if (popup) popup.postMessage({type: 'popup.rem', data: id});
    });
}


let popup = null; // Keep track of the popup port.
function handlePopup(p) {
    // This is the new popup handle.
    popup = p;

    p.postMessage({ type: 'popup.set', data: []}); // TODO:
    p.onDisconnect.addListener(x => {
        if (x.error) console.error(x.error);
        // No longer have a popup handle.
        popup = null; 
    });
                    
}
function main() {
    // Listen for connecting tabs or popup window.
    browser.runtime.onConnect.addListener(p => {
        switch (p.name) {
            case 'ledgerize.tab': handleTab(p); break;
            case 'ledgerize.popup': handlePopup(p); break;
            default: console.warn(`Unknown connection: ${p.name}`);
        }
    });

    // FIXME: This must be done from the popup UI.
    browser.browserAction.onClicked.addListener((tab, clickData) => {
        collectTransactions();
    });
}


main();
