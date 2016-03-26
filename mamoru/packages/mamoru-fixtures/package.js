
Package.describe({
  name: 'mamoru:fixtures',
  version: '0.0.1',
  summary: '',
  debugOnly: true
});

Package.onUse(function(api) {
  api.use('ecmascript');
  api.use('vsivsi:job-collection@1.2.3', 'server')
  api.use('mamoru:msf-api', 'server');
  api.addFiles('fixtures.js', 'server');
});