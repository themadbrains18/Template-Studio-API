import db from "../../models/index.js";
import  CryptoJS  from "crypto-js";
import  * as service  from "../service/index.js";


export const signup = async (req, res) => {

    let {name,email,password,confirmPassword} = req.body;
    password =  password.toString();
    confirmPassword = confirmPassword.toString();
    if(!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()){
        return res.status(400).json({success : false,message: "All feilds are Required "});
    }
    else if(password !== confirmPassword){
        return res.status(400).json({success : false,message: "pasword and confirm password is not same"});
    }
    password = CryptoJS.AES.encrypt(password, process.env.CRYPTO_SECRETKEY).toString();
    try{
        let otp =  Math.floor(Math.random() * 1000000);
        if(otp < 900000){
            otp +=  100000
        }
        await service.sendMail(email,otp);
        let newUser = await db.user.create({name,email,password,status:'unActive'});
        console.log(newUser,"==new user");
        await db.userMeta.create({otp,userId : newUser.id });
        return res.status(200).json({success : true,message: `Please enter Otp`,userId:newUser.id });
    } catch (error) {
        console.log(error);
        if(error.errors){
            return res.status(400).json({success : false,message: error.errors[0].message});
        }
        else{
            return res.status(400).json({success : false,message: 'There is something error please tyr again later'});
        }        
    };
}
