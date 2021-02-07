import { Option } from './core/utils';
import { IProvider } from './model'
import { Desjardins } from './provider/desjardins';
import { Scotiabank } from './provider/scotiabank';

const PROVIDERS = new Map<string, IProvider>();

// Add data providers here.
[
    Desjardins,
    Scotiabank,
].forEach(c => {
    let p = new c();
    for (let u of p.urls) {
        console.debug('[Ledgerize] Registering provider: ' + u);
        PROVIDERS.set(u, p);
    }
});

export function lookup(host: string): Option<IProvider> {
    return PROVIDERS.get(host) || null;
}
