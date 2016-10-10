'use strict';
const Alexa = require('alexa-sdk');
const net = require('net');

exports.handler = function(event, context, callback) {
    const alexa = Alexa.handler(event, context);
    alexa.registerHandlers(handlers);
    alexa.execute();
};

const handlers = {
	'CondoPlay': () => setPlayState('play'),
	'CondoPause': () => setPlayState('pause')
};

function setPlayState (state='pause') {
	const heos = net.connect({ host: '192.168.0.6', port: 1255 }, () => {
		heos.write(`heos://player/set_play_state?pid=1699474811&state=${state}\r\n`);
		heos.end();
	});
}