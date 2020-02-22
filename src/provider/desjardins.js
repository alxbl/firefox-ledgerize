import { config } from '../core/config.js';
import { MONTHS, extractTable } from '../core/utils.js';

function parseDate(s) {
    let [day, month, year] = s.toLowerCase().split('\u00a0');

    year = parseInt(year);
    month = MONTHS[month] - 1;
    day = parseInt(day);
    return new Date(year, month, day);
}

function parseCurrency(c) {
    let amt = c.replace('\u00a0', '');
    if (amt.indexOf('.') < 0) amt = amt.replace(',', '.');
    return amt.replace(',', '');
}

/**
 * Called by ledgerize when the user has requested transactions to be
 * extracted.
 */
function extract(account) {
    /*
      Desjardins has two tables:
        1. The regular statement that shows the last 31 days
        2. A custom search query results.
      
      When the custom query result table exists, prefer it over the
      regular statement as the user has most likely explicitly made
      this search and is expecting this to be exported.

      Currently, only case 1 is supported. Case 2 is loaded in an
      iframe and will require some tinkering to get working properly.
      This can be done later.
     */
    let ops = document.getElementById('dernieresoperations');
    // let custom =  document.getElementById('zone') // TODO

    if (!ops) return []; // Not on a statement page.

    let txs = extractTable(ops);

    const transactions = []
    for (let i = 1; i < txs.rows.length - 1; i += 1) {
        const r = txs.rows[i];
    	const date = parseDate(r[0]);
	const details = r[1];
	const amount = (r[2] != '') ? parseCurrency(r[2]) : parseCurrency(r[3]);
	transactions.push({
	    date,
            account,
	    amount,
	    details,
	    direction: (r[2] != '') ? -1 : 1
	});
    }

    return transactions;
}

/**
 * Called by ledgerize to check if the tab is on a statement page that can be
 * collected.
 *
 * @return The name of the account being displayed in this tab, null otherwise.
 */
function check() {
    let ops = document.getElementById('dernieresoperations');
    if (!ops) return null; // Not on a statement page.

    return document
	  .getElementsByClassName("panel-body-detail-compte")[0]
	  .getElementsByTagName('strong')[2]
	  .innerText;
}

export const provider = {
    name: 'Desjardins',
    urls: ['accesd.mouv.desjardins.com'],
    version: '0.1',
    extract: (account) => extract(account),
    check: () => check(),
};
