"use strict";

// TODO: Pull to desjadins module
const MONTHS = {
    'jan': 1, 'feb': 2, 'fév': 2, 'mar': 3, 'apr': 4,
    'avr': 4, 'mai': 5, 'may': 5, 'jun': 6, 'jul': 7,
    'aoû': 8, 'aug': 8, 'sep': 9, 'oct': 10, 'nov': 11,
    'dec': 12, 'déc': 12
};

const desjardins = {
    inject: ledgerize_desjardins,
    convert: null,
    currency: c => {
	let amt = c.replace('\u00a0', '');
	if (amt.indexOf('.') < 0) amt = amt.replace(',', '.');
	return amt.replace(',', '');
    },
    date: (s) => {
	let [day, month, year] = s.toLowerCase().split('\u00a0');

	year = parseInt(year);
	month = MONTHS[month] - 1;
	day = parseInt(day);
	return new Date(year, month, day);
    },
};
// Supported websites.
const DISPATCH = {
    'accesd.mouv.desjardins.com': desjardins
};

const h = DISPATCH[window.location.hostname]
if (h) h.inject(h);

/// Helper function to extract the first table rooted at the given DOM Element.
function extractTable(e) {
    if (!e) return {};
    let table = e.getElementsByTagName('table')
    if (table && table.length > 0) table = table[0];

    // Extract the column header.
    let headers = [];
    let ths = table.getElementsByTagName('thead');
    if (ths && ths.length > 0) {
	ths = ths[0];
	ths = ths.getElementsByTagName('th');
	for (let th of ths) headers.push(th.innerText);
    } else {
	// TODO: Handle case where there is no <th>
    }

    // Extract the rows.
    let rows = [];
    let rs = table.getElementsByTagName('tr');

    // Skip the header and parse all rows.
    // FIXME: If header is not first row, this will fail.
    for (var i = 1; i < rs.length; i += 1) {
	let r = rs[i];
	let row = {};

	for (var c = 0; c < r.cells.length; c += 1)
	    row[c] = row[headers[c]] = r.cells[c].innerText;
	rows.push(row);
    }

    return { 'headers': headers, 'rows': rows };
}

// function parse

function ledgerize_desjardins(ctx) {
    // Verify that this is a statement page.
    // Inject the ledgerize buton and bind the handler.
    let ops = document.getElementById('dernieresoperations')
    if (!ops) return; // Not on a statement page.

    // Implementation of ledgerize handler here.
    let txs = extractTable(ops);

    for (let i = 1; i < txs.rows.length - 1; i += 1) {
        const r = txs.rows[i];
    	const date = ctx.date(r[0]);
	const desc = r[1];
	const amt = (r[2] != '') ? '-' + ctx.currency(r[2]) : ctx.currency(r[3]);
	// console.log(`${date} | ${desc} | ${amt}`);
    }
    // Drop the last row (balance forward)
}
