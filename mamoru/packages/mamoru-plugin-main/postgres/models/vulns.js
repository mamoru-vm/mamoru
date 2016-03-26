/* jshint indent: 2 */

vulnModel = function(sequelize, DataType) {
  return sequelize.define('vulns', {
    id: {
      type: DataType.INTEGER,
      primaryKey: true
    },
    host_id: {
      type: DataType.INTEGER,
      allowNull: true
    },
    service_id: {
      type: DataType.INTEGER,
      allowNull: true
    },
    created_at: {
      type: DataType.DATE,
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
      type: DataType.STRING,
      allowNull: true
    },
    exploited_at: {
      type: DataType.DATE,
      allowNull: true
    },
    vuln_detail_count: {
      type: DataType.INTEGER,
      allowNull: true,
      defaultValue: '0'
    },
    vuln_attempt_count: {
      type: DataType.INTEGER,
      allowNull: true,
      defaultValue: '0'
    },
    origin_id: {
      type: DataType.INTEGER,
      allowNull: true
    },
    origin_type: {
      type: DataType.STRING,
      allowNull: true
    }
  },{timestamps: false});
};
