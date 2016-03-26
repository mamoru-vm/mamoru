/* jshint indent: 2 */

serviceModel = function(sequelize, DataType) {
  return sequelize.define('services', {
    id: {
      type: DataType.INTEGER,
      primaryKey: true
    },
    host_id: {
      type: DataType.INTEGER,
      allowNull: true
    },
    created_at: {
      type: DataType.DATE,
      allowNull: true
    },
    port: {
      type: DataType.INTEGER,
      allowNull: false
    },
    proto: {
      type: DataType.STRING,
      allowNull: false
    },
    state: {
      type: DataType.STRING,
      allowNull: true
    },
    name: {
      type: DataType.STRING,
      allowNull: true
    },
    updated_at: {
      type: DataType.DATE,
      allowNull: true
    },
    info: {
      type: DataType.TEXT,
      allowNull: true
    }
  },{timestamps: false});
};
