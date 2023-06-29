export default  (sequelize,DataTypes) => {
    return  sequelize.define('product', {
        name: { type: DataTypes.STRING },
        version :  { type: DataTypes.STRING },
        description : { type: DataTypes.STRING },
        variant : { type: DataTypes.STRING },
        price : { 
            type: DataTypes.DOUBLE,
            default :null 
        },
        seoKeywords : { type: DataTypes.STRING },
        fonts:{type : DataTypes.JSON},
        images:{type : DataTypes.JSON},
        icons:{type : DataTypes.JSON},
        technical:{type : DataTypes.JSON},
        productType:{type: DataTypes.STRING}
    },{ timestamps: true });
}