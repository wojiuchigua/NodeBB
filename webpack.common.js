'use strict';

// webpack can handle these
//  info: [build]         plugin static dirs  build started
//  info: [build]          requirejs modules  build started
//  info: [build]           client js bundle  build started
//  info: [build]            admin js bundle  build started
//  info: [build]         client side styles  build started
//  info: [build] admin control panel styles  build started

// these need webpack loaders ?
//  info: [build]                  templates  build started
//  info: [build]                  languages  build started
//  info: [build]                     sounds  build started


// things to figure out
// ajaxify.js load template via require([]) and load page script via require([])

// translator requires some fs stuff

// helpers requires utils which causes server side requires

// util might have issues with imports

// what about plugins? >_>
// allJsFilesOfFolder.js:
// require.context("../scripts/", true, /\.js$/);
// This will bundle all scripts inside scripts and all its subfolders
// You need to install @types/webpack-env to have context at your hand.

const path = require('path');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const nodeExternals = require('webpack-node-externals');

module.exports = {
	plugins: [
		new CleanWebpackPlugin(), // cleans dist folder
		new MiniCssExtractPlugin(), // extract css to separate file
	],
	devtool: 'inline-source-map',
	entry: {
		app: './public/src/app.js',
	},
	resolve: {
		modules: ['public/src/modules', 'public/src/client', 'node_modules'],
		alias: {
			forum: './public/src/client',
			// admin: '../admin',
			// vendor: '../../vendor',
			// plugins: '../../plugins',
			benchpress: 'node_modules/benchpressjs/build',
		},
	},
	output: {
		filename: '[name].bundle.js',
		chunkFilename: '[name].bundle.js',
		path: path.resolve(__dirname, 'dist'),
	},
	target: 'node', // in order to ignore built-in modules like path, fs, etc.
	externals: [nodeExternals({
		// this WILL include `jquery` and `webpack/hot/dev-server` in the bundle, as well as `lodash/*`
		whitelist: ['benchpress', 'benchpressjs'],
	})], // in order to ignore all modules in node_modules folder
	module: {
		rules: [
			// {
			// 	test: /\.js$/,
			// 	exclude: /(node_modules|bower_components)/,
			// 	use: {
			// 		loader: 'babel-loader',
			// 		options: {
			// 		  presets: ['@babel/preset-env']
			// 		}
			// 	}
			// },
			{
				test: /\.(scss)$/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
					},
					// {
					// Adds CSS to the DOM by injecting a `<style>` tag
					// loader: 'style-loader'
					// },
					{
						// Interprets `@import` and `url()` like `import/require()` and will resolve them
						loader: 'css-loader',
					},
					{
						// Loader for webpack to process CSS with PostCSS
						loader: 'postcss-loader',
						options: {
							plugins: function () {
								return [
									require('autoprefixer'),
								];
							},
						},
					},
					{
						// Loads a SASS/SCSS file and compiles it to CSS
						loader: 'sass-loader',
					},
				],
			},
		],
	},
};