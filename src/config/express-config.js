export default class ExpressConfig {

    constructor( app ) {
        app.set( 'view engine', 'html' );

        app.use( require( 'express' ).static( require( 'path' ).join( 'public')));
    };
};