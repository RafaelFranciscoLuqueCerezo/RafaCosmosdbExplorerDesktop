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

interface Window {
    electron:{
        saveDbConfig: (data:AddConnectionType)=>Promise<void>,
        readDbConnections:()=>Promise<AddConnectionType[]>,
        getContainers:(data:string)=>Promise<string[]>,
        connect:(data:AddConnectionType)=>Promise<void>
    }
}