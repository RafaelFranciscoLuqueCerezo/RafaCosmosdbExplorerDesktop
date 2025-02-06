const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld("electron",{
    saveDbConfig: (data:AddConnectionType) => ipcRenderer.invoke("saveDbConfig",data),
    connect: (data:AddConnectionType) => ipcRenderer.invoke("connect",data),
    getContainers: (data:string) => ipcRenderer.invoke("getContainers",data),
    launchQuery: (data:QueryRequest) => ipcRenderer.invoke("launchQuery",data),
    readDbConnections: () => ipcRenderer.invoke("readDbConnections"),
    subscribeContainers: (callback:(containers:string[])=>void) => ipcRenderer.on('containers', (_event, value) => callback(value)),
    subscribeQueryResult: (callback:(result:any[])=>void) => ipcRenderer.on('sql-result', (_event, value) => callback(value)),
    subscribeQueryCount: (callback:(result:number)=>void) => ipcRenderer.on('sql-count', (_event, value) => callback(value))
} satisfies Window['electron'])