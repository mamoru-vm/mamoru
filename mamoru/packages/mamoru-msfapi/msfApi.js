var msfClient = Npm.require('msfrpc-client-node');

var fs = Npm.require('fs');


function msfAPICmd(cmds, callback) {
    Msf.API.exec(cmds)
    .then((resp)=>{
        callback(null,resp)
    })
    .catch((err)=>{
        console.log(err);
        callback(true , err);
    });
}

function insertScanFile(fileId, callback){

    var fileKey = Mamoru.Collections.Files.findOne(fileId).copies.fileStore.key;
    var filePath = Meteor.settings.public.storePath
    var fileContents = fs.readFileSync(`${filePath}/${fileKey}`, 'utf8');
    
    Msf.API.exec(['db.import_data', {data:fileContents}])
    .then((resp)=>{
        callback(null,resp)
    })
    .catch((err)=>{
        console.log(err);
        //callback(err,err);
    });
}

function insertScanFileText(fileTextBase64, callback){
    let b64FileContents = new Buffer(fileTextBase64,'base64');
    //decode base64 to ascii for API
    var decodedFileContents = b64FileContents.toString()

    Msf.API.exec(['db.import_data', {data:decodedFileContents}])
    .then((resp)=>{
        callback(null,resp)
    })
    .catch((err)=>{
        console.log(err);
        callback(err,err);
    });
    
}



msfAPI = {
    newClient:function(options){
      return new msfClient(options);
    },
    clientExecJob: msfAPICmd,
    
    clientExec: Async.wrap(msfAPICmd),

    insertScan: Async.wrap(insertScanFile),

    insertScanText: Async.wrap(insertScanFileText)
};