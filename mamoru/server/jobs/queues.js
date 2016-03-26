Mamoru.Queues.fixtures = Mamoru.Collections.Jobs.processJobs(
    // Type of job to request
    // Can also be an array of job types
    ['syncProjectData','syncModules'], {
        concurrency: 2,
        payload: 1,
        //do not poll, run job with queue.trigger();
        pollInterval: false,
        prefetch: 1
    },
    // job function - the actual worker
    fixtureWorkers
);

Mamoru.Queues.msfAPIcalls = Mamoru.Collections.ApiJobs.processJobs(
    ['apiCall', 'exploitCheck'], {
    concurrency: 4,
     payload: 1,
     pollInterval: 5000,
     prefetch: 1
    },
    apiCallWorker
);

Mamoru.Queues.consoleWrite =  Mamoru.Collections.Jobs.processJobs(
    'consoleAction', {
    concurrency: 4,
     payload: 1,
     pollInterval: false,
     prefetch: 1
    },
    consoleActionWorker
);


Mamoru.Queues.Manager = Mamoru.Collections.DepJobs.processJobs(
    // Type of job to request
    // Can also be an array of job types
    ['startWorker'], {
        concurrency: 2,
        payload: 1,
        //do not poll, run job with queue.trigger();
        pollInterval: 5000,
        prefetch: 1
    },
    // job function - the actual worker
    MamoruMngr.launchImageJob
);