import { config } from './core/config-impl.js';
import './manifest.json';
import './settings.htm';

// TODO: Refactor to make it easy to add new providers.
import { provider as desjardins } from  './provider/desjardins.js';
const PROVIDERS = {}
for (let u of desjardins.urls) {
    PROVIDERS[u] = desjardins;
}

console.debug('Ledgerize extension loaded.');

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

// function parseDocument(provider, content) {
//     const stmt = provider.parse(provider);
//     stmt.transactions.sort(x => x.date);
//     const ledger = toLedger(stmt);
//     console.log(ledger.join('\n\n'));
// }

browser.runtime.onConnect.addListener(p => {
    p.onMessage.addListener(m => {
	if (!m) return;
	switch (m.type) {

	case "register": // New tab connected.
	    const provider = PROVIDERS[m.hostname]
	    if (!provider) return;
	    tabs.set(p, provider);
	    p.postMessage({ type: "extract", query: null });
	    console.debug('Tab registered for host: ' + m.hostname)
	    break;

	case "html": // Tab is document HTML.
	    const provider = tabs.get(p);
	    // parseDocument(provider, m.content);
	    break;

	default:
	    console.warn('Unknown message type: ' + m.type);
	}
	p.postMessage({ type: "registered" });
    });

    p.onDisconnect.addListener(x => {
	if (x.error) console.error(x.error);
	tabs.delete(p);
    });
});
