import { provider as desjardins } from './provider/desjardins.js';
import { provider as scotiabank } from './provider/scotiabank.js';

const PROVIDERS = new Map();

function register(p) {
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
].map(register);

export function lookup(host){
    return PROVIDERS.get(host) 
}
