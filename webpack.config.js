const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
    mode: 'production',
    devtool: 'source-map',
    entry: {
	// background: './src/background.js',
	ledgerize:  './src/ledgerize.ts',
	settings:  './src/settings.ts',
	// popup:  './src/popup.js',
    },
    output: {
	filename: '[name].min.js',
	path: path.resolve(__dirname, 'dist'),
    },
    module: {
	rules: [
            { test: /\.ts$/,
              loader: 'ts-loader',
              exclude: /node_modules/,
              options: {
                  appendTsSuffixTo: [/\.vue$/]
              }
            },
            { test: /\.vue$/, loader: 'vue-loader' },
	]
    },
    resolve: {
        extensions: ['.ts', '.js', '.vue'],
        alias: {
            vue$: 'vue/dist/vue.esm.js'
        }
    },
    plugins: [
        new VueLoaderPlugin()
    ]
};
