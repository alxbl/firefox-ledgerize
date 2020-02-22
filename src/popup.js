import Vue from 'vue';
import Popup from './popup.vue';

new Vue({
    el: '#popup',
    render: function(createElement) {
        return createElement(
            Popup
        )
    }
})
