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
 * Function the generates a uuid.
 */

function genuuid () {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx' . replace( /[xy]/g, function( c ) {
        var r = ( d + Math.random() * 16 ) % 16 | 0;
        d = Math.floor( d/ 16 );
        return ( c == 'x' ? r : ( r & 0x7|0x8 ) ).toString( 16 );
    });
    return uuid;
};

/**
 * Middleware.
 */

app.engine( 'html', swig.renderFile );
app.set( 'trust proxy', 1 );
app.set( 'view engine', 'html' );
app.set( 'views', path.join( __dirname, 'views' ) );
app.use( bodyParser.json() );
app.use( cookieParser() );
app.use( session( 
    {
        genid: function( req ) {
            return genuuid();
        },
        secret: '5x7_1@hqu1=xlggug1ch8pgvjvbzc!9hb!3o9q2aw1xunoy70-',
        cookie: { secure: false },
        saveUninitialized: true,
        resave: true
    } 
));
app.use( bodyParser.urlencoded(
    {
        extended: true
    }
));
app.use( express.static( path.join( __dirname, 'public' ) ) );

/**
 * App router.
 */

require( './private/router' )( app );