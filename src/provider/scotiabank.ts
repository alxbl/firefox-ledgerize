import { MONTHS, extractTable, Option } from '../core/utils';
import { IProvider, Transaction, Flow } from '../model';

function parseDate(s: string):  Option<Date> {
    let [mmm, dd, yyyy] = s.toLowerCase()
        .replace('.', '')
        .replace(',', '')
        .split(' ');

    let year = parseInt(yyyy);
    let month = MONTHS[mmm] - 1;
    let day = parseInt(dd);

    const ret = new Date(year, month, day);
    return ret.valueOf() ? ret : null;
}

export class Scotiabank implements IProvider {

    readonly name: string;
    readonly urls: Array<string>;
    readonly version: string;

    /// Called by ledgerize when the user has requested transactions to be
    /// extracted.
    extract(account: string): Array<Transaction> {
        const posted = document.getElementById('accDetailsPanelTransaction');
        if (!posted) return [];

        // TODO: Support Pending Transactions too? Will require extra field on transactions.
        // const ePending = document.getElementById('pending_form');
        // const pending = extractTable(ePending);

        const stmt = <any>extractTable(posted);
        let out = [];
        for (let r of stmt.rows) {
            const date = parseDate(r[0]);
            if (!date) continue; // Not a transaction.

            const details = r[2];
            const amount = r[3] == "" ? r[4] : r[3]
            const direction = r[3] == "" ? Flow.Credit : Flow.Debit;
            let tx = new Transaction(
                date,
                account,
                amount,
                details,
                direction
            );
            out.push(tx);
        }
        return out;
    }

/// Called by ledgerize to check if the tab is on a statement page that can be
/// collected.
/// 
/// @return The name of the account being displayed in this tab, null otherwise.
    check(): Option<string> {
        const posted = document.getElementById('accDetailsPanelTransaction');
        if (!posted) return null;

        // TODO: Check for pending too?

        return document.getElementsByTagName('h1')[1].innerText;
    }

    constructor() {
        this.name = 'Scotiabank';
        this.urls = ['www.scotiaonline.scotiabank.com'];
        this.version = '0.1';
    }
}
