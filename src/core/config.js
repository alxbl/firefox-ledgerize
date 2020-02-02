const DEFAULT = {
    // Categorizations
    rules: [
	{pattern: 'Payroll', account: 'Income:Payroll'},
	{pattern: '(Visa|Mastercard)', account: 'Liabilities:Credit Card'}
    ],
    ruleFallback: 'Expenses:Uncategorized',

    accounts: {
	'Default Account': {
	    name: 'Assets:Bank:Checking:Default Account',
	    currency: '$',
	    
	}
    },
};

let state = { ...DEFAULT };

function load() {
}

function save() {
}

function reset() {
}


function findAccount(detail) {
    for (let r of state.rules) {
	let x = new RegExp(r.pattern) // FIXME: Precompile regular expressions.
	if (x.test(detail)) return r.account;
    }
    return state.ruleFallback;
}

export const config = {
    load, save, reset, findAccount
};
