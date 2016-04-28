var loopback = require('loopback');
var boot = require('loopback-boot');
var braintree = require('braintree');

var app = module.exports = loopback();

var gateway = braintree.connect({
    environment: braintree.Environment.Sandbox,
    merchantId: "jjt86fgtc386pgqw",
    publicKey: "7zqtmfxrwmd7p7p7",
    privateKey: "4bcf950726dff60167e3bf30c5fb1383"
});

app.use('/v2', function(req, res) {
	var url = 'https://api.scalablepress.com/v2' + req.url;
	req.pipe(request(url)).pipe(res);
});

app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});
