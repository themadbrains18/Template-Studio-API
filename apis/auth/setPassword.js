import db from "../../models/index.js";
import  CryptoJS  from "crypto-js";
import moment from "moment/moment.js";


export const setPassword = (req, res) => {
    let {otp,id,password} = req.body;
    
    db.userMeta.findOne({where: {userId : id}})
    .then(async data=>{
        if(!moment().isBetween(data.updatedAt,moment(data.updatedAt).add(5, 'minutes'))){
            return res.status(400).json({success : false,message: "Otp is expired"});
        }
        if(otp == data.otp){
            try{
                password = CryptoJS.AES.encrypt(password, process.env.CRYPTO_SECRETKEY).toString();
                await db.user.update({ password }, {where: {id}});
                await db.userMeta.destroy({where: {userId : id}});
                return res.status(201).json({success : true,message: "password is Updated"});
            }catch(err){
                console.log(err);
                return res.status(400).json({success : false,message: 'There is something error please tyr again later'});
            }
        }else{
            return res.status(400).json({success : false,message: "Otp is incorrect"});
        }
    })
    .catch(err=>{
        console.log("err",err)
        return res.status(400).json({success : false,message: 'There is something error please tyr again later'});
    });
}


