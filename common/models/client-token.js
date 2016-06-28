var braintree = require('braintree');

module.exports = function(ClientToken) {
	//var gateway = braintree.connect({
	//	environment: braintree.Environment.Production,
	//	merchantId: "3td6z59z6r7zr467",
	//	publicKey: "tmp2rmkwjbbkqhf4",
	//	privateKey: "ce1ae67edb7207b63d1d5e2df06f26aa"
	//});
	var gateway = braintree.connect({
		environment: braintree.Environment.Sandbox,
		merchantId: "jjt86fgtc386pgqw",
		publicKey: "7zqtmfxrwmd7p7p7",
		privateKey: "4bcf950726dff60167e3bf30c5fb1383"
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
