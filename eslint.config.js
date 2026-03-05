const js = require('@eslint/js');
const globals = require('globals');
const reactPlugin = require('eslint-plugin-react');
const importPlugin = require('eslint-plugin-import');
const prettierConfig = require('eslint-config-prettier');
const babelParser = require('@babel/eslint-parser');

module.exports = [
	js.configs.recommended,
	{
		files: ['**/*.{js,jsx,ts,tsx}'],
		plugins: {
			react: reactPlugin,
			import: importPlugin,
		},
		languageOptions: {
			parser: babelParser,
			parserOptions: {
				ecmaVersion: 'latest',
				sourceType: 'module',
				ecmaFeatures: {
					jsx: true,
				},
				requireConfigFile: false,
				babelOptions: {
					presets: ['@babel/preset-react'],
				},
			},
			globals: {
				...globals.browser,
				...globals.node,
				...globals.es2021,
				...globals.mocha,
			},
		},
		settings: {
			react: {
				version: 'detect',
			},
			'import/resolver': {
				webpack: {},
			},
		},
		rules: {
			...reactPlugin.configs.recommended.rules,
			...importPlugin.configs.recommended.rules,
			'comma-dangle': 'off',
			'no-mixed-spaces-and-tabs': 'off',
			'no-alert': 'off',
			'import/default': 'error',
			'import/named': 'error',
			'import/no-unresolved': 'error',
			'no-underscore-dangle': 'off',
			'no-case-declarations': 'off',
			'strict': 'off',
			'no-console': 'warn',
			'no-trailing-spaces': 'off',
			'react/display-name': 'off',
			'react/jsx-no-undef': 'error',
			'react/jsx-sort-prop-types': 'off',
			'react/jsx-sort-props': 'off',
			'react/no-did-mount-set-state': 'warn',
			'react/no-did-update-set-state': 'warn',
			'react/no-unknown-property': 'warn',
			'react/prop-types': 'off',
			'react/self-closing-comp': 'off',
			'react/sort-comp': 'off',
			'react/jsx-wrap-multilines': 'warn',
			'react/react-in-jsx-scope': 'off',
			'react/jsx-uses-vars': 'error',
			'react/jsx-uses-react': 'error',
			'no-unused-vars': ['error', { caughtErrors: 'none' }],
			'no-unsafe-optional-chaining': 'warn',
			'no-prototype-builtins': 'warn',
		},
	},
	prettierConfig,
	{
		ignores: ['dist/**', 'node_modules/**', 'coverage/**'],
	},
];
