/* jshint indent: 2 */

workspaceModel = function(sequelize, DataType) {
  return sequelize.define('workspaces', {
    id: {
      type: DataType.INTEGER,
      primaryKey: true
    },
    name: {
      type: DataType.STRING,
      allowNull: true
    },
    created_at: {
      type: DataType.DATE,
      allowNull: false
    },
    updated_at: {
      type: DataType.DATE,
      allowNull: false
    },
    boundary: {
      type: DataType.STRING,
      allowNull: true
    },
    description: {
      type: DataType.STRING,
      allowNull: true
    },
    owner_id: {
      type: DataType.INTEGER,
      allowNull: true
    },
    limit_to_network: {
      type: DataType.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    timestamps: false
  });
};
