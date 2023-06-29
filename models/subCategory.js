export default  (sequelize,DataTypes) => {
    return  sequelize.define('subcategory', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        categoryId: {
            type: DataTypes.INTEGER,
        },
        subCategory: {
            type: DataTypes.STRING,
        },
        // image: {
        //     type: DataTypes.STRING,
        // }
    },{ timestamps: true });
}