/**
 * Module dependencies.
 */

var mongoose = require ( 'mongoose' );

/**
 * Connect to the Mongo database.
 */

mongoose.connect( 'mongodb://localhost/test' );

/**
 * Exported models.
 */

module.exports = function () {

    // The Mongodb model for accounts.
    this.accounts = mongoose.model( 'accounts', 
        { 
            email: { type: String, required: true, index: { unique: true } }, 
            password: { type: String, required: true } 
        } 
    );
};