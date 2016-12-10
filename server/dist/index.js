'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _router = require('./logic/router/');

var _router2 = _interopRequireDefault(_router);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var config = { port: process.env.PORT || 8080 };

var app = (0, _express2.default)();
app.server = _http2.default.createServer(app);
app.use(_bodyParser2.default.json());

app.post('*', function (req, res) {
	(0, _router2.default)(req.body).then(function (data) {
		return res.end(JSON.stringify(data));
	}).catch(function (err) {
		return res.end(JSON.stringify(err));
	});
});

app.get('*', function (req, res) {
	return res.end('Silence is bliss');
});

app.server.listen(config.port);

console.log('Started on port ' + app.server.address().port);

exports.default = app;
//# sourceMappingURL=index.js.map