const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld("electron",{
    saveDbConfig: (data:AddConnectionType) => ipcRenderer.invoke("saveDbConfig",data),
    readDbConnections: (callback:(connections:AddConnectionType[])=>any) => ipcRenderer.invoke("readDbConnections",callback)
} satisfies Window['electron'])