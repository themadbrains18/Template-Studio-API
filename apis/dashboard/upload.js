import { json } from "sequelize";
import db from "../../models/index.js";
import fs from "fs";
import { log } from "console";

// const uploadFile = (filePath, keyName) => {
//     const s3 = new AWS.S3({
//         accessKeyId: process.env.AWS_ACCESS_Key,
//         secretAccessKey: process.env.AWS_SECRET_Key,
//     });
//     return new Promise((resolve, reject) => {
//         try {
//             const file = fs.readFileSync(filePath);
//             const uploadParams = {
//                 Bucket: process.env.AWS_BUCKET,
//                 Key: keyName,
//                 Body: file
//             };
//             s3.upload(uploadParams, function (err, data) {
//                 if (err) {
//                     return reject(err);
//                 }
//                 if (data) {
//                     return resolve(data);
//                 }
//             });
//         }
//         catch (err) {
//             return reject(err);
//         }
//     })
// }



export const upload = async (req, res) => {

    try {
        console.log('====================================');
        console.log(req.body);
        console.log('====================================');
        let { category, subCategory, softwareType, productType, name, version, description, variant, seoKeywords, price, sourceFilePassword } = req.body;

        let fontArray = [];
        let fonts = req.body.font;
        fonts.map((item) => {
            let ft = JSON.parse(item)
            fontArray.push({ "fontName": ft.fontName, "fontUrl": ft.fontUrl });
        })

        let imageArray = [];
        let images = req.body.images;
        images.map((item) => {
            let img = JSON.parse(item);
            imageArray.push({ "imageName": img.name, "imageUrl": img.imageUrl });
        })

        let iconArray = [];
        let icons = req.body.icons;
        icons.map((item) => {
            let ic = JSON.parse(item)
            iconArray.push({ "iconName": ic.name, "iconUrl": ic.iconUrl });
        })

        let technicalArray = [];
        let technicals = req.body.technical;
        technicals.map((item) => {
            let tc = JSON.parse(item)
            technicalArray.push(tc.name);
        })

        let sliderImages = req.files['sliderImages'];
        let fullImages = req.files['fullPageImages'];
        let sourceFiles = req.files['sourceFile'][0];

        let newProduct = await db.product.create({ name, version, description, productType, variant, seoKeywords, price, fonts: fontArray, images: imageArray, icons: iconArray, technical: technicalArray });

        await newProduct.createFile({ sourceFile: sourceFiles.filename, sourceFilePassword, productId: newProduct.id });

        await db.templateCategory.create({ productId: newProduct.id, categoryId: category });

        let subcategoryData = subCategory.split(',');
        for (const subc of subcategoryData) {
            await db.templateSubCategory.create({ productId: newProduct.id, subCategoryId: parseInt(subc) });
        }

        for (const soft of softwareType) {
            await db.templateSoftwareType.create({ productId: newProduct.id, softwareTypeId: soft });
        }

        // console.log(req.body.industry.split(',') ,'===industry');
        let IndustryTypes = req.body.industry.split(',');
        for (const indus of IndustryTypes) {
            await db.templateIndrusty.create({ productId: newProduct.id, industryId: indus });
        }

        for (const slides of sliderImages) {
            await db.templateSliderImages.create({ productId: newProduct.id, filename: slides.filename })
        }

        for (const img of fullImages) {
            await db.templateFullImages.create({ productId: newProduct.id, filename: img.filename })
        }


        return res.status(200).json({ success: true, message: "Product is uploaded" });
    } catch (error) {
        console.log('upload template error', error)
    }

}

