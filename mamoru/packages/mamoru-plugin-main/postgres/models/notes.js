/* jshint indent: 2 */

noteModel = function(sequelize, DataType) {
  return sequelize.define('notes', {
    id: {
      type: DataType.INTEGER,
      primaryKey: true
    },
    created_at: {
      type: DataType.DATE,
      allowNull: true
    },
    ntype: {
      type: DataType.STRING,
      allowNull: true
    },
    workspace_id: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: '1'
    },
    service_id: {
      type: DataType.INTEGER,
      allowNull: true
    },
    host_id: {
      type: DataType.INTEGER,
      allowNull: true
    },
    updated_at: {
      type: DataType.DATE,
      allowNull: true
    },
    critical: {
      type: DataType.BOOLEAN,
      allowNull: true
    },
    seen: {
      type: DataType.BOOLEAN,
      allowNull: true
    },
    data: {
      type: DataType.TEXT,
      allowNull: true
    },
    vuln_id: {
      type: DataType.INTEGER,
      allowNull: true
    }
  },{timestamps: false});
};
