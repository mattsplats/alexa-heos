'use strict';

var Alexa = require('alexa-sdk');
var net = require('net');

var testing = process.argv[2] || false; 
var host = testing ? '192.168.0.6' : '64fc05cf370c.sn.mynetname.net';
var port = testing ? 1255 : 32401;

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {
	'LaunchRequest': function () {
		this.emit('PlayPause');
	},
	'SetPlayState': function () {
		this.emit('PlayPause');
	},
	'PlayPause': function () {
		var heos = net.connect({ host: host, port: port }, () => {
			heos.write(`heos://player/get_play_state?pid=1699474811\r\n`, 'utf8', () => {
				if (testing) console.log('Request sent');
			});

			heos.on('data', data => {
				var oldState = JSON.parse(data).heos.message.match(/state=(.*)/)[1];
				var newState = oldState === 'pause' ? 'play' : 'pause';

				heos.write(`heos://player/set_play_state?pid=1699474811&state=${newState}\r\n`, 'utf8', () => {
					if (testing) console.log(`${oldState} changed to ${newState}`);
					else this.emit(':tell', 'OK!');
					
					heos.end();
				})
			});
		});
	},
	'AMAZON.HelpIntent': function () {
		this.emit(':tell', 'Still testing!');
	},
	'AMAZON.CancelIntent': function () {
		this.emit(':tell', 'Goodbye!');
	},
	'AMAZON.StopIntent': function () {
		this.emit(':tell', 'Goodbye!');
	}
};

if (testing) handlers['PlayPause']();