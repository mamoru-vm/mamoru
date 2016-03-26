/* jshint indent: 2 */

sessionModel = function(sequelize, DataType) {
  return sequelize.define('sessions', {
    id: {
      type: DataType.INTEGER,
      primaryKey: true
    },
    host_id: {
      type: DataType.INTEGER,
      allowNull: true
    },
    stype: {
      type: DataType.STRING,
      allowNull: true
    },
    via_exploit: {
      type: DataType.STRING,
      allowNull: true
    },
    via_payload: {
      type: DataType.STRING,
      allowNull: true
    },
    desc: {
      type: DataType.STRING,
      allowNull: true
    },
    port: {
      type: DataType.INTEGER,
      allowNull: true
    },
    platform: {
      type: DataType.STRING,
      allowNull: true
    },
    datastore: {
      type: DataType.TEXT,
      allowNull: true
    },
    opened_at: {
      type: DataType.DATE,
      allowNull: false
    },
    closed_at: {
      type: DataType.DATE,
      allowNull: true
    },
    close_reason: {
      type: DataType.STRING,
      allowNull: true
    },
    local_id: {
      type: DataType.INTEGER,
      allowNull: true
    },
    last_seen: {
      type: DataType.DATE,
      allowNull: true
    },
    module_run_id: {
      type: DataType.INTEGER,
      allowNull: true
    }
  },{timestamps: false});
};
