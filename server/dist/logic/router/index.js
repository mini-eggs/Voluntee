'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _events = require('../events/');

var _events2 = _interopRequireDefault(_events);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (props) {
	return new Promise(function (resolve, reject) {
		switch (props.type) {
			case "events":
				console.log(props);
				var data = new _events2.default({ props: props });
				data.go().then(function (data) {
					return resolve(data);
				});
				break;
			default:
				reject({ status: -1, msg: 'error 8912ty3912' });
		}
	});
};

// curl -H "Content-Type: application/json" -X POST -d '{"type":"events"}' http://localhost:8080/
//# sourceMappingURL=index.js.map