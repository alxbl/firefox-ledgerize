const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
    mode: 'production',
    devtool: 'source-map',
    entry: {
	background: './src/background.js',
	ledgerize:  './src/ledgerize.js',
	settings:  './src/settings.js',
	popup:  './src/popup.js',
    },
    output: {
	filename: '[name].min.js',
	path: path.resolve(__dirname, 'dist'),
    },
    module: {
	rules: [
            { test: /\.vue$/, loader: 'vue-loader' }
	]
    },
    plugins: [
        new VueLoaderPlugin()
    ]
};
