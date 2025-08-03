const validator = require("validator")

const validationSignUp = (req) => {
    const {firstName, lastName, emailId, password} = req.body;

    if(!firstName || !lastName){
        throw new Error("firstName and lastName are mandatory fields");
    }else if(!validator.isEmail(emailId)){
        throw new Error("invalid emailId")
    }else if(!validator.isStrongPassword(password)){
        throw new Error("weak password, please set strong")
    }
}



module.exports = validationSignUp;