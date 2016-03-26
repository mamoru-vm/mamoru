Package.describe({
  name: 'mamoru:msf-api',
  version: '0.0.1',
  summary: 'For MSFRPC API Functionality'
});

Npm.depends({
  'msfrpc-client-node' : '0.2.2'
});

Package.onUse(function(api) {
  api.use('ecmascript');
  api.use('meteorhacks:async', 'server');
  api.addFiles('msfApi.js', 'server');
  api.export('msfAPI', 'server');
});