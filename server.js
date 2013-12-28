var express = require('express.io'),
	swig = require('swig'),
	_ = require('underscore'),
	passport = require('passport');

var RedisStore = require('connect-redis')(express);

var server = express();
server.http().io();

var users = [];

// Configuracion para renderear vistas
server.engine('html', swig.renderFile);
server.set('view engine', 'html');
server.set('views', './app/views');

// Carga archivos estaticos
server.use(express.static('./public'));

// Agregamos post, cookie y sessiones
server.configure(function () {
	server.use(express.logger());
	server.use(express.cookieParser());
	server.use(express.bodyParser());

	server.use(express.session({
		secret : "secretsdf",
		store  : new RedisStore({}),
		// store  : new RedisStore({
		//	host : conf.redis.host,
		//	port : conf.redis.port,
		//	user : conf.redis.user,
		//	pass : conf.redis.pass
		// });	
	}));

	server.use( passport.initialize() );
	server.use( passport.session() );
});

passport.serializeUser(function(user, done) {
	done(null, user);
});

passport.deserializeUser(function(obj, done) {
	done(null, obj);
});

// Controllers
var homeController = require('./app/controllers/home');
var appController = require('./app/controllers/app');

homeController(server,users);
appController(server,users);


var twitterConnection = require('./app/connections/twitter');
twitterConnection(server);

server.io.route('hello?', function(req){
	req.io.emit('saludo',{
		message: 'serverReady'
	});
});

server.listen(3000);