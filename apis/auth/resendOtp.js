import db from "../../models/index.js";
import * as service from "../service/index.js";

export const resendOtp = (req, res) => {
    let { id } = req.body;
    db.user.findByPk(id)
    .then(async data=>{
        if(data){
            
            try{
                let otp =  Math.floor(Math.random() * 1000000);
                if(otp < 900000){
                    otp +=  100000
                }
                await db.userMeta.update({otp},{where : {userId : id}});
                await service.sendMail(data.email,otp);
                res.status(200).json({success: true,message: `Otp is successfuly sent`});
            }
            catch(err){
                return res.status(400).json({success : false,message: `there is something error please try again later`});
            }
        }
        else{
            res.status(400).json({success: false,message: "user does not exist please try again later"});
        }
    })
    .catch(err=>{
        res.status(400).json({success: false,message: "There is some issue please try again later"});
    })

}