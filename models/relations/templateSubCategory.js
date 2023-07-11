export default  (sequelize,DataTypes) => {
   return  sequelize.define('templatesubcategory', {
      id: {
         type: DataTypes.INTEGER,
         autoIncrement: true,
         primaryKey: true,
      },
      subCategoryId : {
         type : DataTypes.INTEGER
      },
      relevantproductid :{type : DataTypes.INTEGER}
   },{ timestamps: true });
}