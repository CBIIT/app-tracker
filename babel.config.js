module.exports = {
	presets: [
		['@babel/preset-react', { runtime: 'automatic' }],
		'@babel/preset-env',
	],
	plugins: [
		'@babel/plugin-transform-runtime',
		['import', { libraryName: 'antd' }],
	],
	env: {
		development: {
			plugins: ['react-refresh/babel'],
			sourceMaps: 'inline',
		},
	},
};
