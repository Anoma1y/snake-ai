const webpack = require('webpack');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const ErrorOverlayPlugin = require('error-overlay-webpack-plugin');
const baseConfig = require('./webpack.base');

const devConfig = merge(baseConfig, {
	mode: 'development',
	entry: [
		`${baseConfig.externals.paths.src}/index.ts`,
	],
	output: {
		path: `${baseConfig.externals.paths.build}`,
		filename: '[name].js',
		chunkFilename: '[name].chunk.js',
	},
	devtool: 'cheap-module-eval-source-map',
	optimization: {},
	devServer: {
		port: 8080,
		overlay: {
			warnings: true,
			errors: true,
		},
		contentBase: baseConfig.externals.paths.src,
		watchContentBase: true,
		disableHostCheck: true,
		stats: {
			modules: false,
			warnings: true,
			chunks: false,
			publicPath: false,
			hash: false,
			version: false,
			timings: true,
		},
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin(), // Tell webpack we want hot reloading
		new HtmlWebpackPlugin({
			inject: true,
			template: 'src/index.html',
		}),
		new CircularDependencyPlugin({
			exclude: /a\.js|node_modules/, // exclude node_modules
			failOnError: false, // show a warning when there is a circular dependency
		}),
	],
});

module.exports = new Promise((resolve) => resolve(devConfig));