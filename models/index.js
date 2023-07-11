import { Sequelize, DataTypes } from "sequelize";
import * as dotenv from 'dotenv'
dotenv.config();

/************************************************/
// here is list of all table
/************************************************/

import user from "./user.js";
import userMeta from "./user-meta.js";

import product from "./product.js";
import file from "./file.js";

import category from "./category.js";
import industry from "./industry.js";
import softwareType from "./softwareType.js";
import subCategory from "./subCategory.js";
import productType from "./productType.js";
import newsLetter from "./newsLetter.js";
import download from "./download.js";
import relevantProduct from "./relevantProduct.js";

import templateCategory from "./relations/templateCategory.js";
import templateIndrusty from "./relations/templateIndustry.js";
import templateSoftwareType from "./relations/templateSoftwareType.js";
import templateSubCategory from "./relations/templateSubCategory.js";
import templateSliderImages from "./relations/templateSliderImages.js";
import templateFullImages from "./relations/templateFullImages.js";

const sequelize = new Sequelize(process.env.DATA_BASE, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: 'localhost',
    dialect: 'mysql',
    logging: false,
    timezone: "+05:30"
});


const db = {};
try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    /************************************************/
    // all table async here
    /************************************************/
    db.sequelize = sequelize;
    db.Sequelize = Sequelize;

    /**
     * User Related Table 
     */
    db.user = user(sequelize, DataTypes);
    db.userMeta = userMeta(sequelize, DataTypes);

    /**
     * Product Base Table
     */
    db.product = product(sequelize, DataTypes);
    db.file = file(sequelize, DataTypes);
    db.relevantProduct = relevantProduct(sequelize, DataTypes);
    /**
     * Relational Table
     */
    db.templateCategory = templateCategory(sequelize, DataTypes);
    db.templateIndrusty = templateIndrusty(sequelize, DataTypes);
    db.templateSoftwareType = templateSoftwareType(sequelize, DataTypes);
    db.templateSubCategory = templateSubCategory(sequelize, DataTypes);
    db.templateSliderImages = templateSliderImages(sequelize, DataTypes);
    db.templateFullImages = templateFullImages(sequelize, DataTypes);

    /**
     * Master Table 
     */
    db.category = category(sequelize, DataTypes);
    db.subCategory = subCategory(sequelize, DataTypes);
    db.industry = industry(sequelize, DataTypes);
    db.softwareType = softwareType(sequelize, DataTypes);
    db.productType = productType(sequelize, DataTypes);
    db.newsLetter = newsLetter(sequelize, DataTypes);
    db.download = download(sequelize, DataTypes);

    // one to one relation user to userMeta
    db.user.hasOne(db.userMeta);
    db.userMeta.belongsTo(db.user);

    // one to one relation user to Files
    db.product.hasOne(db.file);
    db.file.belongsTo(db.product);

    // one to many slider images
    db.product.hasMany(db.templateSliderImages);
    db.templateSliderImages.belongsTo(db.product);

    // one to many full images
    db.product.hasMany(db.templateFullImages);
    db.templateFullImages.belongsTo(db.product);

    // Category 
    db.templateCategory.belongsToMany(db.product, { through: db.templateCategory });
    db.product.hasMany(db.templateCategory);
    db.templateCategory.belongsTo(db.product);
    db.category.hasMany(db.templateCategory);
    db.templateCategory.belongsTo(db.category);

    // Sub-Category 
    db.templateSubCategory.belongsToMany(db.product, { through: db.templateSubCategory });
    db.product.hasMany(db.templateSubCategory);
    db.templateSubCategory.belongsTo(db.product);
    db.subCategory.hasMany(db.templateSubCategory);
    db.templateSubCategory.belongsTo(db.subCategory);

    // Software Type
    db.templateSoftwareType.belongsToMany(db.product, { through: db.templateSoftwareType });
    db.product.hasMany(db.templateSoftwareType);
    db.templateSoftwareType.belongsTo(db.product);
    db.softwareType.hasMany(db.templateSoftwareType);
    db.templateSoftwareType.belongsTo(db.softwareType);

    // Industry Type
    db.templateIndrusty.belongsToMany(db.product, { through: db.templateIndrusty });
    db.product.hasMany(db.templateIndrusty);
    db.templateIndrusty.belongsTo(db.product);
    db.industry.hasMany(db.templateIndrusty);
    db.templateIndrusty.belongsTo(db.industry);

    db.relevantProduct.belongsTo(db.product,{
        foreignKey :{
            name : 'product_id'
        }
    });
    db.product.hasMany(db.relevantProduct,{
        foreignKey :{
            name : 'product_id'
        }
    });

    db.user.hasMany(db.download);
    db.download.belongsTo(db.user);

    // get Category to associate with subcategory list
    db.category.hasMany(db.subCategory, {
        foreignKey: {
            name: 'categoryId'
        }
    });
    db.subCategory.belongsTo(db.category, {
        foreignKey: {
            name: 'categoryId'
        }
    });
    // End Category to associate with subcategory list

    // db.templateIndrusty.sync({alter:true});
} catch (error) {
    console.error('Unable to connect to the database:', error);
}

export default db;