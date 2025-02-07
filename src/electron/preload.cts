const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld("electron",{
    saveDbConfig: (data:AddConnectionType) => ipcRenderer.invoke("saveDbConfig",data),
    connect: (data:AddConnectionType) => ipcRenderer.invoke("connect",data),
    getContainers: (data:string) => ipcRenderer.invoke("getContainers",data),
    launchQuery: (data:QueryRequest) => ipcRenderer.invoke("launchQuery",data),
    readDbConnections: () => ipcRenderer.invoke("readDbConnections"),
    subscribeContainers: (callback:(containers:string[])=>void) => {
        const callBack = (_event:any, value:any) => callback(value);
        ipcRenderer.on('containers', callBack);
        return ()=>ipcRenderer.off('containers',callBack);
    },
    subscribeQueryResult: (callback:(value:any[])=>void) => {
        const callBack = (_event:any, value:any) => callback(value);
        ipcRenderer.on('sql-result', callBack);
        return ()=>ipcRenderer.off('sql-result',callBack);
    },
    subscribeQueryCount: (callback:(value:number)=>void) => {
        const callBack = (_event:any, value:any) => callback(value);
        ipcRenderer.on('sql-count', callBack);
        return ()=>ipcRenderer.off('sql-count',callBack);
    },
} satisfies Window['electron'])