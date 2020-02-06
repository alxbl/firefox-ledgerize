const CONFIG_KEY = 'config';

const DEFAULT = {
    rules: [ // TODO: Default patterns
	{pattern: 'Payroll', account: 'Income:Payroll'},
	{pattern: '(Visa|Mastercard)', account: 'Liabilities:Credit Card'},

    ],
    ruleFallback: 'Expenses:Uncategorized',

    accounts: {
	'Example Account': {
	    name: 'Assets:Bank:Checking:Default Account',
	    currency: '$',
	},
    },
    accountFallback: { name: 'Assets:Unallocated', currency: '$' },
};

let compiled = null;
let cfg;

async function load() {
    try {
	cfg = await browser.storage.sync.get(CONFIG_KEY);
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
    return cfg.accounts[name] || cfg.accountFallback
}

// Gets the destination account based on the configured rule patterns.
function getDestinationAccount(detail) {
    for (let r of cfg.rules) {
	let x = new RegExp(r.pattern) // Performance: Precompile regular expressions.
	if (x.test(detail)) return r.account;
    }
    return cfg.ruleFallback;
}


export const config = {
    load, save, reset, getSourceAccount, getDestinationAccount,
};
