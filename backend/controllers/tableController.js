const liveSchema = require('../models/liveSchema');
const giveSchema = require('../models/giveSchema');
const growSchema = require('../models/growSchema');
const oweSchema = require('../models/oweSchema');
const expenseSchema = require('../models/expenseSchema')


//************ POST API Functions *************/


//------------CREATE FUNCTIONS ---------------
exports.createLiveRow = async (req, res) => { //Exports a single function, 'createLiveRow'
    try{
        const liveRow = new liveSchema(req.body);
        await liveRow.save();
        res.status(201).json(liveRow);
    } catch (error) {
         /* If the request is received, but it is a bad request, 
        you will get a console error with status 400 */
        res.status(400).json( { message: error.message });                            
    }
};

exports.createGiveRow = async (req, res) => { 
    try{
        const giveRow = new giveSchema(req.body);
        await giveRow.save();
        res.status(201).json(giveRow);
    } catch (error) {
         /* If the request is received, but it is a bad request, 
        you will get a console error with status 400 */
        res.status(400).json( { message: error.message });                            
    }
};

exports.createGrowRow = async (req, res) => { 
    try{
        const growRow = new growSchema(req.body);
        await growRow.save();
        res.status(201).json(growRow);
    } catch (error) {
         /* If the request is received, but it is a bad request, 
        you will get a console error with status 400 */
        res.status(400).json( { message: error.message });                            
    }
};

exports.createOweRow = async (req, res) => { 
    try{
        const oweRow = new oweSchema(req.body);
        await oweRow.save();
        res.status(201).json(oweRow);
    } catch (error) {
         /* If the request is received, but it is a bad request, 
        you will get a console error with status 400 */
        res.status(400).json( { message: error.message });                            
    }
};

exports.createExpenseRow = async (req, res) => { 
    try{
        const expenseRow = new expenseSchema(req.body);
        await expenseRow.save();
        res.status(201).json(expenseRow);
    } catch (error) {
         /* If the request is received, but it is a bad request, 
        you will get a console error with status 400 */
        res.status(400).json( { message: error.message });                            
    }
};

//------------DELETE FUNCTIONS ---------------

exports.deleteLiveRow = async (req, res) => {
    try{
        const id = req.body.userID; //extract ID
        const rID = req.body._id; //extract index

        const deletedData = await liveSchema.findOneAndDelete( { 
            $and: [ { userID: id }, { _id: rID }] 
        });

        if(!deletedData) {
            return res.status(400).json({ message: 'Data not found' })
        }
        res.status(200).json({ message: 'Data deleted successfully', data: deletedData });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteGiveRow = async (req, res) => {
    try{
        const id = req.body.userID; //extract ID
        const rID = req.body._id; //extract index

        const deletedData = await giveSchema.findOneAndDelete( { 
            $and: [ { userID: id }, { _id: rID }] 
        });

        if(!deletedData) {
            return res.status(400).json({ message: 'Data not found' })
        }
        res.status(200).json({ message: 'Data deleted successfully', data: deletedData });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.deleteGrowRow = async (req, res) => {
    try{
        const id = req.body.userID; //extract ID
        const rID = req.body._id; //extract index

        const deletedData = await growSchema.findOneAndDelete( { 
            $and: [ { userID: id }, { _id: rID }] 
        });

        if(!deletedData) {
            return res.status(400).json({ message: 'Data not found' })
        }
        res.status(200).json({ message: 'Data deleted successfully', data: deletedData });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteOweRow = async (req, res) => {
    try{
        const id = req.body.userID; //extract ID
        const rID = req.body._id; //extract index

        const deletedData = await oweSchema.findOneAndDelete( { 
            $and: [ { userID: id }, { _id: rID }] 
        });

        if(!deletedData) {
            return res.status(400).json({ message: 'Data not found' })
        }
        res.status(200).json({ message: 'Data deleted successfully', data: deletedData });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteExpenseRow = async (req, res) => {
    try{
        const id = req.body.userID; //extract ID
        const rID = req.body._id; //extract index

        const deletedData = await expenseSchema.findOneAndDelete( { 
            $and: [ { userID: id }, { _id: rID }] 
        });

        if(!deletedData) {
            return res.status(400).json({ message: 'Data not found' })
        }
        res.status(200).json({ message: 'Data deleted successfully', data: deletedData });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//--------RETRIEVAL FUNCTIONS------------

exports.getLiveRow = async (req, res) => {
    try{
        const id = req.body.userID; //extract ID
   

        const responseData = await liveSchema.find({ 
             userID: id
            });
        
        
        res.status(200).json({ data: responseData });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getGiveRow = async (req, res) => {
    try{
        const id = req.body.userID; //extract ID


        const responseData = await giveSchema.find({ 
             userID: id 
            });

        res.status(200).json({ data: responseData });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getGrowRow = async (req, res) => {
    try{
        const id = req.body.userID; //extract ID

        const responseData = await growSchema.find({ 
             userID: id 
            });

        res.status(200).json({ data: responseData });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getOweRow = async (req, res) => {
    try{
        const id = req.body.userID; //extract ID

        const responseData = await oweSchema.find({ 
             userID: id 
            });

        res.status(200).json({ data: responseData });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getExpenseRow = async (req, res) => {
    try{
        const id = req.body.userID; //extract ID

        const responseData = await expenseSchema.find({ 
             userID: id 
            });

        console.log(responseData)
        res.status(200).json({ data: responseData });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//************ GET API Functions *************/


