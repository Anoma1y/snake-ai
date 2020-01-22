const path = require('path');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const paths = {
	src: path.join(process.cwd(), 'src'),
	build: path.join(process.cwd(), 'dist'),
};

module.exports = {
	externals: {
		paths,
	},
	module: {
		rules: [
			{
				test: /\.ts(x?)$/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'ts-loader',
						options: {
							transpileOnly: true,
							logLevel: 'info',
						},
					}
				]
			},
			{
				test: /\.css$/,
				use: [
					MiniCssExtractPlugin.loader,
					'css-loader'
				],
			},
		]
	},
	resolve: {
		modules: ['node_modules', 'src'],
		extensions: ['.ts', '.js'],
		mainFields: ['browser', 'jsnext:main', 'main'],
	},
	plugins: [
		new ForkTsCheckerWebpackPlugin({
			tslint: false,
			useTypescriptIncrementalApi: true,
			checkSyntacticErrors: true,
		}),
		new MiniCssExtractPlugin({
			filename: '[name].[contenthash].css',
		}),
	],
};