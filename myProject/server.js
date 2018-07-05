/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2015-11-30
 */

const path = require('path');
const jsonServer = require('json-mock-kuitos');
const webpack = require('webpack');
const config = require('./webpack-dev.config');
// const url = require('url');
const open = require('open');

const app = jsonServer.create();
const compiler = webpack(config);

const apiPrefix = '';
const filename = path.resolve(__dirname, './mock/db.json');

const PORT = 3003;
const LOCAL_HOST = 'http://localhost';
const ADDRESS = LOCAL_HOST + ':' + PORT;
const proxyUrl = 'http://ual.dcartoon.saasproj.fenxibao.com';
app.use(require('webpack-dev-middleware')(compiler, {
	noInfo: false,
	stats: {
		colors: true,
		cached: false
	},
	publicPath: config.output.publicPath
}));
// app.use('/passport/9.0/credentials', jsonServer.proxy(proxyUrl, '80'));
app.use('/web-portal/*', jsonServer.proxy(proxyUrl, '80'));
app.use('/loyalty2-mg/1.0', jsonServer.proxy(proxyUrl, '80'));
app.use(require('webpack-hot-middleware')(compiler));
app.use(jsonServer.defaults({ static: path.resolve(__dirname) }));
app.use(jsonServer.router(apiPrefix, filename));

app.listen(PORT, function(err) {
	if (err) {
		console.log(err);
		return;
	}

	console.log('Listening at ' + ADDRESS);
	open(ADDRESS + '/portal/index.html');
});
