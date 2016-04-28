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
		gateway.transaction.sale({
			amount: '10.00',
			paymentMethodNonce: nonce,
			options: {
				submitForSettlement: true
			}
	}, function (err, result) {
			console.log(result);
			console.log(err);
			if(result.success) {
				var transaction = result.transaction;
				return res(transaction);
			} else if(err != null && !result.success) {
				console.log(err);
				return res('error:', err);
			} else {
				return res(result);
			}
		})
	};

	Transaction.remoteMethod(
		'payment',
		{
			http: {path: '/payment', verb: 'post'},
			accepts: {arg: 'req', type: 'object', 'http': {source: 'body'}},
			returns: {arg: 'transaction', type: 'object', 'http': {source: 'body'}}
		}
	);
};
