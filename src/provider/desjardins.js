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

function desjardins() {
    // Verify that this is a statement page.
    console.debug('Desjardins provider started');
    let ops = document.getElementById('dernieresoperations')
    if (!ops) return []; // Not on a statement page.

    // Extract account name.
    const account = document
	  .getElementsByClassName("panel-body-detail-compte")[0]
	  .getElementsByTagName('strong')[2]
	  .innerText;

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

    console.log(12323);
    return transactions;
}

export const provider = {
    name: 'Desjardins',
    urls: ['accesd.mouv.desjardins.com'],
    version: '0.1',
    collect: () => desjardins(),
};
