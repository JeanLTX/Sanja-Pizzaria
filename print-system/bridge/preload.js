const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('bridge', {
    listPrinters: () => ipcRenderer.invoke('list-printers'),
    openDataFolder: () => ipcRenderer.invoke('open-data-folder'),
    getConfig: () => ipcRenderer.invoke('get-config'),
    saveConfig: config => ipcRenderer.invoke('save-config', config),
    activateBridge: code => ipcRenderer.invoke('activate-bridge', code),
    createTestOrder: () => ipcRenderer.invoke('create-test-order'),
    testPrint: () => ipcRenderer.invoke('test-print'),
    listJobs: limit => ipcRenderer.invoke('list-jobs', limit),
    reprintJob: jobId => ipcRenderer.invoke('reprint-job', jobId),
    printSpecificJob: jobId => ipcRenderer.invoke('print-specific-job', jobId),
    onStatus: callback => ipcRenderer.on('status', (_event, data) => callback(data))
});
