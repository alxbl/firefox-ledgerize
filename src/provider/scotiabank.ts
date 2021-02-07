import { MONTHS, extractTable, Option } from '../core/utils';
import { IProvider, Transaction, Flow } from '../model';

function parseDate(s: string): Option<Date> {
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

function dropNulls<T>(e: T | null): e is T { return e !== null; }

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

        const stmt = extractTable<string>(posted);
        if (!stmt) return [];

        return stmt.map(row => {
            const date = parseDate(row.get(0));
            if (!date) return null; // Not a transaction.

            const details = row.get(2);
            const credited = row.get(3);
            const debited = row.get(4);
            const amount = debited === '' ? credited : debited

            const direction = credited === '' ? Flow.Credit : Flow.Debit;
            return new Transaction(date, account, amount, details, direction)
        }).filter<Transaction>(dropNulls);
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
