let User = require('../models/user');
let Token = require('../models/token');
let jwt = require('jsonwebtoken');
let bcrypt = require('bcryptjs');
let Joi = require("joi");
let passwordComplexity = require("joi-password-complexity");
let crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');


//************ POST API Functions *************/

exports.createUser = async (req, res) => { //Exports a single function, 'createUser'
    try{
        let { error } = validate(req.body);
        if(error) {
            return res.status(400).send( { message: error.details[0].message });
        }
        
        let user = await User.findOne({email: req.body.email });
        if(user) {
            return res.status(409).send({ message: "A user with that email already exists" });
        }
        
        let salt = await bcrypt.genSalt(Number(process.env.SALT));
        let hashPassword = await bcrypt.hash(req.body.password, salt);        

        user = new User({
            ...req.body,
          });
      
        let token = jwt.sign({ _id: user._id }, process.env.JWTPRIVATEKEY);
        let encryptToken = await bcrypt.hash(token, salt);
        user.password = hashPassword;
        user.token = encryptToken;
        console.log(user._id);

        /************* VERIFY EMAIL CODE (NOT WORKING CURRENTLY) ****************/
		// let findToken = await Token.findOne({ userId: user._id });
		// if (!findToken) {
		//     token = await new Token({
		// 	userId: user._id,
		// 	token: crypto.randomBytes(32).toString("hex"),
		//     }).save();
		// 	const url = `${process.env.BASE_URL}users/${user._id}/verify/${token.token}`;
		// 	await sendEmail(user.email, "Verify Email", url);
        //     res
		// 	.status(400)
		// 	.send({ message: "An Email sent to your account please verify" });

		// }

        await user.save();
        res.status(201).json({ user: user, token: encryptToken });
    } catch (error) {
        console.log(error.stack);
        res.status(500).json( { message: "Internal Server Error" });
    }
};

let validate = (data) => {
    let schema = Joi.object({
        firstName: Joi.string().required().label("First Name"),
        lastName: Joi.string().required().label("Last Name"),
        email: Joi.string().email().required().label("Email"),
        password: passwordComplexity().required().label("Password")
    });
    return schema.validate(data);
}