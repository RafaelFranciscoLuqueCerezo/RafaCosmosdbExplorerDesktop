const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld("electron",{
    saveDbConfig: (data:AddConnectionType) => ipcRenderer.invoke("saveDbConfig",data),
    connect: (data:AddConnectionType) => ipcRenderer.invoke("connect",data),
    getContainers: async(data:string) => await ipcRenderer.invoke("getContainers",data),
    readDbConnections: () => ipcRenderer.invoke("readDbConnections"),
} satisfies Window['electron'])