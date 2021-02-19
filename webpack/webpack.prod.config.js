const webpack = require('webpack');
const baseCfg = require('./webpack.base');
const servicenowConfig = require('./servicenow.config');
const DEFAULTS = { ASSET_SIZE_LIMIT: 10000 };
const CONFIG = { ...DEFAULTS, ...servicenowConfig };

const { CleanWebpackPlugin } = require('clean-webpack-plugin');

process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';

const cfg = {
	entry: baseCfg.entry,
	output: {
		...baseCfg.output,
		filename: '[name]-[contenthash]-js',
		chunkFilename: CONFIG.JS_API_PATH + '[name]-[contenthash]-js',
	},
	resolve: baseCfg.resolve,
	stats: 'errors-only',
	mode: 'production',
	devtool: 'hidden-source-map',

	optimization: {
		splitChunks: {
			automaticNameDelimiter: '-',
			cacheGroups: {
				vendors: {
					chunks: 'all',
					minChunks: 1,
					maxSize: CONFIG.ASSET_SIZE_LIMIT,
					name: 'vendor',
					test: /([\\/]node_modules[\\/])|(assets\/)/,
					priority: -10,
				},
			},
		},
	},

	module: {
		strictExportPresence: true,
		rules: [
			baseCfg.rules.css,
			baseCfg.rules.svg,
			baseCfg.rules.assets,
			baseCfg.rules.img,
			baseCfg.rules.jsx(),
		],
	},

	plugins: [
		new CleanWebpackPlugin(),
		new webpack.HashedModuleIdsPlugin(),
		baseCfg.plugins.createIndexHtml(),
	],
};

module.exports = cfg;
