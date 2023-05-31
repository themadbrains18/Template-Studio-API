export default  (sequelize,DataTypes) => {
    return  sequelize.define('softwaretype', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        categoryId: {
            type: DataTypes.INTEGER
        },
        softwareType: {
            type: DataTypes.STRING,
        }
    },{ timestamps: true });
}