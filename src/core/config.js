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
};

let cfg = DEFAULT;

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
