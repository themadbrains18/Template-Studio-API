import db from "../../models/index.js";

export const save = async(req, res) => {
    try {
        let response = await db.newsLetter.create(req.body);
        if(response){
            return res.send({status : 200, message :'Newsletter subscription submitted'});
        }
    } catch (error) {
        return res.send({status : 500, message :error.parent.sqlMessage})
    }
}

export const getAll = async(req, res) => {
    try {
        let response = await db.newsLetter.findAll({});
        if(response){
            return res.send({status : 200, data : response})
        }
    } catch (error) {
        console.log(error,'===================')
        return res.send({status : 500, message :error})
    }
}