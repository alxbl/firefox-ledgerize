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

function collectTransactions(tabIds) {
    let pending = [];

    tabIds.forEach(id => {
        const tab = tabs.get(id);
        if (!tab) return; // Tab may have closed before we could extract it.

        pending.push(new Promise(resolve => {
            let onMsg = function(m) {
                if (m.type != 'statement') {
                    console.warn(`Unknown message from tab ${id}`, m);
                    return;
                }
                console.debug(`Got statement from tab ${id}`, m.data);
                tab.port.onMessage.removeListener(onMsg);
                resolve(m.data);
            };
            tab.port.onMessage.addListener(onMsg);
            tab.port.onDisconnect.addListener(e => {
                tab.port.onMessage.removeListener(onMsg);
                resolve(null);
            });
            console.debug('Sending extract to tab ' + id);
            tab.port.postMessage({ type: "extract" });
        }));
    });

    Promise.all(pending).then(res => {
        const all = res.filter(x => x != null)
                       .reduce((acc, cur) => acc.concat(cur))
        navigator.clipboard.writeText(toLedger(all));
        // TODO: Send feedback to popup.
    })
}

const tabs = new Map(); // State of each registered tabs. (id -> TabInfo)

function handleTab(p) {
    const id = p.sender.tab.id;

    p.onMessage.addListener(m => {
        // Tab will send the account name.
        if (m.type === 'available') {
            console.debug(`Tab ${id} registered with account: ${m.data}`);
            tabs.set(id, { port: p, account: m.data });

            // Push the tabinfo to the popup if it's open.
            if (popup) popup.postMessage({type: 'popup.add', data: {id, account: m.data}});
        }
    });

    p.onDisconnect.addListener(x => {
        if (x.error) console.error(x.error);
        if (popup) popup.postMessage({type: 'popup.rem', data: id});
        tabs.delete(id);
    });
}

function onPopupMessage(m) {
    if (m.type !== 'extract') return;
    console.debug('User requested extraction', m.data);
    collectTransactions(m.data);
}

let popup = null; // Keep track of the popup port.
function handlePopup(p) {
    // This is the new popup handle.
    popup = p;

    const accounts = Array.from(tabs.entries(), ([id, v]) => {
        return { id, account: v.account };
    });

    p.postMessage({ type: 'popup.set', data: accounts});
    p.onMessage.addListener(onPopupMessage);
    p.onDisconnect.addListener(x => {
        if (x.error) console.error(x.error);
        popup = null; 
    });
                    
}
function main() {
    // Listen for connecting tabs or popup window.
    browser.runtime.onConnect.addListener(p => {
        switch (p.name) {
            case 'ledgerize.tab': handleTab(p); break;
            case 'ledgerize.popup': handlePopup(p); break;
            default: console.warn(`Unknown connection from ${p.name}`);
        }
    });
}

main();
