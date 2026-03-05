const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const servicenowConfig = require('./servicenow.config');

const ROOT_PATH = path.join(__dirname, '../');

const DEFAULTS = { ASSET_SIZE_LIMIT: 10000 };
const CONFIG = { ...DEFAULTS, ...servicenowConfig };

module.exports = {
	entry: {
		[CONFIG.JS_API_PATH + 'app']: ['./src/index.js'],
	},

	output: {
		publicPath: '/',
		path: path.join(ROOT_PATH, 'dist/'),
	},

	resolve: {
		extensions: ['.ts', '.tsx', '.js', '.jsx'],
	},

	rules: {
		svg: {
			test: /\.svg$/,
			type: 'asset/inline',
			exclude: /node_modules/,
		},

		css: {
			test: /\.(css)$/,
			use: ['style-loader', 'css-loader', 'postcss-loader'],
		},

		less: {
			test: /\.less$/,
			use: [
				'style-loader',
				'css-loader',
				'postcss-loader',
				{
					loader: 'less-loader',
					options: {
						lessOptions: {
							modifyVars: {
								'primary-color': '#015ea2',
								'heading-color': 'rgba(0,0,0,0.65)',
								'input-color': 'rgba(0, 0, 0, 0.65)',
								'btn-default-color': 'rgba(0, 0, 0, 0.65)',
							},
							javascriptEnabled: true,
						},
					},
				},
			],
		},

		img: {
			test: /\.(png|jpg|gif)$/,
			type: 'asset',
			parser: {
				dataUrlCondition: {
					maxSize: CONFIG.ASSET_SIZE_LIMIT,
				},
			},
			generator: {
				filename: CONFIG.IMG_API_PATH + '[name]-[hash:6][ext]',
			},
		},
		assets: {
			test: /\.(woff|woff2|ttf|eot)$/,
			type: 'asset',
			parser: {
				dataUrlCondition: {
					maxSize: CONFIG.ASSET_SIZE_LIMIT,
				},
			},
			generator: {
				filename: CONFIG.ASSETS_API_PATH + '[name]-[hash:6][ext]',
			},
		},

		jsx() {
			return {
				include: [path.join(ROOT_PATH, 'src')],
				test: /\.(ts|tsx|js|jsx)$/,
				exclude: /(node_modules)/,
				use: [
					{
						loader: 'babel-loader',
					},
				],
			};
		},
	},

	plugins: {
		createIndexHtml() {
			return new HtmlWebPackPlugin({
				filename: 'index.html',
				title: '',
				chunks: ['app'],
				template: 'src/index.html',
				inject: true,
			});
		},
	},
};
