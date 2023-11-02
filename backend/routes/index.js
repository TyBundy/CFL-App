const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const loginController = require('../controllers/loginController');
const tableController = require('../controllers/tableController');
const summaryController = require('../controllers/summaryController');
const forgotController = require('../controllers/forgotController');

// Explanation: Routes that maps the '/<name>' endpoint to the related controller function

//************ POST API Endpoints *************/

//Create Database Functions
router.post('/users', userController.createUser);
router.post('/liveRow', tableController.createLiveRow);
router.post('/giveRow', tableController.createGiveRow);
router.post('/growRow', tableController.createGrowRow);
router.post('/oweRow', tableController.createOweRow);
router.post('/expenseRow', tableController.createExpenseRow);
router.post('/summary', summaryController.createSummary);

//Delete Database Functions
router.post('/deleteLiveRow', tableController.deleteLiveRow);
router.post('/deleteGiveRow', tableController.deleteGiveRow);
router.post('/deleteGrowRow', tableController.deleteGrowRow);
router.post('/deleteOweRow', tableController.deleteOweRow);
router.post('/deleteExpenseRow', tableController.deleteExpenseRow);

//Retrieval Database Functions
router.post('/getLiveRow', tableController.getLiveRow);
router.post('/getGiveRow', tableController.getGiveRow);
router.post('/getGrowRow', tableController.getGrowRow);
router.post('/getOweRow', tableController.getOweRow);
router.post('/getExpenseRow', tableController.getExpenseRow);
router.post('/getSummary', summaryController.getSummary);
router.post('/findUsers', loginController.findUser); //finds user according to email unique key


//Update Database Functions
router.post('/updateSummary', summaryController.updateSummary);


//Sends password link
router.post('/link', forgotController.emailUser);
//Resets password
router.post('/forgotPassword', forgotController.resetPassword);

module.exports = router;