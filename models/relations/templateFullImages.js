export default  (sequelize,DataTypes) => {
    return  sequelize.define('fullimage', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        filename: {
            type: DataTypes.STRING,
        },
        productId: {
            type: DataTypes.INTEGER,
        }
    },{ timestamps: true });
}