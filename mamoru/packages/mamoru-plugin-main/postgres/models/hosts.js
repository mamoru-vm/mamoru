/* jshint indent: 2 */

hostModel = function(sequelize, DataType) {
  return sequelize.define('hosts', {
    id: {
      type: DataType.INTEGER,
      primaryKey: true
    },
    created_at: {
      type: DataType.DATE,
      allowNull: true
    },
    address: {
      type: 'INET',
      allowNull: false
    },
    mac: {
      type: DataType.STRING,
      allowNull: true
    },
    comm: {
      type: DataType.STRING,
      allowNull: true
    },
    name: {
      type: DataType.STRING,
      allowNull: true
    },
    state: {
      type: DataType.STRING,
      allowNull: true
    },
    os_name: {
      type: DataType.STRING,
      allowNull: true
    },
    os_flavor: {
      type: DataType.STRING,
      allowNull: true
    },
    os_sp: {
      type: DataType.STRING,
      allowNull: true
    },
    os_lang: {
      type: DataType.STRING,
      allowNull: true
    },
    arch: {
      type: DataType.STRING,
      allowNull: true
    },
    workspace_id: {
      type: DataType.INTEGER,
      allowNull: false
    },
    updated_at: {
      type: DataType.DATE,
      allowNull: true
    },
    purpose: {
      type: DataType.TEXT,
      allowNull: true
    },
    info: {
      type: DataType.STRING,
      allowNull: true
    },
    comments: {
      type: DataType.TEXT,
      allowNull: true
    },
    scope: {
      type: DataType.TEXT,
      allowNull: true
    },
    virtual_host: {
      type: DataType.TEXT,
      allowNull: true
    },
    note_count: {
      type: DataType.INTEGER,
      allowNull: true,
      defaultValue: '0'
    },
    vuln_count: {
      type: DataType.INTEGER,
      allowNull: true,
      defaultValue: '0'
    },
    service_count: {
      type: DataType.INTEGER,
      allowNull: true,
      defaultValue: '0'
    },
    host_detail_count: {
      type: DataType.INTEGER,
      allowNull: true,
      defaultValue: '0'
    },
    exploit_attempt_count: {
      type: DataType.INTEGER,
      allowNull: true,
      defaultValue: '0'
    },
    cred_count: {
      type: DataType.INTEGER,
      allowNull: true,
      defaultValue: '0'
    },
    detected_arch: {
      type: DataType.STRING,
      allowNull: true
    }
  }, {
    timestamps: false
  });
};

