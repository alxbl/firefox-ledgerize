import Vue from 'vue';
import Popup from './popup.vue';

let popup = new Vue({
    el: '#popup',
    render: function(createElement) {
        return createElement(
            Popup
        )
    },
    data: {
        accounts: [],
        ext: browser.runtime.connect({name: 'ledgerize.popup'}),
    }
})

// account: { id, name, selected }
function onMessage(m) {
    console.debug('Message from extension', m);
    switch (m.type) {
        case 'popup.set': {
            popup.accounts = m.data;
            break;
        }
        case 'popup.add': {
            popup.accounts.push({ id: m.data.id, ...m.data });
            break;
        }
        case 'popup.rem': {
            popup.accounts = popup.accounts.filter(a => a.id != m.data);
            break;
        }
        default: console.warn('Unknown message', m);
    }
}

popup.ext.onMessage.addListener(onMessage);
popup.ext.onDisconnect.addListener(x => popup.ext.onMessage.removeHandler(onMessage));

