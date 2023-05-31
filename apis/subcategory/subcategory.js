import db from "../../models/index.js";

export const save = async (req, res) => {
    try {
        let response = await db.subCategory.create(req.body);
        if (response) {
            return res.send({ status: 200, message: 'subCategory create successfully' })
        }
    } catch (error) {
        return res.send({ status: 500, message: error.parent.sqlMessage })
    }
}

export const getAllByCategoryId = async (req, res) => {
    try {
        let response = await db.subCategory.findAll({ where: { categoryId: req.query.id } });
        if (response) {
            return res.send({ status: 200, data: response })
        }
    } catch (error) {
        console.log('=====error', error)
        return res.send({ status: 500, message: error.parent.sqlMessage })
    }
}

export const getAll = async (req, res) => {
    try {
        let response = await db.subCategory.findAll({});
        if (response) {
            return res.send({ status: 200, data: response })
        }
    } catch (error) {
        return res.send({ status: 500, message: error.parent.sqlMessage })
    }
}

// export const getProductBySubcategoryId = async (req, res) => {
//     try {
//         let response = await db.subCategory.findOne({
//             where: { id: 5 },
//             include: [
//                 {
//                     model: db.templateSubCategory,
//                     // include: [{
//                     //     model: db.product
//                     // }]
//                 }
//             ]
//         });
//         if (response) {
//             return res.send({ status: 200, data: response })
//         }
//     } catch (error) {
//         console.log(error);
//         return res.send({ status: 500, message: error })
//     }
// }