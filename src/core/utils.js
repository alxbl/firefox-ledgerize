// MONTH abbreviation to digit lookup.
export const MONTHS = {
    'jan': 1, 'feb': 2, 'fév': 2, 'mar': 3, 'apr': 4,
    'avr': 4, 'mai': 5, 'may': 5, 'jun': 6, 'jul': 7,
    'aoû': 8, 'aug': 8, 'sep': 9, 'oct': 10, 'nov': 11,
    'dec': 12, 'déc': 12
};


// Parse the DOM and extract the first table rooted in the given tree.
export function extractTable(e) {
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
