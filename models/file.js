export default  (sequelize,DataTypes) => {
    return  sequelize.define('file', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        sourceFile: {
            type: DataTypes.STRING,
        },
        sourceFilePassword: {
            type: DataTypes.STRING,
        }
    },{ timestamps: true });
}