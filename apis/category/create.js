import db from "../../models/index.js";

export const save = async (req, res) => {
    try {
        let response = await db.category.create(req.body);
        if (response) {
            return res.send({ status: 200, message: 'category create successfully' })
        }
    } catch (error) {
        return res.send({ status: 500, message: error.parent.sqlMessage })
    }
}

export const getAll = async (req, res) => {
    try {
        let response = await db.category.findAll({
            include: [
                {
                    model: db.subCategory,
                }
            ]
        });
        if (response) {
            return res.send({ status: 200, data: response })
        }
    } catch (error) {
        return res.send({ status: 500, message: error.parent.sqlMessage })
    }
}