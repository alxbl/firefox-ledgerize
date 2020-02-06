import { MONTHS, extractTable } from '../core/utils.js';

function parseDate(s) {
    let [month, day, year] = s.toLowerCase()
        .replace('.', '')
        .replace(',', '')
        .split(' ');

    year = parseInt(year);
    month = MONTHS[month] - 1;
    day = parseInt(day);
    if (!year || !month || !day) return null;

    return new Date(year, month, day);
}

function scotiabank() {
    const posted = document.getElementById('accDetailsPanelTransaction');
    if (!posted) return [];

    // TODO: Support Pending Transactions too? Will require extra field on transactions.
    // const ePending = document.getElementById('pending_form');
    // const pending = extractTable(ePending);

    const account = document.getElementsByTagName('h1')[1].innerText;

    const stmt = extractTable(posted);
    let out = [];
    for (let r of stmt.rows) {
        const date = parseDate(r[0]);
        if (!date) continue; // Not a transaction.

        const details = r[2];
        const amount = r[3] == "" ? r[4] : r[3]
        const direction = r[3] == "" ? 1 : -1;
        out.push({ date, account, details, amount, direction });
    }
    return out;
}

export const provider = {
    name: 'Scotiabank',
    urls: ['www.scotiaonline.scotiabank.com'],
    version: '0.1',
    collect: () => scotiabank(),
}
