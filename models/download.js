export default  (sequelize,DataTypes) => {
    return  sequelize.define('download', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        productId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        paymentType:{
            type: DataTypes.BOOLEAN,
            defaultValue : false
        } 
    },{ timestamps: true });
}