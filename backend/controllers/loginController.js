//imports necessary modules
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const Joi = require("joi");
const Token = require('../models/token');
const crypto = require('crypto');
const sendEmail = require("../utils/sendEmail");

//function to validate user input
const validate = (data) => {
    const schema = Joi.object({
        email: Joi.string().email().required().label("Email"),
        password: Joi.string().required().label("Password")
    });
    return schema.validate(data);
}

//exports function to login user
exports.findUser = async (req, res) => {
    try {
        //validates request body
        const { error } = validate(req.body);
        if(error) {
            console.log("I do get here");
            return res.status(400).send( { message: error.details[0].message });
        }
        
        //finds the user with the email 
        const user = await User.findOne({email: req.body.email });
        if(!user) {
            //sends error if user not found
            return res.status(401).send({message: "Invalid Email or Password" });
        }

        //validate user password
        const validatePassword = await bcrypt.compare(
            req.body.password, user.password
        );
        
        //sends error if password is incorrect
        if(!validatePassword) {
            return res.status(401).send({message: "Invalid Email or Password" });
        }

        //generate token for user
        const token = user.generateAuthToken();
		res.status(200).send({ data: { token, userID: user._id }, message: "logged in successfully" });
        console.log("the user ID is: " + user._id);
    } catch(error) {
        console.log(error.stack);
        console.log("This is an error");
        res.status(500).json( { message: "Internal Server Error" });
    }

};


