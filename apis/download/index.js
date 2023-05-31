import db from "../../models/index.js";

export const save = async (req, res) => {
    try {
        let validate = await db.download.findAll({ where: { userId: req.body.userId, paymentType: false } });
        if (validate.length === 3) {
            return res.send({ status: 200, message: 'Your free download limit is expired.' });
        }
        let response = await db.download.create(req.body);
        if (response) {
            return res.send({ status: 200, message: 'Template download Successfully' });
        }
    } catch (error) {
        return res.send({ status: 500, message: error.parent.sqlMessage })
    }
}

export const getAll = async (req, res) => {
    try {
        let response = await db.download.findAll({
            include: [
                {
                    model: db.user
                }
            ]
        });
        if (response) {
            return res.send({ status: 200, data: response })
        }
    } catch (error) {
        console.log(error, '===================')
        return res.send({ status: 500, message: error })
    }
}