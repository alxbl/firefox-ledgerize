"use strict";

const desjardins = {
    'inject': ledgerize_desjardins,
    'convert': null,
    'date': null,
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

function parse

function ledgerize_desjardins(ctx) {
    // Verify that this is a statement page.
    // Inject the ledgerize buton and bind the handler.
    let ops = document.getElementById('dernieresoperations')
    if (!ops) return; // Not on a statement page.
    // Implementation of ledgerize handler here.
    let txs = extractTable(ops);
    console.log(txs)
    // Drop the first row (tfoot)
    // Drop the last row (balance forward)
    for 
}
