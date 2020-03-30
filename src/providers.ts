import { IProvider } from './model'
import { Desjardins } from './provider/desjardins';
// import { provider as scotiabank } from './provider/scotiabank.js';

const PROVIDERS = new Map<string, IProvider>();

function register(p: IProvider) {
    for (let u of p.urls) PROVIDERS.set(u, p);
}


// TODO:
// - Really need to figure out a clean way to do add provider..
// - Scatter-Gather for all tabs when extracting.
// - Global sort
// - Transaction correlation
// -
[
    Desjardins,
    // scotiabank
].forEach(c => register(new c()));

export function lookup(host: string): IProvider | null {
    return PROVIDERS.get(host) || null;
}
