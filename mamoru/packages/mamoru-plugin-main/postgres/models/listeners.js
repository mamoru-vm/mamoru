/* jshint indent: 2 */

listenerModel = function(sequelize, DataType) {
  return sequelize.define('listeners', {
    id: {
      type: DataType.INTEGER,
      primaryKey: true
    },
    created_at: {
      type: DataType.DATE,
      allowNull: false
    },
    updated_at: {
      type: DataType.DATE,
      allowNull: false
    },
    workspace_id: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: '1'
    },
    task_id: {
      type: DataType.INTEGER,
      allowNull: true
    },
    enabled: {
      type: DataType.BOOLEAN,
      allowNull: true,
      defaultValue: true
    },
    owner: {
      type: DataType.TEXT,
      allowNull: true
    },
    payload: {
      type: DataType.TEXT,
      allowNull: true
    },
    address: {
      type: DataType.TEXT,
      allowNull: true
    },
    port: {
      type: DataType.INTEGER,
      allowNull: true
    },
    options: {
      type: 'BYTEA',
      allowNull: true
    },
    macro: {
      type: DataType.TEXT,
      allowNull: true
    }
  },{timestamps: false});
};