export const getAll = async (req, res) => {
    try {
        let products = await db.product.findAll({
            include: [
                {
                    model: db.templateSliderImages,
                    attributes: {
                        exclude: ["id", "createdAt", "updatedAt", "productId"]
                    },
                },
                {
                    model: db.templateFullImages,
                    attributes: {
                        exclude: ["id", "createdAt", "updatedAt", "productId"]
                    },
                },
                {
                    model: db.file,
                    attributes: {
                        exclude: ["id", "createdAt", "updatedAt", "productId"]
                    },
                },
                {
                    model: db.templateSoftwareType,
                    include: [
                        {
                            model: db.softwareType, attributes: {
                                exclude: ["id", "createdAt", "updatedAt", "categoryId"]
                            }
                        }
                    ],
                    attributes: {
                        exclude: ["id", "createdAt", "updatedAt", "templateSoftwareTypeId", "productId"]
                    },
                },
                {
                    model: db.templateIndrusty,
                    include: [
                        {
                            model: db.industry, attributes: {
                                exclude: ["id", "createdAt", "updatedAt"]
                            }
                        }
                    ],
                    attributes: {
                        exclude: ["id", "createdAt", "updatedAt", "productId", "templateIndrustyId"]
                    },
                },
                {
                    model: db.templateCategory,
                    include: [
                        {
                            model: db.category, attributes: {
                                exclude: ["id", "createdAt", "updatedAt"]
                            }
                        }
                    ],
                    attributes: {
                        exclude: ["id", "createdAt", "updatedAt", "productId", "templateCategoryId"]
                    },
                },
                {
                    model: db.templateSubCategory,
                    include: [
                        {
                            model: db.subCategory, attributes: {
                                exclude: ["id", "createdAt", "updatedAt", "category"]
                            }
                        }
                    ],
                    attributes: {
                        exclude: ["id", "createdAt", "updatedAt", "productId", "templateSubCategoryId",]
                    },
                }

            ]
        });
        if (products) {
            return res.send({ status: 200, data: products })
        }
    } catch (error) {

    }
}

export const getProductBySlug = async (req, res) => {
    try {
        let products = await db.product.findOne({
            where: { id: req.params.id },
            include: [
                {
                    model: db.templateSliderImages,
                    attributes: {
                        exclude: ["createdAt", "updatedAt", "productId"]
                    },
                },
                {
                    model: db.relevantProduct,
                },
                {
                    model: db.templateFullImages,
                    attributes: {
                        exclude: ["createdAt", "updatedAt", "productId"]
                    },
                },
                {
                    model: db.file,
                    attributes: {
                        exclude: ["createdAt", "updatedAt", "productId"]
                    },
                },
                {
                    model: db.templateSoftwareType,
                    include: [
                        {
                            model: db.softwareType, attributes: {
                                exclude: ["id", "createdAt", "updatedAt", "categoryId"]
                            }
                        }
                    ],
                    attributes: {
                        exclude: ["id", "createdAt", "updatedAt", "templateSoftwareTypeId", "productId"]
                    },
                },
                {
                    model: db.templateIndrusty,
                    include: [
                        {
                            model: db.industry, attributes: {
                                exclude: ["id", "createdAt", "updatedAt"]
                            }
                        }
                    ],
                    attributes: {
                        exclude: ["id", "createdAt", "updatedAt", "productId", "templateIndrustyId"]
                    },
                },
                {
                    model: db.templateCategory,
                    include: [
                        {
                            model: db.category, attributes: {
                                exclude: ["id", "createdAt", "updatedAt"]
                            }
                        }
                    ],
                    attributes: {
                        exclude: ["id", "createdAt", "updatedAt", "productId", "templateCategoryId"]
                    },
                },
                {
                    model: db.templateSubCategory,
                    include: [
                        {
                            model: db.subCategory, attributes: {
                                exclude: ["id", "createdAt", "updatedAt", "category"]
                            }
                        }
                    ],
                    attributes: {
                        exclude: ["id", "createdAt", "updatedAt", "productId", "templateSubCategoryId",]
                    },
                }

            ]
        });
        if (products) {
            return res.send({ status: 200, data: products })
        }
    } catch (error) {
        console.log(error, 'get product slug data')
    }
}

