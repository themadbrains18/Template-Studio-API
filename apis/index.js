import express from 'express';
const router = express.Router();

import * as auth from './auth/index.js';
import * as user from './user/index.js';
import * as dashboard from './dashboard/index.js';
import * as category from './category/index.js';
import * as subcategory from './subcategory/index.js';
import * as industry from './industry/index.js';
import * as softwareType from './softwaretype/index.js';
import * as productType from './productType/producttype.js';
import * as newsLeeter from './newsLetters/index.js';
import * as download from './download/index.js';

import {jwtauth} from '../middleware/index.js';


import multer from 'multer';
import subCategory from '../models/subCategory.js';
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() 
        cb(null, file.fieldname + '-' +uniqueSuffix+'-'+ file.originalname)
    }
})
const upload = multer({ storage: storage })
const cpUpload = upload.fields([{ name: 'sourceFile', maxCount: 1 }, { name: 'sliderImages', maxCount: 20 }, { name: 'fullPageImages', maxCount: 20 }])

// Auth Apis
router.post('/api/auth/signup', auth.signup);
router.post('/api/auth/verify', auth.verify);
router.post('/api/auth/login', auth.login);
router.post('/api/auth/forgetpassword', auth.forgotPassword);
router.post('/api/auth/resend-otp', auth.resendOtp);
router.post('/api/auth/setpassword', auth.setPassword);
router.post('/api/auth/userinfo',jwtauth,auth.userAuthenticate);

// User Apis
router.get('/users', user.search);
router.put('/users/:id', user.update);
router.delete('/users/:id', user.remove);


// Dashboard Apis
router.post('/dashboard', jwtauth, dashboard.getUser);
router.post('/dashboard/upload',jwtauth, cpUpload, dashboard.upload);
router.get('/api/dashboard/all',dashboard.getAll);
router.get('/api/admin/dashboard/all',jwtauth,dashboard.getAll);
router.get('/api/dashboard/detail/:id',dashboard.getProductBySlug);
router.post('/dashboard/edit/:id',jwtauth, cpUpload,dashboard.editTemplate);
router.post('/dashboard/add/relevant/:id',jwtauth, cpUpload,dashboard.addRelevantTemplate);

/**
 * Category Routes
 */
router.post('/api/category/create',jwtauth, category.save);
router.get('/api/category/all', category.getAll);

/**
 * SubCategory Routes
 */
router.post('/api/subcategory/create',jwtauth, subcategory.save);
router.get('/api/subcategory/getById', subcategory.getAllByCategoryId);
router.get('/api/subcategory/all', subcategory.getAll);
// router.get('/api/product/bySubcategoryId',subcategory.getProductBySubcategoryId);

/**
 * Industry Routes
 */
router.post('/api/industry/create',jwtauth, industry.save);
router.get('/api/industry/all', industry.getAll);

/**
 * Software Routes
 */
router.post('/api/software/create',jwtauth, softwareType.save);
router.get('/api/software/all', softwareType.getAll);
router.get('/api/software/getByCategoryId',softwareType.getByCategoryId);
/**
 * Product Type Routes
 */
router.post('/api/producttype/create',jwtauth, productType.save);
router.get('/api/producttype/all', productType.getAll);

/**
 * 
 * @param {*} filename 
 * @returns 
 */
router.post('/api/newsletter/create',jwtauth,newsLeeter.save);
router.get('/api/newsletter/all',newsLeeter.getAll);

/**
 * 
 * @param {*} filename 
 * @returns 
 */
router.post('/api/download/create',jwtauth,download.save);
router.get('/api/download/all',download.getAll);

// // Dashboard Apis
// let getFile = (filename) => {
//     const s3 = new AWS.S3({
//         accessKeyId: process.env.AWS_ACCESS_Key,
//         secretAccessKey: process.env.AWS_SECRET_Key,
//     });
//     const downloadParams = {
//         Bucket: process.env.AWS_BUCKET,
//         Key: filename
//     };
//     return s3.getObject(downloadParams).createReadStream();
// }

// router.get('/download/:key', async (req, res) => {
//     jwt.verify(req.query.token, process.env.JWT_PRIVATEKEY, async function (err, decoded) {
//         if (err) { return res.status(404).json({ success: false, message: "Not found!" }) }
//         const product = await db.file.findOne({ where: { sourceFile: req.params.key } })
//         if (product === null) {
//             return res.status(404).json({ success: false, message: "Not found!" });
//         }
//         else {
//             if (product.sourceFilePassword) {
//                 if (decoded.password != product.sourceFilePassword) { return res.status(400).json({ success: false, message: "Incorrect Password" }) }
//             }
//             let downloadFile = getFile(decoded.name);
//             downloadFile.pipe(res)
//         }
//     });
// });

export default router;