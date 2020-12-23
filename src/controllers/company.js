import CONSTANTS from "../lib/constants";
import route from "../routes/route";
import CompanyModel from "../model/company";

export const createCompany = route( async( req, res ) => {

    try {

        const data = {
            companyName: req.body.companyName,
            currentPrice: req.body.currentPrice,
            highest: req.body.highest,
        };
        const companyDb = new CompanyModel();
        const result = await companyDb.create( data );

        if( result === null || result === undefined ) {
            res.status( CONSTANTS.INTERNAL_SERVER_ERROR_HTTP_CODE ).json({
                error: true,
                message: CONSTANTS.COMPANY_CREATE_FAILED
            });
        } else {
            res.status( CONSTANTS.SERVER_OK_HTTP_CODE ).json({
                error: false,
                companyId: result.insertedId,
                message: CONSTANTS.SERVER_OK_HTTP_CODE
            });
        }

    } catch( error ) {
        res.status( CONSTANTS.INTERNAL_SERVER_ERROR_HTTP_CODE ).json({
            error,
            message: CONSTANTS.INTERNAL_SERVER_ERROR_HTTP_CODE
        });
    };
},
{
    requiredFields: [
        "companyName",
        "currentPrice",
        "highest"
    ]
});