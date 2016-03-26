Mamoru.Collections.Modules =  new Mongo.Collection('modules');
Mamoru.Collections.Projects = new Mongo.Collection('projects');
Mamoru.Collections.Hosts = new Mongo.Collection('hosts');
Mamoru.Collections.Services = new Mongo.Collection('services');
Mamoru.Collections.Notes = new Mongo.Collection('notes');
Mamoru.Collections.Events = new Mongo.Collection('events');
Mamoru.Collections.SavedOptions = new Mongo.Collection('savedoptions');
Mamoru.Collections.Sessions = new Mongo.Collection('sessions');
Mamoru.Collections.MsfJobs = new Mongo.Collection('msfJobs');

// collection to store console status, to be used as a pool of consoles...
Mamoru.Collections.Consoles = new Mongo.Collection('consoles');
// collection to store container details + status' requried for plugins
Mamoru.Collections.Containers = new Mongo.Collection('containers');

///////////////////////////////////////////////////////////
// Job Collections for jobs-collection Meteor package
Mamoru.Collections.Jobs = JobCollection('jobCollection');
Mamoru.Collections.DepJobs = JobCollection('depJobs');
//hmm not sure if I want to do this...
Mamoru.Collections.ApiJobs = JobCollection('apiJobs');