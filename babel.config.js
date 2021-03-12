module.exports = {
	presets: [
		['@babel/preset-react', { runtime: 'automatic' }],
		'@babel/preset-env',
	],
	plugins: [
		'@babel/plugin-proposal-class-properties',
		'@babel/plugin-proposal-object-rest-spread',
		'@babel/plugin-syntax-dynamic-import',
		'@babel/plugin-transform-runtime',
		['import', { libraryName: 'antd' }],
	],
	env: {
		development: {
			plugins: ['react-hot-loader/babel'],
			sourceMaps: 'inline',
		},
		production: {
			presets: ['minify'],
		},
	},
};
