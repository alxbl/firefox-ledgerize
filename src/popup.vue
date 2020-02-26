<template>
  <div id="popup-page">
    <h1>Popup View</h1>
    <ul v-if="accounts.length">
      <li v-for="acc in accounts">
        {{acc.account}} <button v-on:click="extract(acc.id)">Extract</button>
      </li>
    </ul>
    <div v-else>
      Nothing to see here.
    </div>

    <hr>
    <button v-on:click="extract(null)">Extract All</button>
  </div>
</template>

<script>
// So, this is pretty hacky, but I haven't found a better way to do this:
// Since we're using vue-loader, the Vue.app needs a pre-compiled template.
// I couldn't find a way to instantiate the Vue.app from vue-loader and thus
// The app is spawned in `popup.js` with the only  task of creating the root
// component (this file). This component is effectively the top level Vue but
// it seems like binding props to it without the template syntax is painful,
// so instead, it uses a computed property that retrieves the accounts from the
// app's static data. This lets the account list be observable without
// having to manually control the updates. 
export default {
    name: 'Popup',
    methods: {
        extract: function(id) {
            this.$parent.ext.postMessage({type: 'extract', data: id ? [id] : Array.from(this.accounts.map(a => a.id))});
        }
    },
    computed: {
        accounts: function() {
            return this.$parent.accounts;
        }
    },
}
</script>
