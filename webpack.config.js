const path = require('path');

module.exports = {
    mode: 'development',
    entry: {
	background: './src/background.js',
	ledgerize:  './src/ledgerize.js',
    },
    output: {
	filename: '[name].min.js',
	path: path.resolve(__dirname, 'dist'),
    },
    experiments: {asset: true},
    module: {
	rules: [
	    {
		test: /(\.json|\.html?)$/,
		type: 'asset/resource',
		generator: {
		    filename: '[name][ext]'
		}
	    }
	]
    },
};
