Package.describe({
  name: 'mamoru:core',
  version: '0.0.1',
  summary: 'Defines the global namespaces and the application configuration.'
});

Package.onUse(function(api) {
  api.use('ecmascript');
  api.addFiles('globalVars.js');
  api.export('Mamoru');
});