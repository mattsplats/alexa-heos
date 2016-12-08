'use strict';

var Alexa = require('alexa-sdk');
var net = require('net');

var env = require('./env_vars.json');
var testing = process.argv[2] || false; 
var host = testing ? env.testing.address : env.production.address;
var port = testing ? env.testing.port : env.production.port;

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
				console.log('Request sent');
			});

			heos.on('data', data => {
				var oldState = JSON.parse(data).heos.message.match(/state=(.*)/)[1];
				var newState = oldState === 'pause' ? 'play' : 'pause';

				heos.write(`heos://player/set_play_state?pid=1699474811&state=${newState}\r\n`, 'utf8', () => {
					console.log(`${oldState} changed to ${newState}`);
					heos.end();
				});
			});

			heos.on('end', () => {
				console.log('Connection closed');
				this.emit(':tell', 'OK!');
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