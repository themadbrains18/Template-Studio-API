export default  (sequelize,DataTypes) => {
   return  sequelize.define('templatecategory', {
      id: {
         type: DataTypes.INTEGER,
         autoIncrement: true,
         primaryKey: true,
      }
   },{ timestamps: true });
}