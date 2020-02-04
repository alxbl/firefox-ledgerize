import { config } from './core/config.js';
import './manifest.json';
import './settings.htm';

// Load configuration
config.load().then(res => {
    console.debug('Ledgerize extension loaded.', res);
});

const tabs = new Map(); // State of each registered tabs.

export const LINE_WIDTH = 56 // Total columns for ledger spacing.
// This function is responsible for doing alias lookups, and detail parsing
function toLedger(stmt) {
    const fmt = new Intl.DateTimeFormat('en-CA') // YYYY/MM/DD

    let out = [];
    // Get the account name:
    let src = ACCOUNTS[stmt.account].alias || 'Assets:Cash';
    for (let tx of stmt.transactions) {
    	const date = fmt.format(tx.date);
    	let entry = `${date} * ${tx.details}\n`;
    	const dst = findAccount(tx.details);
    	const amt = tx.amount;
    	const spacing = LINE_WIDTH - tx.amount.length;
    	if (tx.direction > 0) {
    	    const pad = Array(spacing - src.length + 1).join(' ');
    	    entry += `    ${src}${pad}${tx.amount}\n    ${dst}`
    	} else {
    	    const pad = Array(spacing - dst.length + 1).join(' ');
    	    entry += `    ${dst}${pad}${tx.amount}\n    ${src}`
    	}
    	out.push(entry);
    }
    return out;
}

browser.browserAction.onClicked.addListener((tab, clickData) => {
    console.debug('Ledgerize invoked for collection.');
    collectTransactions();
});


function collectTransactions() {
    let pending = [];
    for (let e of tabs) {
        const id = e[0];
        const port = e[1];
        pending.push(new Promise(resolve => {
            port.onMessage.addListener(m => {
                console.log('Accepted!', m);
                resolve(m.content);
            });
            port.onDisconnect.addListener(e => {
                console.error('tab disconnected!');
                resolve(null);
            });
            console.log('Sending extract to tab ' + id);
            port.postMessage({ type: "extract" });
        }));
    }

    Promise.all(pending).then( res => {
        // Dropping the provider here for simplicity.
        const all = res.filter(x => x != null)
                       .map(x => x.result)
                       .reduce((acc, cur) => acc.concat(cur))
        console.log(all);
    })
}

browser.runtime.onConnect.addListener(p => {
    const id = p.sender.tab.id;
    console.debug(`Tab ${id} registered`);
    tabs.set(id, p);

    p.onDisconnect.addListener(x => {
        if (x.error) console.error(x.error);
        tabs.delete(id);
    });
});
