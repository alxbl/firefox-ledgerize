import { provider as desjardins } from './provider/desjardins.js';
import { provider as scotiabank } from './provider/scotiabank.js';

const PROVIDERS = new Map();

function registerProvider(p) {
    for (let u of p.urls) PROVIDERS.set(u, p);
}


// TODO:
// - Really need to figure out a clean way to do add provider..
// - Scatter-Gather for all tabs when extracting.
// - Global sort
// - Transaction correlation
// -
[
    desjardins,
    scotiabank
].map(registerProvider);

export function dispatch(host){
    const ctx = PROVIDERS.get(host) 
    if (!ctx)  return null;
    const res = ctx.collect();

    return { provider: ctx.name, result: res };
}
