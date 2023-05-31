import db from "../../models/index.js";

export const save = async(req, res) => {
    try {
        let response = await db.softwareType.create(req.body);
        if(response){
            return res.send({status : 200, message :'SoftwareType create successfully'})
        }
    } catch (error) {
        return res.send({status : 500, message :error.parent.sqlMessage})
    }
}

export const getByCategoryId = async(req, res) => {
    try {
        let response = await db.softwareType.findAll({where :{categoryId : req.query.id}});
        if(response){
            return res.send({status : 200, data : response})
        }
    } catch (error) {
        console.log(error,'===================')
        return res.send({status : 500, message :error})
    }
}

export const getAll = async(req, res) => {
    try {
        let response = await db.softwareType.findAll({});
        if(response){
            return res.send({status : 200, data : response})
        }
    } catch (error) {
        console.log(error,'===================')
        return res.send({status : 500, message :error})
    }
}