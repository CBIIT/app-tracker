module.exports = {
	presets: [
		['@babel/preset-react', { runtime: 'automatic' }],
		'@babel/preset-env',
	],
	plugins: [
		'@babel/plugin-transform-class-properties',
		'@babel/plugin-transform-object-rest-spread',
		'@babel/plugin-transform-runtime',
		['import', { libraryName: 'antd' }],
	],
	env: {
		development: {
			plugins: ['react-refresh/babel'],
			sourceMaps: 'inline',
		},
		production: {
			presets: ['minify'],
		},
	},
};
