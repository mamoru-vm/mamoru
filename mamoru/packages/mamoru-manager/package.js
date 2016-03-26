Package.describe({
  name: 'mamoru:manager',
  version: '0.0.1',
  summary: 'Manage companion worker containers'
});

Npm.depends({
  "dockerode": "2.2.9"
});

Package.onUse(function(api) {
   api.use('ecmascript');
  api.use('meteorhacks:async', 'server');
  api.addFiles('helpers/docker.js', 'server');
  api.addFiles('manager.js', 'server');
  api.export('MamoruMngr', 'server');
});