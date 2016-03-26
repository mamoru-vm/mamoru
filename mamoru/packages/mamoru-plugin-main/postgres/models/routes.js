/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('routes', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    session_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    subnet: {
      type: DataTypes.STRING,
      allowNull: true
    },
    netmask: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'routes',
    freezeTableName: true
  });
};
