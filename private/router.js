/**
 * Accounts class.
 */

var accounts = require( '../controllers/accounts' );
var account  = new accounts();

/**
 * Routes.
 */

module.exports = function ( app ) {

    app.get( '/', account.authenticated,
        function( req, res ) {
            res.render( 'index', { email: req.session.email } );
        }
    );
   
    /**
     * Login.
     */

    app.get( '/login', account.not_authenticated, account.login );
    app.post( '/login', account.not_authenticated, account.login );

    /**
     * Register.
     */

    app.get( '/register', account.not_authenticated, account.register );
    app.post( '/register', account.not_authenticated, account.register );

    /**
     * Logout.
     */

    app.get( '/logout', account.authenticated, account.logout );
};