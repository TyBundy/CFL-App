//import required modules
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const Joi = require("joi");
const Token = require("../models/token");
const sendEmail = require("../utils/sendEmail");
const jwt = require('jsonwebtoken');

//eports function that sends password reset link to user email
exports.emailUser = async(req, res) => {
    try {
        //validate the request body
        const schema = Joi.object({ email: Joi.string().email().required() });
        const { error } = schema.validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        //find user by email
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(400).send("user with given email doesn't exist");
        }

        // delete the existing user's token
        let token = await Token.findOne({ userId: user._id });
        if (token) {
            await token.deleteOne();
        }

        //create new reset token
        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        let resetToken = jwt.sign({_id: user._id}, process.env.JWTPRIVATEKEY);
        const hashResetToken = await bcrypt.hash(resetToken, salt);

        //Saves reset token in database
        token = await new Token({
                userId: user._id,
                token: hashResetToken,
                createdAt: Date.now(),
            }).save();
        
        //generate password reset link
        const link = `${process.env.BASE_URL}/password-reset/${user._id}/${token.token}`;
        //sends email to user
        await sendEmail(user.email, "Password reset", link);
        
        res.send("password reset link sent to your email account");
        return link;
    } catch (error) {
        res.send("An error occured");
        console.log(error);
    }
}

//exports function to reset user password
exports.resetPassword = async(res, req) => {
    try {
        //validates requests body
        const schema = Joi.object({ password: Joi.string().required() });
        const { error } = schema.validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        //find user by userID
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(400).send("invalid link or expired");

        //find token of user 
        const token = await Token.findOne({
            userId: user._id,
        });
        if (!token) return res.status(400).send("Invalid link or expired");
        
        //Encrypts user's new password and updates it in database
        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashPassword = await bcrypt.hash(req.body.password, salt)
        user.password = hashPassword;
        await User.updateOne(
            { _id: user._id },
            { $set: { password: hashPassword } },
            { new: true }
          );

        res.send("password reset sucessfully.");
    } catch (error) {
        console.log(error);
    }
}

//function to validate request body
const validate = (data) => {
    const schema = Joi.object({
        email: Joi.string().email().required().label("Email")
    });
    return schema.validate(data);
}