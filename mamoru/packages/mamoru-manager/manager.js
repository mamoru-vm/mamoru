
function MamoruMananger(){
  return {
    //createContainer: createContainerAsync,
    startContainer: startContainerAsync,
    findContainer: findContainerAsync,
    findImage: findImageAsync, 
    launchImageJob: launchImageJob,
    initalizeWorker: initalizeWorker

  }
}

MamoruMngr = MamoruMananger();