var childprocPromise = Npm.require('child-process-promise');
var Zip = Npm.require('node-7z');
var fs = Npm.require('fs');

// mongoimport -h localhost:3001 --db meteor -u username -p password --collection modules --jsonArray --type json --file exploits.json

function mongoInsert(jsonPath, callback){
  // this string will be mongodb://USERNAME:PASSWORD@HOST:PORT/DATABASE when running in production have to fix...
  // mongoimport -h localhost:3001 --db meteor -u username -p password --collection modules --jsonArray --type json --file exploits.json
  var mongoSettings = process.env.MONGO_URL.replace('mongodb://', '').split('/');
  var mongoHost = mongoSettings[0];
  var mongoDB = mongoSettings[1];
  var opts = ['-h', mongoHost, '--db',mongoDB, '--collection', 'modules' ,'--jsonArray', '--type', 'json', '--file',jsonPath]
  childprocPromise.spawn('mongoimport',opts)
  .then((result)=>{
    callback(null,result);
  })
  .fail((err)=>{
    callback(err,err);
  });
};

//wrap promise in a fiber for meteor async like behaviour...
var mongoImportAsync = Async.wrap(mongoInsert);

mongoImport = {
  importMods: function(){
    var Archive = new Zip();
    var assetPath = fs.realpathSync('assets/packages/mamoru_mongo-import');
    var compressedFile = `${assetPath}/moduleData.7z`
    Archive.extractFull(compressedFile, `${assetPath}/data`)
    .then(Meteor.bindEnvironment(()=>{
    var toImport = fs.readdirSync(`${assetPath}/data`);
    for(var f=0;f<toImport.length;f++){
      var fileName = toImport[f]
      var jsonPath = `${assetPath}/data/${fileName}`
      mongoImportAsync(jsonPath);   
    };
    }));
    console.log('Loaded modules!');
  }
}





