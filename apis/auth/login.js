import db from "../../models/index.js";
import jwt from "jsonwebtoken";
import CryptoJS from "crypto-js";
import { Op } from "sequelize";

export const login = (req, res) => {
    let { email, password } = req.body;
    db.user.findOne({ where: { email } })
        .then(data => {
            if (data) {
                if (data.status === "unActive") {
                    return res.status(400).json({ success: false, message: `please verify your account` });
                }
                let decryptPassword = CryptoJS.AES.decrypt(data.password, process.env.CRYPTO_SECRETKEY);
                decryptPassword = decryptPassword.toString(CryptoJS.enc.Utf8);
                if (decryptPassword === password) {
                    let token = jwt.sign({ id: data.id }, process.env.JWT_PRIVATEKEY, { expiresIn: '24h' });
                    // res.cookie( "token", token,{httpOnly:true,expires: new Date(Date.now() + (1000 * 60) * 2 )});
                    let obj = { name: data.name, email: data.email, access_token: token };
                    return res.status(200).json({ success: true, message: `Login Successfully, Welcome ${data.name}`, obj });
                } else {
                    return res.status(400).json({ success: false, message: `Password is incorrect` });
                }
            } else {
                return res.status(400).json({ success: false, message: 'Email and Password not matched' });
            }
        })
        .catch(err => {
            console.log("err", err)
            return res.status(400).json({ success: false, message: 'There is something error please tyr again later' });
        });
}

// ===================================================================
// ====user authenticate everytime Request Login user ================
// ===================================================================
export const userAuthenticate = async (req, res) => {
    try {
        const { email } = req?.body;
        if (email !== '') {
            var condition = email ? { email: { [Op.like]: email } } : null;
            db.user.findOne({ where: condition }).then(async (result) => {
                if (result) {
                    let token = req.headers?.token

                    let obj = { name: result.name, email: result.email, access_token: token };

                    res.send({ status: 200, data: obj });
                }
                else {
                    res.send({ status: 404, message: 'User Not Exist' })
                }
            }).catch((error) => {
                console.error('===', error);
            })
        }
    } catch (error) {
        console.error('===', error);
        res.send({ status: 500, data: error.message });
    }

}