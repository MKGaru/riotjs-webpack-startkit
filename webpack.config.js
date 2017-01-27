const path = require('path');
const glob = require('glob');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');


module.exports = {
	context: path.resolve(__dirname, './src'),
	entry: {
		client: './client/index.ts',
		tags: glob.sync('./src/tags/**/*.tag.html').map(file=>'./'+file.substr('./src'.length)),
		vendor: ['tslib','riot']
	},
	output: {
		//jsonpFunction:'_webpack_resource_', // you should change this keyword.
		libraryTarget: "umd",
		library:'$$[name]',
		umdNamedDefine: true,
		path: path.resolve(__dirname, './dist'),
		filename: '[name].js',
	},
	resolve: {
		extensions: ['.ts', '.tsx', '.js', '.html'],
		modules:[
			path.resolve(__dirname,'src'),
			path.resolve(__dirname,'src/tags'),
			'node_modules'
		]
	},
	module: {
		exprContextCritical:false,
		rules: [
			{
				test: /\.tag.html/,
				exclude: /node_mdules/,
				loader: 'riot-tag-loader',
				query: {
					hot: false, // set it to true if you are using hmr 
					debug: false, // set it to true to enable sourcemaps debugging 
					type: 'typescript'
				}
			},
			{	test: /\.ts$/,
				exclude: /node_modules/,
				loader: [
					'ts-loader',
				]
			},
			{
				test: /\.css$/,
				use: [ {loader:'style-loader',options:{useable:true,insertAt:'top'}}, 'css-loader' ]
			},
			{
				test: /\.(png|woff|woff2|eot|ttf|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
				loader: 'url-loader'
			}
		]
	},
	plugins: [
		new webpack.optimize.CommonsChunkPlugin(['tags','vendor']),
		new CleanWebpackPlugin(['dist']),
		new CopyWebpackPlugin([
			{ from: 'client/index.html' }
		],{
			copyUnmodified: false
		}),
		new webpack.ProvidePlugin({
			riot: 'riot'
		})
	],
	devServer: {
		contentBase: 'dist',
		port: 8080,
		hot:false
	},
	performance: {
		maxAssetSize: 5242880
	}
};
