export default (sequelize, DataTypes) => {
    return sequelize.define('category', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        category: {
            type: DataTypes.STRING,
            unique: true
        }
    }, { timestamps: true });
}