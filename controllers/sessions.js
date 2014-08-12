/**
 * Class with functions related to sessions.
 */

module.exports = function( app ) {

    app.use( session( 
        {
            genid: this.genuuid,
            secret: '5x7_1@hqu1=xlggug1ch8pgvjvbzc!9hb!3o9q2aw1xunoy70-',
            cookie: { secure: false },
            saveUninitialized: true,
            resave: true
        } 
    ));

    this.genuuid = function () {
        var d = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx' . replace( /[xy]/g, function( c ) {
            var r = ( d + Math.random() * 16 ) % 16 | 0;
            d = Math.floor( d/ 16 );
            return ( c == 'x' ? r : ( r & 0x7|0x8 ) ).toString( 16 );
        });
        return uuid;
    };
}