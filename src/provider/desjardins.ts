import { MONTHS, extractTable, Option, Table, Row } from '../core/utils';
import { IProvider, Transaction, Flow } from '../model';

function parseDate(s: string): Date {
    let [dd, mmm, yyyy] = s.toLowerCase().replace('\u00a0',' ').split(' ');

    let year = parseInt(yyyy);
    let month = MONTHS[mmm] - 1;
    let day = parseInt(dd);
    console.log('PPPP', year, month, day);
    return new Date(year, month, day);
}

function rowPredicate(r: Row<string>): boolean {
    return !!parseDate(r.get(0)).getTime();
}

function parseCurrency(c: string): string {
    let amt = c.replace('\u00a0', '');
    if (amt.indexOf('.') < 0) amt = amt.replace(',', '.');
    return amt.replace(',', '');
}

export class Desjardins implements IProvider {

    readonly name: string;
    readonly urls: Array<string>;
    readonly version: string;

    constructor() {
        this.name = 'Desjardins';
        this.urls = ['accesd.mouv.desjardins.com'];
        this.version = '0.1';
    }

    /// Called by ledgerize when the user has requested transactions to be
    /// extracted.
    extract(account: string): Array<Transaction> {
        // Desjardins has two tables:
        //     1. The regular statement that shows the last 31 days
        //     2. A custom search query results.

        // When the custom query result table exists, prefer it over the
        // regular statement as the user has most likely explicitly made
        // this search and is expecting this to be exported.

        let transactions: Option<Table<string>> = null;

        let modal = <HTMLIFrameElement>document.getElementById('modaleIFrame');
        if (modal && modal.contentDocument) {
            try {
                console.log('ATTEMPTING TO EXTRACT FROM MODAL...');
                let domTable = modal.contentDocument
                    .getElementsByName('RechercheOperationsForm')[0]
                    .getElementsByTagName('table')[2]
                // This is a specific search, use the transactions from the result view.
                transactions = extractTable<string>(domTable, rowPredicate);
                console.log('SUCCESS', transactions);
            }
            catch(e) { console.log(e) } // Not a valid modal.
        }

        if (!transactions) {
            // Otherwise, try to get any displayed transactions.
            let ops = document.getElementById('dernieresoperations');
            if (!ops) return []; // No treansactions displayed.
            transactions = extractTable<string>(ops, rowPredicate);
        }
        
        if (!transactions) return [];

        return transactions.map(row => {
            const date = parseDate(row.get(0));
            const payee = row.get(1);
            const withdrawn = row.get(2);
            const deposited = row.get(3);
            const flow = withdrawn !== '' ? Flow.Debit : Flow.Credit;
            const amount = parseCurrency((withdrawn !== '') ? withdrawn : deposited);
            return new Transaction(date, account, amount, payee, flow);
        });
    }

    /// Called by ledgerize to check if the tab is on a statement page that can be
    /// collected.
    ///
    /// @return The name of the account being displayed in this tab, null otherwise.
    check(): Option<string> {
        let ops = document.getElementById('dernieresoperations');
        if (!ops) return null; // Not on a statement page.

        return document
            .getElementsByClassName("panel-body-detail-compte")[0]
            .getElementsByTagName('strong')[2]
            .innerText;
    }

}
