// The logic behind the options UI.
// It would be nice to eventually make this fully async and reactive.

import { config } from './core/config.js';



// Refresh the UI
export function refresh() {
    console.debug('Options page refreshing');
}

// Event handlers.

// Refresh on initial page load.
refresh();
