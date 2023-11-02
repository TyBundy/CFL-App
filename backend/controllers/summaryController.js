//import necessary schema
const summarySchema = require('../models/summarySchema');

//*** POST APIS ***/

//Creates the summary field
exports.createSummary = async (req, res) => { //Exports a single function, 'createUser'
    try{
        const summary = new summarySchema(req.body);
        await summary.save();
        res.status(201).json(summary);
    } catch (error) {
        /* If the request is received, but it is a bad request, 
        you will get a console error with status 400 */
        res.status(400).json( { message: error.message });
    }
};

//Returns summary field value
exports.getSummary = async (req, res) => {
    try{
        const id = req.body.userID; //extract ID
        const ty = req.body.type;

        const responseData = await summarySchema.find({ 
            $and: [ {userID: id}, {type: ty} ] 
        });

        res.status(200).json({ data: responseData });
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//Updates the summary field value
exports.updateSummary = async (req, res) => {
    try{
        const id = req.body.userID; 
        const newTotal = req.body.financeTotal;
        const ty = req.body.type;

        const responseData = await summarySchema.findOneAndUpdate( 
            {$and: [{userID: id }, {type: ty } ] }, //search criteria
            {$set: {financeTotal: newTotal}}, //update functionality
            {returnNewDocument: true} //returns the newly updated database row
        )

        res.status(200).json({ data: responseData });
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};