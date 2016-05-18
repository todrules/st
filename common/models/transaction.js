var braintree = require('braintree');

module.exports = function(Transaction) {

	var gateway = braintree.connect({
            environment: braintree.Environment.Production,
            merchantId: "3td6z59z6r7zr467",
            publicKey: "tmp2rmkwjbbkqhf4",
            privateKey: "ce1ae67edb7207b63d1d5e2df06f26aa"
	});
	//var nonce = req.body.payment_method_nonce;
	Transaction.payment = function(req, res) {
		var nonce = req.payment_method_nonce;
		var amtDue = req.amtDue;
		var name = req.name.split(' ');
		var orderId = req.orderId;
		var email = req.email;
		var address1 = req.address1;
		var city = req.city;
		var state = req.state;
		var zip = req.zip;
		var firstName = name[0];
		var lastName = name[1];
		gateway.transaction.sale({
			amount: amtDue,
			orderId: orderId,
			customer: {
				firstName: firstName,
				lastName: lastName,
				email: email
			},
			shipping: {
				firstName: firstName,
				lastName: lastName,
				streetAddress: address1,
				locality: city,
				region: state,
				postalCode: zip
			},
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
