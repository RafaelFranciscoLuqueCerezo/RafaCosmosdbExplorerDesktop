type DataType = {
    dbConnections: AddConnectionType[]
}
type AddConnectionType = {
    label:string,
    dbName:string,
    endpoint:string,
    secret:string,
    connectionType:string,
    certFile:any
}

type Client = {
    label:string,
    dbName:string,
    client:any
}

type Operation = {
    dbLabel:string,
    container:string
}

interface Window {
    electron:{
        saveDbConfig: (data:AddConnectionType)=>Promise<void>,
        readDbConnections:()=>Promise<AddConnectionType[]>,
        getContainers:(data:string)=>Promise<string[]>,
        connect:(data:AddConnectionType)=>Promise<void>,
        subscribeContainers:(callback:(containers:string[])=>void)=>void
    }
}