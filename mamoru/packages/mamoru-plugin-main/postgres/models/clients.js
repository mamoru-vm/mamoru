/* jshint indent: 2 */

clientModel = function(sequelize, DataType) {
  return sequelize.define('clients', {
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
    ua_string: {
      type: DataType.STRING,
      allowNull: false
    },
    ua_name: {
      type: DataType.STRING,
      allowNull: true
    },
    ua_ver: {
      type: DataType.STRING,
      allowNull: true
    },
    updated_at: {
      type: DataType.DATE,
      allowNull: true
    }
  }, {timestamps: false});
};
