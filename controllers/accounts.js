/**
 * Module dependencies.
 */

var bcrypt = require( 'bcrypt' );
    validator = require( 'validator' );

/**
 * Work factor for bcrypt. Default: 12
 */

var BCRYPT_WORK_FACTOR = 12;

/**
 * Mongodb class.
 */

var _mongodb = require( './mongodb' );
var mongodb  = new _mongodb();

/**
 * Mailer class.
 */

var _mailer = require( './mailer' );
var mailer  = new _mailer( 
    { 
        host: "smtp.mandrillapp.com", 
        port: 587, 
        user: "password", 
        pass: "username" 
    } 
);

/**
 * Exported functions.
 */

module.exports = function() {

    this.login = function ( req, res ) {
        if ( req.method === 'GET' || !req.body.email || !req.body.password ) {
            res.render( 'login/login' );
            return;
        }

        mongodb.accounts.findOne( { email: validator.escape( req.body.email ) }, function ( err, data ) {
            if ( err || !data ) {
                res.render( 'login/login', { warning: "Invalid username or password" } );
                return;
            }

            bcrypt.compare( validator.escape( req.body.password ), data.password, function ( err, match ) {
                if ( err || !match ) {
                    res.render( 'login/login', { warning: "Invalid username or password" } );
                    return;
                }

                req.session.userid = data._id;
                req.session.email = data.email;
                res.redirect( '/' );
            });
        });
    }

    this.register = function ( req, res ) {
        if ( req.method === 'GET' || !req.body.email || !req.body.password ) {
            res.render( 'signup/signup' );
            return;
        } else if ( req.body.password !== req.body.password2 ) {
            res.render( 'signup/signup', { warning: "Passwords don't match" } );
            return;
        } else if ( !validator.isEmail( req.body.email ) ) {
            res.render( 'signup/signup', { warning: "Not a valid emailaddress" } );
            return; 
        } else if ( req.body.password.length < 8 ) {
            res.render( 'signup/signup', { warning: "Passwords are too short" } );
            return; 
        }

        mongodb.accounts.findOne( { email: validator.escape( req.body.email ) }, function ( err, data ) {
            if ( err || data ) {
                res.render( 'signup/signup', { warning: "This email is already taken" } );
                return;
            }

            bcrypt.genSalt( BCRYPT_WORK_FACTOR, function( err, salt ) {
                if ( err || !salt ) {
                    res.render( 'signup/signup' );
                    return;
                }

                bcrypt.hash( validator.escape( req.body.password ), salt, function( err, hash ) {
                    if ( err || !hash ) {
                        res.render( 'signup/signup' );
                        return;
                    }

                    new mongodb.accounts ( { email: validator.escape( req.body.email ), password: hash, } ).save( function ( err, data ) {
                        if ( err || !data ) {
                            res.render( 'signup/signup' );
                            return;
                        }

                        res.render( 'signup/signup', { success: "Account created" } );
                        mailer.mail (
                            {
                                from: "info@example.com",
                                to: validator.escape( req.body.email ),
                                subject: "Account created!",
                                html: "Hello!<br><br>We have created your account. You can now log in at example.com with your email (" + validator.escape( req.body.email ) + ") and your password."
                            }
                        );
                    });
                });
            });
        });
    }

    this.logout = function ( req, res ) {
        req.session.userid = null;
        req.session.email = null;
        res.redirect( '/' );
    }

    this.authenticated = function ( req, res, next ) {
        if ( req.session.userid ) {
            next();
        } else {
            res.redirect ( '/login' );
        }
    }

    this.not_authenticated = function ( req, res, next ) {
        if ( req.session.userid ) {
            res.redirect ( '/login' );
        } else {
            next();
        }
    }
};