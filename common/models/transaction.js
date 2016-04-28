var braintree = require('braintree');

module.exports = function(Transaction) {

	var gateway = braintree.connect({
		environment: braintree.Environment.Sandbox,
		merchantId: "jjt86fgtc386pgqw",
		publicKey: "7zqtmfxrwmd7p7p7",
		privateKey: "4bcf950726dff60167e3bf30c5fb1383"
	});
	//var nonce = req.body.payment_method_nonce;
	Transaction.payment = function(req, res) {
		var nonce = req.payment_method_nonce;
		var amtDue = req.amtDue;
		gateway.transaction.sale({
			amount: amtDue,
			paymentMethodNonce: nonce,
			options: {
				submitForSettlement: true
			}
	}, function (err, result) {
			if(err) {
				res(err);
				return;
			}
				res(null, result);
				return;
		});
	};

	Transaction.remoteMethod(
		'payment',
		{
			http: {path: '/payment', verb: 'post'},
			accepts: {arg: 'req', type: 'object', 'http': {source: 'body'}},
			returns: {arg: 'result', type: 'object'}
		}
	);
};