export const editTemplate = async (req, res) => {

    try {
        console.log('====================================');
        console.log(req.body);
        console.log('====================================');
        res.status(200).json({ success: true, message: "Product is uploaded" });
        const directoryPath = "./uploads/";
        let { subCategory, softwareType, productType, industry, name, version, description, variant,
            seoKeywords, price, sourceFilePassword, fontName, fontUrl, imagesWebsiteName, imagesUrl, iconsWebsiteName,
            iconsUrl, technical, removedSlider, removedFullPageImage, relevantTemplateId } = req.body;

        let existingTemplate = await db.product.findOne({ where: { id: req.params.id } });

        if (relevantTemplateId > 0) {
            existingTemplate = await db.relevantProduct.findOne({ where: { id: relevantTemplateId } });
        }

        if (removedSlider !== '') {

            removedSlider = removedSlider.split(',');
        }
        if (removedFullPageImage !== '') {

            removedFullPageImage = removedFullPageImage.split(',');
        }

        for await (const sl of removedSlider) {
            let iam = await db.templateSliderImages.findOne({ where: { id: parseInt(sl) } });
            await iam.destroy();
            const fileName = iam.filename;
            fs.unlink(directoryPath + fileName, (err) => {
                if (err) {
                    res.send({
                        status: 500,
                        message: "Could not delete the file. " + err,
                    });
                }
            });
        }

        for await (const sl of removedFullPageImage) {
            let iam = await db.templateFullImages.findOne({ where: { id: parseInt(sl) } });
            await iam.destroy();
            const fileName = iam.filename;
            fs.unlink(directoryPath + fileName, (err) => {
                if (err) {
                    res.send({
                        status: 500,
                        message: "Could not delete the file. " + err,
                    });
                }
            });
        }

        let fontArray = [];
        fontName.map((item, index) => {
            fontArray.push({ "fontName": item, "fontUrl": fontUrl[index] });
        })

        let imageArray = [];
        imagesWebsiteName.map((item, index) => {
            imageArray.push({ "imageName": item, "imageUrl": imagesUrl[index] });
        })

        let iconArray = [];
        iconsWebsiteName.map((item, index) => {
            iconArray.push({ "iconName": item, "iconUrl": iconsUrl[index] });
        })

        let sliderImages = req.files['sliderImages'];
        let fullImages = req.files['fullPageImages'];
        let sourceFiles = req.files['sourceFile'];

        let newProduct = await existingTemplate.update({ name, version, description, productType, variant, seoKeywords, price, fonts: fontArray, images: imageArray, icons: iconArray, technical });

        // if (sourceFiles !== undefined && req.files['sourceFile'].length > 0) {

        //     let zip = await db.file.findOne({ where: { productId: req.params.id } });
        //     const fileName = zip.sourceFile;
        //     fs.unlink(directoryPath + fileName, (err) => {
        //         if (err) {
        //             res.send({
        //                 status: 500,
        //                 message: "Could not delete the file. " + err,
        //             });
        //         }
        //     });

        //     await zip.destroy();
        //     await newProduct.createFile({ sourceFile: sourceFiles[0].filename, sourceFilePassword, productId: newProduct.id });
        // }

        if (relevantTemplateId > 0) {
            await db.templateSubCategory.destroy({ where: { productId: req.params.id, relevantproductid: relevantTemplateId } });
            for (const subc of subCategory) {
                await db.templateSubCategory.create({ productId: newProduct.id, subCategoryId: subc, relevantproductid: relevantTemplateId });
            }
        }
        else {
            await db.templateSubCategory.destroy({ where: { productId: req.params.id, relevantproductid: null } });
            for (const subc of subCategory) {
                await db.templateSubCategory.create({ productId: newProduct.id, subCategoryId: subc });
            }
        }

        if (relevantTemplateId > 0) {
            await db.templateSoftwareType.destroy({ where: { productId: req.params.id, relevantproductid: relevantTemplateId } });
            for (const soft of softwareType) {
                await db.templateSoftwareType.create({ productId: newProduct.id, softwareTypeId: soft, relevantproductid: relevantTemplateId });
            }
        }
        else {
            await db.templateSoftwareType.destroy({ where: { productId: req.params.id, relevantproductid: null } });
            for (const soft of softwareType) {
                await db.templateSoftwareType.create({ productId: newProduct.id, softwareTypeId: soft });
            }
        }


        if (relevantTemplateId > 0) {
            await db.templateIndrusty.destroy({ where: { productId: req.params.id, relevantproductid: relevantTemplateId } });
            for (const indus of industry) {
                await db.templateIndrusty.create({ productId: newProduct.id, industryId: indus, relevantproductid: relevantTemplateId });
            }
        }
        else {
            await db.templateIndrusty.destroy({ where: { productId: req.params.id, relevantproductid: null } });
            for (const indus of industry) {
                await db.templateIndrusty.create({ productId: newProduct.id, industryId: indus });
            }
        }



        // if (sliderImages !== undefined && sliderImages.length > 0) {
        //     for (const slides of sliderImages) {
        //         await db.templateSliderImages.create({ productId: newProduct.id, filename: slides.filename })
        //     }
        // }

        // if (fullImages !== undefined && fullImages.length > 0) {
        //     for (const img of fullImages) {
        //         await db.templateFullImages.create({ productId: newProduct.id, filename: img.filename })
        //     }
        // }

        return res.status(200).json({ success: true, message: "Product is uploaded" });
    } catch (error) {

    }

}

