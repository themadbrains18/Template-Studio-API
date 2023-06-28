export default  (sequelize,DataTypes) => {
    return  sequelize.define('usermeta', {
        otp: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    });
}