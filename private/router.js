/**
 * Accounts class.
 */

var accounts = require( '../controllers/accounts' );
var account  = new accounts();

/**
 * Routes.
 */

module.exports = function ( app ) {

    app.get( '/', account.identified,
        function( req, res ) {
            res.render( 'index', { email: req.session.email } );
        }
    );
    
    app.get( '/logout', account.identified, account.logout );

    app.get( '/login', account.not_identified,
        function( req, res ) {
            res.render( 'login/login' );
        }
    );
    
    app.get( '/register', account.not_identified,
        function( req, res ) {
            res.render( 'signup/signup' );
        }
    );
    
    app.post( '/login', account.not_identified, account.login );
    app.post( '/register', account.not_identified, account.register );
};