const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld("electron",{
    saveDbConfig: (data) => ipcRenderer.invoke("form:saveDbConfig",data)
})