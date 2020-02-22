<template>
  <div id="popup-page">
    <h1>Popup View</h1>

    <hr>
    <button v-on:click="extract">Extract Selected</button>
  </div>
</template>

<script>
const accounts = new Map();

const ext = browser.runtime.connect({name: 'ledgerize.popup'});

function onMessage(m) {
    console.debug('Message from extension', m);
    switch (m.type) {
        case 'popup.set': {
            accounts.clear();
            m.data.forEach(a => accounts.set(a.id, a.account));
            break;
        }
        case 'popup.add': accounts.set(m.data.id, m.data.account); break;
        case 'popup.rem': accounts.del(m.data);                    break;
        default: console.warn('Unknown message', m);
    }
}
ext.onMessage.addListener(onMessage);
ext.onDisconnect.addListener(x => ext.onMessage.removeHandler(onMessage));

export default {
    name: 'Popup',
    data: () => {
        return { accounts };
    },
    methods: {
        extract: function() {
            console.debug('Extracting', this.accounts);
            // FIXME: Allow user to select which accounts to extract.
            ext.postMessage({type: 'extract', data: Array.from(this.accounts.keys())});
        }
    }
}
</script>
