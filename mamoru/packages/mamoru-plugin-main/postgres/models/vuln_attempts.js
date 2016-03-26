/* jshint indent: 2 */

vulnAttemptsModel = function(sequelize, DataTypes) {
  return sequelize.define('vuln_attempts', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    vuln_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    attempted_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    exploited: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    fail_reason: {
      type: DataTypes.STRING,
      allowNull: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: true
    },
    module: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    session_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    loot_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    fail_detail: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    timestamps: false,
    tableName: 'vuln_attempts',
    freezeTableName: true
  });
};
