export default  (sequelize,DataTypes) => {
    return  sequelize.define('userMeta', {
        otp: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    });
}