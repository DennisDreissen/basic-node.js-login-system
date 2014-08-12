/**
 * Module dependencies.
 */

var nodemailer = require( 'nodemailer' );
    smtpTransport = require( 'nodemailer-smtp-transport' );

/**
 * Exported functions.
 */
 
module.exports = function( data ) {

    this.transporter = nodemailer.createTransport( smtpTransport( 
        {
            host: data.host,
            port: data.port,
            auth: {
                user: data.user,
                pass: data.pass
            }
        }
    ));
    
    this.mail = function ( data ) {
        this.transporter.sendMail(
            {
                from: data.from,
                to: data.to,
                subject: data.subject,
                html: data.html
            }
        );
    };
};