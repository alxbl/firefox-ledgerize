const CONFIG_KEY = 'config';
const DEFAULT = {
    // Categorizations
    rules: [ // TODO: Default patterns
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
    accountFallback: 'Assets:Unallocated',
};

let compiled = null;

async function load() {
    try {
	let cfg = await browser.storage.sync.get(CONFIG_KEY);
	cfg = cfg[CONFIG_KEY] || DEFAULT;
	// TODO: Compile final configuration.
	console.debug('Loaded configuration', cfg);
	return true;
    } catch (e) {
	console.error('Corrupted configuration, using defaults.', e);
	cfg = DEFAULT;
	return false;
    }
}

async function save() {
    const settings = {}
    settings[CONFIG_KEY] = cfg;
    const res = await browser.storage.sync.set(settings);
    console.debug('Saved configuration', cfg);
    return res;
}


function reset() {
    console.debug('Reset configuration to defaults.');
    cfg = DEFAULT;
}


// Gets the source account based on the account name a transaction belongs to.
function getSourceAccount(name) {
    // TODO: Be smarter about default account name. (Credit Cards, Stocks, ...)
    const acc = state.accounts[name] || state.accountFallback

}

// Gets the destination account based on the configured rule patterns.
function getDestinationAccount(detail) {
    for (let r of state.rules) {
	let x = new RegExp(r.pattern) // Performance: Precompile regular expressions.
	if (x.test(detail)) return r.account;
    }
    return state.ruleFallback;
}


export const config = {
    load, save, reset, getSourceAccount, getDestinationAccount,
};
