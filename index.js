/**
 * Module dependencies.
 */

var path = require( 'path' );
    fs = require( 'fs' );
    http = require( 'http' ),
    express = require( 'express' );
    swig = require( 'swig' );
    bodyParser = require( 'body-parser' );
    session = require( 'express-session' );
    cookieParser = require( 'cookie-parser' );

/**
 * Create the Express app.
 */

var app = express();

/**
 * Set up the webserver.
 */

http.createServer( app ).listen( 80 );

/**
 * Session class.
 */

var _sessions = require( './controllers/sessions' );
var sessions  = new _sessions( app );

/**
 * Middleware.
 */

app.engine( 'html', swig.renderFile );
app.set( 'trust proxy', 1 );
app.set( 'view engine', 'html' );
app.set( 'views', path.join( __dirname, 'views' ) );
app.use( bodyParser.json() );
app.use( cookieParser() );
app.use( bodyParser.urlencoded( { extended: true } ) );
app.use( express.static( path.join( __dirname, 'public' ) ) );

/**
 * App router.
 */

require( './private/router' )( app );