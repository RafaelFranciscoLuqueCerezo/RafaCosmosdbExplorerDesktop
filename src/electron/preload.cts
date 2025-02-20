const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld("electron",{
    saveDbConfig: (data:AddConnectionType) => ipcRenderer.invoke("saveDbConfig",data),
    connect: (data:AddConnectionType) => ipcRenderer.invoke("connect",data),
    getContainers: (data:string) => ipcRenderer.invoke("getContainers",data),
    launchQuery: (data:QueryRequest) => ipcRenderer.invoke("launchQuery",data),
    deleteItems: (data:DeleteItemRequest) => ipcRenderer.invoke("deleteItems",data),
    deleteContainer: (data:Operation) => ipcRenderer.invoke("deleteContainer",data),
    deleteDataBase: (data:string) => ipcRenderer.invoke("deleteDataBase",data),
    cleanContainer: (data:Operation) => ipcRenderer.invoke("cleanContainer",data),
    cleanDataBase: (data:string) => ipcRenderer.invoke("cleanDataBase",data),
    importDocument: (data:ImportDocumentRequest) => ipcRenderer.invoke("importDocument",data),
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
    subscribePopup: (callback:(value:PopUpProps)=>void) => {
        const callBack = (_event:any, value:any) => callback(value);
        ipcRenderer.on('popup', callBack);
        return ()=>ipcRenderer.off('popup',callBack);
    },
    subscribeLoader: (callback:(value:boolean)=>void) => {
        const callBack = (_event:any, value:any) => callback(value);
        ipcRenderer.on('loader', callBack);
        return ()=>ipcRenderer.off('loader',callBack);
    },
} satisfies Window['electron'])