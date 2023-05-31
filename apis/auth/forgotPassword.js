import db from "../../models/index.js";
import * as service from "../service/index.js"

export const forgotPassword = (req, res) => {
    let {email} = req.body;
    db.user.findOne({ where: { email  } })
        .then(async data=>{
            if(data){
                if(data.status === "unActive"){
                    return res.status(400).json({success : false,message: `please verify your account`});
                }
                let otp =  Math.floor(Math.random() * 1000000);
                if(otp < 900000){
                    otp +=  100000
                }
                await service.sendMail(email,otp);
                await db.userMeta.update({otp},{where : {userId : data.id}});
                return res.status(200).json({success : true,message: `please enter otp`,userId : data.id});
            }else{
                return res.status(400).json({success : false,message: 'Please check your email'});    
            }
        })
        .catch(err=>{
            console.log("err",err)
            return res.status(400).json({success : false,message: 'User does not exist please signup'});
        });
}