const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const baseConfig = require('./webpack.base');

const prodConfig = merge(baseConfig, {
	mode: 'production',
	entry: [
		`${baseConfig.externals.paths.src}/index.ts`,
	],
	output: {
		path: `${baseConfig.externals.paths.build}`,
		filename: '[name].[chunkhash].js',
		chunkFilename: '[name].[chunkhash].chunk.js',
		publicPath: '/',
	},
	optimization: {
		minimize: true,
		minimizer: [
			new TerserPlugin({
				terserOptions: {
					warnings: false,
					compress: {
						comparisons: false,
					},
					parse: {},
					mangle: true,
					output: {
						comments: false,
						ascii_only: true,
					},
				},
				parallel: true,
				cache: true,
				sourceMap: true,
			}),
		],
		nodeEnv: 'production',
		sideEffects: true,
		concatenateModules: true,
		splitChunks: {
			chunks: 'all',
			minSize: 30000,
			minChunks: 1,
			maxAsyncRequests: 5,
			maxInitialRequests: 3,
			name: true,
			cacheGroups: {
				commons: {
					test: /[\\/]node_modules[\\/]/,
					name: 'vendor',
					chunks: 'all',
				},
				main: {
					chunks: 'all',
					minChunks: 2,
					reuseExistingChunk: true,
					enforce: true,
				},
			},
		},
		runtimeChunk: true,
	},
	plugins: [
		new ProgressBarPlugin(),
		new CleanWebpackPlugin(),
		new HtmlWebpackPlugin({
			template: 'src/index.html',
			minify: {
				removeComments: true,
				collapseWhitespace: true,
				removeRedundantAttributes: true,
				useShortDoctype: true,
				removeEmptyAttributes: true,
				removeStyleLinkTypeAttributes: true,
				keepClosingSlash: true,
				minifyJS: true,
				minifyCSS: true,
				minifyURLs: true,
			},
			inject: true,
		}),
		new OptimizeCssAssetsPlugin({
			assetNameRegExp: /.css$/g,
			cssProcessor: require('cssnano'),
			cssProcessorPluginOptions: {
				preset: ['default', { discardComments: { removeAll: true } }],
			},
			canPrint: true
		})
	],
	performance: {
		assetFilter: (assetFilename) => !/(\.map$)|(^(main\.|favicon\.))/.test(assetFilename),
	},
});

module.exports = new Promise((resolve) => resolve(prodConfig));