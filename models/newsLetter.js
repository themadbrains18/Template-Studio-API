export default  (sequelize,DataTypes) => {
    return  sequelize.define('newsletter', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        email: {
            type: DataTypes.STRING,
            aallowNull: false
        }
    },{ timestamps: true });
}