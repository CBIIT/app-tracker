const webpack = require('webpack');
const baseCfg = require('./webpack.base');
var path = require('path');
const servicenowConfig = require('./servicenow.config');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

const cfg = {
	entry: baseCfg.entry,

	output: baseCfg.output,

	resolve: baseCfg.resolve,

	devtool: 'source-map',

	mode: 'development',

	devServer: {
		static: {
			directory: path.join(__dirname, '/../dist'),
		},
		hot: true,
		historyApiFallback: true,
		compress: false,
		allowedHosts: 'all',
		port: 9000,
		proxy: [
			{
				context: [servicenowConfig.REST_API_PATH],
				target: servicenowConfig.SERVICENOW_INSTANCE,
				secure: false,
				changeOrigin: true,
			},
		],
	},

	module: {
		strictExportPresence: true,
		rules: [
			baseCfg.rules.svg,
			baseCfg.rules.assets,
			baseCfg.rules.css,
			baseCfg.rules.img,
			baseCfg.rules.less,
			baseCfg.rules.jsx(),
		],
	},

	plugins: [
		new CleanWebpackPlugin(),
		new ReactRefreshWebpackPlugin(),
		new ESLintPlugin({
			extensions: ['js', 'jsx', 'ts', 'tsx'],
			emitWarning: true,
			configType: 'flat',
		}),
		baseCfg.plugins.createIndexHtml(),
		new webpack.DefinePlugin({
			'process.env.REACT_APP_USER': JSON.stringify(
				servicenowConfig.REACT_APP_USER
			),
			'process.env.REACT_APP_PASSWORD': JSON.stringify(
				servicenowConfig.REACT_APP_PASSWORD
			),
		}),
	],
};

module.exports = cfg;
