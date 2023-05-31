import db from "../../models/index.js";

export const save = async(req, res) => {
    try {
        if(req.body.industry === ""){
            return res.send({status : 500, message :'Please enter indutry name'})
        }
        let response = await db.industry.create(req.body);
        if(response){
            return res.send({status : 200, message :'indrusty create successfully'})
        }
    } catch (error) {
        return res.send({status : 500, message :error.parent.sqlMessage})
    }
}

export const getAll = async(req, res) => {
    try {
        let response = await db.industry.findAll({});
        if(response){
            return res.send({status : 200, data : response})
        }
    } catch (error) {
        return res.send({status : 500, message :error.parent.sqlMessage})
    }
}