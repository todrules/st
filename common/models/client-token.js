var braintree = require('braintree');

module.exports = function(ClientToken) {
	var gateway = braintree.connect({
		environment: braintree.Environment.Production,
		merchantId: "3td6z59z6r7zr467",
		publicKey: "xnbc8qt8dcknwkng",
		privateKey: "76adb8eda0d17244eae3d018c2453546"
	});


	ClientToken.generate = function(token) {
		gateway.clientToken.generate({}, function (err, response) {
			if (err || !response || !response.clientToken) {
				if (err.name === 'authenticationError') {
					console.error('Authentication Error');
					//console.error('Using a dummy client token... this may or may not work');
					//token('dummyClientToken');
				} else {
					console.error(err);
					token(err);
				}
			} else {
				var newToken = response.clientToken;
				token(null, newToken);
			}
		});
	};
	ClientToken.remoteMethod(
		'generate',
		{
			http: {path: '/generate', verb: 'get'},
			returns: {arg: 'token', type: 'object', 'http': {source: 'token'}}
		}
	);
	

};
