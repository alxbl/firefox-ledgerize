import { config } from '../core/config.js';
import { MONTHS, extractTable } from '../core/utils.js';

function ledgerize_desjardins(ctx) {
    // Verify that this is a statement page.
    // Parse the ledgerize buton and bind the handler.
    let ops = document.getElementById('dernieresoperations')
    if (!ops) return null; // Not on a statement page.

    // Implementation of ledgerize handler here.
    let txs = extractTable(ops);

    const transactions = []
    for (let i = 1; i < txs.rows.length - 1; i += 1) {
        const r = txs.rows[i];
    	const date = ctx.date(r[0]);
	const desc = r[1];
	const amt = (r[2] != '') ? ctx.currency(r[2]) : ctx.currency(r[3]);
	transactions.push({
	    date: date,
	    amount: amt,
	    details: desc,
	    direction: (r[2] != '') ? -1 : 1
	});
    }

    // Extract account name.
    const account = document
	  .getElementsByClassName("panel-body-detail-compte")[0]
	  .getElementsByTagName('strong')[2]
	  .innerText;
    return {
	account: account,
	provider: ctx,
	transactions: transactions
    };
}

export const provider = {
    // The name of the bank adapter.
    name: 'Desjardins AccesD',
    // The URL patterns to match for this adapter.
    urls: ['accesd.mouv.desjardins.com'],
    // The version of the adapter.
    version: '0.1',
    // The handler for parsing pages and populating the account statement.
    parse: ledgerize_desjardins,

    // TODO: These should be implementation details, although some of
    // the logic could be shared.
    currency: c => {
	let amt = c.replace('\u00a0', '');
	if (amt.indexOf('.') < 0) amt = amt.replace(',', '.');
	// TODO: Get account currency
	return amt.replace(',', '') + ' CAD';
    },
    date: (s) => {
	let [day, month, year] = s.toLowerCase().split('\u00a0');

	year = parseInt(year);
	month = MONTHS[month] - 1;
	day = parseInt(day);
	return new Date(year, month, day);
    }
};
