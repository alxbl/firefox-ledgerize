/**
 * The main entrypoint for statement data retrieval.
 * 
 * This content script is injected into every supported website
 * and has two core responsibilities.
 *
 * On one hand, it checks whether the tab into which it was injected
 * contains a transaction statement (what defines a transaction
 * statement is left up to individual providers) and registers
 * to the extension's background task when a statement is available.
 *
 * Once registered with Ledgerize (background.js) it waits for a
 * request to collect the statement details and dispatches the request
 * to the appropriate provider through the `collect()` method. The
 * provider will then return a list of transactions which will be
 * forwarded to the extension's background worker for further
 * processing.
**/
"use strict";

import { lookup } from './providers';

function main() {
    const provider = lookup(window.location.hostname);
    if (!provider) { // No matching provider found.
        console.warn(`[Ledgerize] No provider found for '${window.location.hostname}'`);
        return;
    }

    const account = provider.check();
    if (!account) return; // Not on a statement page.
    console.debug(`[Ledgerize] Found account: '${account}' (Provider: ${provider.name} v${provider.version})`);

    let ext = browser.runtime.connect('ledgerize.tab');
    ext.onMessage.addListener((m: any) => {
        if (!m || m.type !== "extract") return;

        // Extract statement details and forward them to the extension.
        console.debug('[Ledgerize] Received extract request');
        const stmt = provider.extract(account);
        ext.postMessage({ type: 'statement', data: stmt });
    });

    // Notify the account name.
    ext.postMessage({ type: 'available', data: account});
}

main();
