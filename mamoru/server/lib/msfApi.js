Mamoru.API.insertModules = function(modArray, parentNode, j) {
    // if we are testing, just insert 50 modules of exploits, aux etc more than 50 mods
    var modsToInsert = (process.env.IS_MIRROR && modArray.length > 50) ? 50 : modArray.length;

    for (var i = 0; i < modsToInsert; i++) {
    
        //retreive module info
        var modInfo = msfAPI.clientExec(['module.info', parentNode, modArray[i]]);
        
        //retreive module options
        var modOpts = msfAPI.clientExec(['module.options', parentNode, modArray[i]]);
       
        //create object to insert into mongo
        var modObj = {};    
        
        // if this is an exploit add some extra properties
        if (parentNode === 'exploit'){
            modObj.targets = modInfo.targets
            modObj.default_target = modInfo.default_target
            modObj.payloads = msfAPI.clientExec(['module.compatible_payloads', modArray[i]]);
        }

        if (parentNode === 'auxiliary'){
            modObj.actions = modInfo.actions
            modObj.default_actions = modInfo.default_actions
        }

        
        // all modules will have these properties
        var platform = modArray[i].split('/')[0]
        modObj.cat = parentNode;
        modObj.path = modArray[i];
        modObj.options = modOpts;
        modObj.platform = platform;
        modObj.license = "Metasploit Framework License (BSD)";
        modObj.name = modInfo.name;
        modObj.rank = modInfo.rank/100;
        modObj.references = modInfo.references;
        modObj.authors = modInfo.authors;
        modObj.description = modInfo.description;
        
        // insert into mongo
        Mamoru.Collections.Modules.insert(modObj);
        
        // update job progress
        j.progress(i,modsToInsert);
        
    };
};


Mamoru.API.syncModules = function(modArray, j) {
    // if we are testing, just insert 50 modules of exploits, aux etc more than 50 mods
    //var modsToInsert = (process.env.IS_MIRROR && modArray.length > 50) ? 50 : modArray.length;

    for (var i = 0; i < modArray.length; i++) {
    
        //retreive module info
        var modInfo = msfAPI.clientExec(['module.info', modArray[i].cat, modArray[i].mod]);
        
        //retreive module options
        var modOpts = msfAPI.clientExec(['module.options', modArray[i].cat, modArray[i].mod]);
       
        //create object to insert into mongo
        var modObj = {};
        
        // if this is an exploit add some extra properties
        if (modArray[i].cat === 'exploit'){
            modObj.targets = modInfo.targets
            modObj.default_target = modInfo.default_target
            modObj.payloads = msfAPI.clientExec(['module.compatible_payloads', modArray[i].mod]);
        }

        if (modArray[i].cat === 'auxiliary'){
            modObj.actions = modInfo.actions
            modObj.default_actions = modInfo.default_actions
        }

        var platform = modArray[i].mod.split('/')[0]
        // all modules will have these properties
        modObj.cat = modArray[i].cat;
        modObj.path = modArray[i].mod;
        modObj.options = modOpts;
        modObj.platform = platform;
        modObj.license = "Metasploit Framework License (BSD)";
        modObj.name = modInfo.name;
        modObj.rank = modInfo.rank/100;
        modObj.references = modInfo.references;
        modObj.authors = modInfo.authors;
        modObj.description = modInfo.description;
        
        // insert into mongo
        Mamoru.Collections.Modules.insert(modObj);
        
        // update job progress
        j.progress(i,modArray.length);
        
    };
};

Mamoru.API.consoleIsBusy = function(consoleId){
    let read = msfAPI.clientExec(['console.read', consoleId]);
    return read.busy
}
