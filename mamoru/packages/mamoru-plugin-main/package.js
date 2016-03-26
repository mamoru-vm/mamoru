Package.describe({
  name: 'mamoru:main-plugin',
  version: '0.0.1',
  summary: 'main plugin for Mamoru, outlines plugin structure'
});

// not yet but probably integrate all msf behaviour into this 'plugin'
Npm.depends({
  'pg' : '4.4.3',
  'pg-hstore': '2.3.2',
  'sequelize': '3.13.0'
});

Package.onUse(function(api) {
  api.use('ecmascript');
    api.addFiles(['postgres/models/hosts.js',
                'postgres/models/services.js',
                'postgres/models/notes.js',
                'postgres/models/clients.js',
                'postgres/models/workspaces.js',
                'postgres/models/sessions.js',
                'postgres/models/listeners.js',
                'postgres/models/vulns.js',
                'postgres/models/vuln_attempts.js',
                'postgres/models/exploit_attempts.js'
                ], 'server');
  api.addFiles('msf-plugin.js', 'server');
  api.export('Msf', 'server');
});