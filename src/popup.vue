<template>
  <div id="popup-page">
    <h1>Popup View</h1>
  </div>
</template>

<script>
const accounts = new Map();

const ext = browser.runtime.connect({name: 'ledgerize.popup'});
ext.onMessage.addListener(m => {
    console.log('Got message from extension', m);
});

export default {
    name: 'Popup',
    data: () => {
        return {};
    }
}
</script>
