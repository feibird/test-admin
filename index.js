// close CA verify
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var path = require('path');
var dotenv = require('dotenv').load();
var fs = require('fs');

var proxy = require('express-http-proxy');

var logger = require('morgan');

var express = require('express');
var app = express();

app.enable('trust proxy');

app.use(logger('dev'));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));
var OAuth = require('wechat-oauth');
var client = new OAuth(process.env.WXPAY_APPID, process.env.WXPAY_KEY);

app.get('/wxpay/redirect', function(req, res) {
	var code = req.query.code;

	console.log(code);
	client.getAccessToken(code, function(err, result) {
		var accessToken = result.data.access_token;
		var openid = result.data.openid;

		return res.redirect('/?openid=' + openid);
	});
});


// proxy

// var test_host = 'http://139.196.240.36:8081';	//本地http
	var test_host = '139.224.5.120:443';			//测试https*/ 
app.use('/api-admin', proxy(test_host, {
	forwardPath: function(req, res) {
		return '/api-admin'+require('url').parse(req.url).path;
	}
}));

app.use(express.static(path.join(__dirname,'app')));
// app.use(express.static(path.join(__dirname,'dist')));
/*app.use(require('./routes/auth'))
app.use(function(req, res, next) {
	if (req.originalUrl != '/') return res.redirect('/');
	res.sendFile(path.join(__dirname, 'app/index.html'))
});
*/


var server = app.listen(process.env.PORT, function() {
	console.log('Listening on port ' + server.address().port)
});
