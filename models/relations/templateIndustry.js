export default  (sequelize,DataTypes) => {
   return  sequelize.define('templateindrusty', {
      id: {
         type: DataTypes.INTEGER,
         autoIncrement: true,
         primaryKey: true,
      }
   },{ timestamps: true });
}