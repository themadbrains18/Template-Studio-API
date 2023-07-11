export default  (sequelize,DataTypes) => {
   return  sequelize.define('templatesoftwaretype', {
      id: {
         type: DataTypes.INTEGER,
         autoIncrement: true,
         primaryKey: true,
      },
      softwareTypeId : {
         type: DataTypes.INTEGER,
      },
      relevantproductid :{type : DataTypes.INTEGER}
   
   },{ timestamps: true });
}