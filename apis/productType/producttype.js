import db from "../../models/index.js";

export const save = async(req, res) => {
    try {
        let response = await db.productType.create(req.body);
        if(response){
            return res.send({status : 200, message :'ProductType create successfully'})
        }
    } catch (error) {
        return res.send({status : 500, message :error.parent.sqlMessage})
    }
}

export const getAll = async(req, res) => {
    try {
        let response = await db.productType.findAll({});
        if(response){
            return res.send({status : 200, data : response})
        }
    } catch (error) {
        console.log(error,'===================')
        return res.send({status : 500, message :error})
    }
}