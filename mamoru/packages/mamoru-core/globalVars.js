Mamoru = {
  Constants: {},
  // Small reusable utilities - need to tidy this up and move msfmethods to API?
  Utils: {},
  // namespace for all syncrhonization functions
  Sync: {},
  // Meteor Mongo Collections
  Collections: {},
  Queues: {},
  Subscriptions: {},
  
  // Not sure what exactly to put here
  API: {},

  //Maintain Dep state in global var? i donno...
  Status: {pg: null , msf: null},

  // config object set over DDP from watcher
  Configs: {},

  //Global Object to store timer intervals
  Intervals: {}
};

var global = this;

global.Mamoru = Mamoru;