/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2015-08-06
 */
var path = require('path');
var webpack = require('webpack');
var HTMLPlugin = require('html-webpack-plugin');
var autoprefixer = require('autoprefixer');
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
	env: 'development',
	devtool: 'source-map',
	entry: ['webpack-hot-middleware/client?path=/__webpack_hmr&reload=true', './src/index.js'],
	output: {
		path: path.join(__dirname, 'build'),
		filename: '[name].[hash].min.js',
		publicPath: '/' // hot loader publish dir
	},
	externals: {
		'angular': 'angular',
		'angular-resource': '\'ngResource\'',
		'angular-ui-router': '\'ui.router\'',
		'ccms-components': '\'ccms.components\''
	},
	plugins: [
		new HTMLPlugin({
			template: './src/index.html',
			inject: false
		}),
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: JSON.stringify(process.env.NODE_ENV)
			}
		}),
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NoErrorsPlugin(),
		new CopyWebpackPlugin([{
			from: __dirname + '/src/containers/member/batch-import/batchImport.zip'
		}])
	],
	resolve: {
		extensions: ['', '.js']
	},
	eslint: {
		configFile: '.eslintrc',
		emitWarning: true,
		emitError: true,
		formatter: require('eslint-friendly-formatter')
	},
	postcss: [autoprefixer({ browsers: ['Chrome > 35', 'Firefox > 30', 'Safari > 7'] })],
	module: {
		preLoaders: [
			{
				test: /\.js$/,
				loader: 'eslint-loader',
				exclude: /node_modules/,
				include: [path.join(__dirname, 'src')]
			}
		],

		loaders: [
			{
				test: /\.js$/,
				loaders: ['babel'],
				exclude: /(node_modules|bower_components)/,
				include: [path.join(__dirname, 'src')]
			},
			{
				test: /\.tpl\.html$/,
				loader: 'html',
				query: { interpolate: true },
				exclude: /(node_modules|bower_components)/,
				include: path.join(__dirname, 'src/')
			},

			{
				test: /^((?!tpl).)*\.html$/,
				loader: 'file?name=[path][name]-[hash:8].[ext]',
				exclude: /(node_modules|bower_components)/,
				include: [path.join(__dirname, 'src/containers'), path.join(__dirname, 'src/components')]
			},
			{
				test: /\.(sc|c)ss$/,
				loaders: ['style', 'css', 'postcss', 'resolve-url', 'sass?sourceMap']
			},
			{
				test: /\.(jpe?g|png|gif|svg)$/i,
				loaders: [
					'file?hash=sha512&digest=hex&name=[hash:8].[ext]',
					'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false'
				]
			},
			{
				test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
				loader: 'url?limit=10000&mimetype=application/font-woff&prefix=fonts'
			},
			{
				test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
				loader: 'url?limit=10000&mimetype=application/octet-stream&prefix=fonts'
			},
			{
				test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
				loader: 'url?limit=10000&mimetype=application/vnd.ms-fontobject&prefix=fonts'
			},
			{
				test: /\.svg(#\w+)?$/,
				loader: 'url?limit=15000&mimetype=image/svg+xml&prefix=fonts'
			}

		]
	}
};
