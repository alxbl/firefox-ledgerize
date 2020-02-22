import { MONTHS, extractTable } from '../core/utils.js';

function parseDate(s) {
    let [month, day, year] = s.toLowerCase()
        .replace('.', '')
        .replace(',', '')
        .split(' ');

    year = parseInt(year);
    month = MONTHS[month] - 1;
    day = parseInt(day);

    const ret = new Date(year, month, day);
    return ret.valueOf() ? ret : null;
}

/**
 * Called by ledgerize when the user has requested transactions to be
 * extracted.
 */
function extract(account) {
    const posted = document.getElementById('accDetailsPanelTransaction');
    if (!posted) return [];

    // TODO: Support Pending Transactions too? Will require extra field on transactions.
    // const ePending = document.getElementById('pending_form');
    // const pending = extractTable(ePending);

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

/**
 * Called by ledgerize to check if the tab is on a statement page that can be
 * collected.
 *
 * @return The name of the account being displayed in this tab, null otherwise.
 */
function check() {
    const posted = document.getElementById('accDetailsPanelTransaction');
    if (!posted) return null;

    // TODO: Check for pending too?

    return document.getElementsByTagName('h1')[1].innerText;
}

export const provider = {
    name: 'Scotiabank',
    urls: ['www.scotiaonline.scotiabank.com'],
    version: '0.1',
    extract: (account) => extract(account),
    check: () => check(),
}
