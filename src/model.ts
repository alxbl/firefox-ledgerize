import { Option } from './core/utils';

export class Rule {
    constructor(pattern: RegExp, account: string) {
        this.pattern = pattern;
        this.account = account;
    }

    pattern: RegExp;
    account: string;
}

/// An account from which legerize can pull transactions.
///
/// Each account can have one or more aliases that ledgerize will use
/// to match the financial institution's bank account identifier with
/// the Ledger account name which represents it.
export class Account {
    constructor(name: string,
                aliases: Array<string>,
                currency: string,
                rules: Array<Rule>) {
        this.name = name;
        this.aliases = aliases;
        this.currency = currency;
        this.rules = rules;
    }

    /// The Ledger CLI name for this account.
    ///
    /// This is usually something like
    ///
    ///     `Assets:Savings:Bank Name`
    ///
    /// or
    ///
    ///     `Liablities:Credit Card:Bank Name`
    ///
    /// This is the name that will be used as the source account for
    /// all transactions exported from this bank account.
    name: string;

    /// Aliases used to identify the account in Ledgerize.
    ///
    /// Since financial insitutions have different methods for
    /// identifying accounts, which sometimes change depending on the
    /// page or language, It is possible to specify multiple names for
    /// the same Ledger account.  Any of these names will be mapped to
    /// the Ledger account they belong to when Ledgerize exports
    /// transactions from a financial institution's website.
    aliases: Array<string>;

    /// The currency of this account.
    ///
    /// This currency symbol wlll be useda s a fallback unless a
    /// transaction specifically overrides it.  Some providers which
    /// support multiple currencies will not use this field at all
    ///
    /// Currency symbols are arbitrary strings that will be used as-is
    /// in the exported Ledger data.
    currency: string;

    /// A list of rules to map this account's payees to Ledger accounts.
    rules: Array<Rule>;

    /// Account Metadata for Ledgerize.
    // _meta: Metadata = new Metadata();
}

/// Metadata about an account.
///
/// This class stores information about an account which is useful for
/// Ledgerize to provide its functionality.
// class Metadata {
//     /// The date of the last exported transaction.
//     ///
//     /// This is used to avoid exporting duplicate transactions and
//     /// allow multiple exports throughout the month.
//     last_exported: Date;
// }

/// Transaction state.
export enum State {
    /// No specific sate set.
    Unset,
    /// Pending state (`!`).
    Pending,
    /// Cleared state (`*`).
    Cleared
}

/// Indicates the flow of money.
export enum Flow {
    /// Money being moved out of account.
    Debit = 1, 
    /// Money being moved into account.
    Credit = -1,
}

/// Represents a single transaciton from one account to another.
export class Transaction {
    constructor(date: Date,
                account: string,
                amount: string,
                payee: string,
                flow: Flow) {
        this.date = date;
        this.account = account;
        this.amount = amount;
        this.currency = '';
        this.payee = payee;
        this.state = State.Cleared;
        this.flow = flow;
    }

    account: string;

    date: Date;
    /// Ledgerize is not aware of actual decimal values. It treats 
    amount: string;
    currency: string;
    /// The entity or person with whom the transaction was carried out.
    ///
    /// This is translated into a Ledger account name through the @{Rule} system.
    payee: string;
    state: State;
    flow: Flow
}


/// Interface for all transaction export providers
export interface IProvider {
    /// A user-friendly name for this provider.
    readonly name: string;
    /// A string representing the version of this provider.
    readonly version: string;
    /// A list of URLs that this provider can export
    readonly urls: Array<string>;

    /// Retrieves the list of transactions for this account.
    extract(account: string): Array<Transaction>;

    /// Verifies that the provider has an account available for export.
    check(): Option<string>;

}

// interface Extract {
//     kind: "extract";
// }

// interface Statement {
//     kind: "statement";
// }

// interface Available {
//     kind: "available";
// }

// type Message = Extract | Statement | Available;