export const addRelevantTemplate = async (req, res) => {

    try {

        const directoryPath = "./uploads/";
        let { subCategory, softwareType, productType, industry, name, version, description, variant,
            seoKeywords, price, sourceFilePassword, fontName, fontUrl, imagesWebsiteName, imagesUrl, iconsWebsiteName,
            iconsUrl, technical, removedSlider, removedFullPageImage } = req.body;

        console.log('====================================');
        console.log(req.body);
        console.log('====================================');

        let fontArray = [];
        fontName.map((item, index) => {
            fontArray.push({ "fontName": item, "fontUrl": fontUrl[index] });
        })

        let imageArray = [];
        imagesWebsiteName.map((item, index) => {
            imageArray.push({ "imageName": item, "imageUrl": imagesUrl[index] });
        })

        let iconArray = [];
        iconsWebsiteName.map((item, index) => {
            iconArray.push({ "iconName": item, "iconUrl": iconsUrl[index] });
        })

        let sliderImages = req.files['sliderImages'];
        let fullImages = req.files['fullPageImages'];
        let sourceFiles = req.files['sourceFile'];

        let newProduct = await db.relevantProduct.create({
            product_id: req.params.id, name, version, description, productType, variant,
            seoKeywords, price, fonts: fontArray, images: imageArray, icons: iconArray, technical
        });

        if (sourceFiles !== undefined && req.files['sourceFile'].length > 0) {
            await newProduct.createFile({ sourceFile: sourceFiles[0].filename, sourceFilePassword, productId: req.params.id, relevantproductid: newProduct.id });
        }

        for (const subc of subCategory) {
            await db.templateSubCategory.create({ productId: req.params.id, subCategoryId: subc, relevantproductid: newProduct.id });
        }

        // await db.templateSoftwareType.destroy({where :{productId : req.params.id}});
        for (const soft of softwareType) {
            await db.templateSoftwareType.create({ productId: req.params.id, softwareTypeId: soft, relevantproductid: newProduct.id });
        }

        // await db.templateIndrusty.destroy({where :{productId : req.params.id}});
        for (const indus of industry) {
            await db.templateIndrusty.create({ productId: req.params.id, industryId: indus, relevantproductid: newProduct.id });
        }

        if (removedSlider !== '') {
            removedSlider = removedSlider.split(',');
        }
        
        // get existing main template images
        let sliderImagesExistingTemplate = await db.templateSliderImages.findAll({ where: { productId: req.params.id } });

        // save remaing images for relevant template
        if (removedSlider.length > 0) {
            sliderImagesExistingTemplate.map(async(item) => {
                if (removedSlider.includes(item.id.toString()) === false) {
                    await db.templateSliderImages.create({ productId: req.params.id, filename: item.filename, relevantproductid: newProduct.id })
                }
            })
        }
        else{
            sliderImagesExistingTemplate.map(async(item) => {
                await db.templateSliderImages.create({ productId: req.params.id, filename: item.filename, relevantproductid: newProduct.id })
            })
        }
        // save new added images
        if (sliderImages !== undefined && sliderImages.length > 0) {
            for (const slides of sliderImages) {
                await db.templateSliderImages.create({ productId: req.params.id, filename: slides.filename, relevantproductid: newProduct.id })
            }
        }

        if (removedFullPageImage !== '') {

            removedFullPageImage = removedFullPageImage.split(',');
        }

        // get existing main template images
        let fullImagesExistingTemplate = await db.templateFullImages.findAll({ where: { productId: req.params.id } });

        // save remaing images for relevant template
        if (removedFullPageImage.length > 0) {
            fullImagesExistingTemplate.map(async(item) => {
                if (removedFullPageImage.includes(item.id.toString()) === false) {
                    await db.templateFullImages.create({ productId: req.params.id, filename: item.filename, relevantproductid: newProduct.id })
                }
            })
        }
        else{
            fullImagesExistingTemplate.map(async(item) => {
                await db.templateFullImages.create({ productId: req.params.id, filename: item.filename, relevantproductid: newProduct.id })
            })
        }

        // save new added images
        if (fullImages !== undefined && fullImages.length > 0) {
            for (const img of fullImages) {
                await db.templateFullImages.create({ productId: req.params.id, filename: img.filename, relevantproductid: newProduct.id })
            }
        }

        return res.status(200).json({ success: true, message: "Product is uploaded" });
    } catch (error) {

    }

}