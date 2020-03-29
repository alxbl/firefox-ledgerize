import Vue from 'vue';
import Settings from './settings.vue';

new Vue({
    el: '#app',
    render: function(createElement) {
        return createElement(
            Settings
        )
    }
})
