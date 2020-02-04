"use strict";
import { dispatch } from './providers.js';

let p = browser.runtime.connect({name: 'ledgerize'});
p.onMessage.addListener(m => {
    if (!m || m.type !== "extract") return;
    let res = dispatch(window.location.hostname);
    p.postMessage({ type: 'html', content: res });
});
