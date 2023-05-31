export default  (sequelize,DataTypes) => {
    return  sequelize.define('industry', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        industry: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },{ timestamps: true });
}