Package.describe({
  name: 'mamoru:mongo-import',
  version: '0.0.1',
  summary: 'Import compressed modules for msfrpc'
});

Npm.depends({
  'node-7z' : '0.3.0',
  'child-process-promise': '1.1.0'
});

Package.onUse(function(api) {
  api.use('ecmascript');
  api.use('meteorhacks:async', 'server');
  api.addFiles('import.js', 'server');
  api.addAssets(['moduleData.7z'], 'server');
  api.export('mongoImport', 'server');
});