'use strict';

const Alexa = require('alexa-sdk');
const net = require('net');

exports.handler = function(event, context, callback) {
    const alexa = Alexa.handler(event, context);
    alexa.registerHandlers(handlers);
    alexa.execute();
};

const handlers = {
	'LaunchRequest': function () {
		this.emit('PlayPause');
	},
	'SetPlayState': function () {
		this.emit('PlayPause');
	},
	'PlayPause': function () {
		const heos = net.connect({ host: '192.168.0.6', port: 1255 }, () => {
			heos.write(`heos://player/get_play_state?pid=1699474811\r\n`, 'utf8', () => {
				console.log('Request sent');
			});

			heos.on('data', data => {
				const oldState = JSON.parse(data).heos.message.match(/state=(.*)/)[1];
				const newState = oldState === 'pause' ? 'play' : 'pause';

				heos.write(`heos://player/set_play_state?pid=1699474811&state=${newState}\r\n`, 'utf8', () => {
					console.log(`${oldState} changed to ${newState}`);
					heos.end();
				})
			});
		});
	},
	'AMAZON.HelpIntent': function () {
		var speechOutput = "Just testing";
		this.emit(':ask', speechOutput);
	},
	'AMAZON.CancelIntent': function () {
		this.emit(':tell', 'Goodbye!');
	},
	'AMAZON.StopIntent': function () {
		this.emit(':tell', 'Goodbye!');
	}
};

function playPause () {
	const heos = net.connect({ host: '192.168.0.6', port: 1255 }, () => {
		heos.write(`heos://player/get_play_state?pid=1699474811\r\n`, 'utf8', () => {
			console.log('Request sent');
		});
		heos.on('data', data => {
			const oldState = JSON.parse(data).heos.message.match(/state=(.*)/)[1];
			const newState = oldState === 'pause' ? 'play' : 'pause';

			heos.write(`heos://player/set_play_state?pid=1699474811&state=${newState}\r\n`, 'utf8', () => {
				console.log(`${oldState} changed to ${newState}`);
				heos.end();
			})
		});
	});
}