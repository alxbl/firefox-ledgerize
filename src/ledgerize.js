"use strict";


// Model for account statement.
// const model = {
//     account: 'acount_name',
//     provider: null, // Provider Context
//     // The transactions scraped from the bank
//     transactions: [
// 	// direction: +1 for deposit, -1 for withdrawal
// 	{ date: new Date(), amount: '0.00 CAD', details: 'Description', direction: -1 },
//     ],
// };



function extract(query) {
    return document.children[0];
}

// MAIN LOGIC -------------------------------
let p = browser.runtime.connect({name: 'ledgerize'});
p.postMessage({ type: "register", hostname: window.location.hostname});
p.onMessage.addListener(m => {
    if (!m) return;
    switch (m.type) {
    case "registered": // Extension acknowledged.
	console.debug('Registered with Ledgerize');
	break;
    case "extract": // Extension wants to parse transactions.
	// Run each queries requested by the extension.
	let res = extract(m.query);
	p.postMessage({ type: 'html', content: res });
	break;
    }
});

// const provider = DISPATCH[window.location.hostname]
// if (provider) {
// }

