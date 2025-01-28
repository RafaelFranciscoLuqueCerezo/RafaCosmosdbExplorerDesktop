const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld("electron",{
    saveDbConfig: (data:AddConnectionType) => ipcRenderer.invoke("saveDbConfig",data),
    connect: (data:AddConnectionType) => ipcRenderer.invoke("connect",data),
    getContainers: (data:string) => ipcRenderer.invoke("getContainers",data),
    readDbConnections: () => ipcRenderer.invoke("readDbConnections"),
    subscribeContainers: (callback:(containers:string[])=>void) => ipcRenderer.on('containers', (_event, value) => callback(value))
} satisfies Window['electron'])