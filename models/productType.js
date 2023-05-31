export default  (sequelize,DataTypes) => {
    return  sequelize.define('producttype', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        type: {
            type: DataTypes.STRING
        }
    },{ timestamps: true });
}