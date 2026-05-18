const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const servicenowConfig = require('./servicenow.config');

const ROOT_PATH = path.join(__dirname, '../');

const DEFAULTS = { ASSET_SIZE_LIMIT: 10000 };
const CONFIG = { ...DEFAULTS, ...servicenowConfig };

module.exports = {
	entry: {
		app: ['./src/index.js'],
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
					loader: 'less-loader', // compiles Less to CSS
					options: {
						lessOptions: {
							// If you are using less-loader@5 please spread the lessOptions to options directly
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
			test: /\.(png|jpg|gif|)$/,
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
			type: 'asset/resource',
			generator: {
				filename: CONFIG.ASSETS_API_PATH + '[name]-[hash:6][ext]',
			},
		},

		jsx(args) {
			args = args || {};

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
			return createHtmlPluginInstance({
				filename: 'index.html',
				title: '',
				template: 'src/index.html',
			});
		},
	},
};

function createHtmlPluginInstance(cfg) {
	cfg.inject = 'body';
	return new HtmlWebPackPlugin(cfg);
}
