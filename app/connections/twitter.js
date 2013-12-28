var passport = require('passport'),
	passportTwitter = require('passport-twitter'),
	TwitterStrategy = passportTwitter.Strategy;

var User = require('../models/user')
var twitterConnection = function (server) {
	console.log('twitterConnection ready!');

	passport.use(new TwitterStrategy({
		consumerKey: '5sl6k69Y32MotaIFGlX1JQ',
		consumerSecret: 'FwT03NbfHUZPS1r38nJlsdWWwej3n5N1az6TtAUoTrI',
		callbackURL: 'http://127.0.0.1:3000/auth/twitter/callback'
	}, function (token, tokenSecret, profile, done) {
		debugger;

		var user = new User({
			username : profile.username,
			twitter : profile
		});

		user.save(function(err){
			debugger;
			if(err){
				done(err,null);
				return;
			}
			done(null, profile);

		});

		
	}));

	server.get('/auth/twitter',passport.authenticate('twitter'));

	server.get('/auth/twitter/callback',passport.authenticate('twitter', {failureRedirect: '/?error=something-failed'}),
	function(req, res) {
		res.redirect('/app');
	});
};

module.exports = twitterConnection;