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
    container:string,
    type: 'SQL'|'IMPORT'|'NONE',
}


type QueryRequest = {
    op:Operation,
    sentence:string
}

type UnSubFunction = () => void;

interface Window {
    electron:{
        saveDbConfig: (data:AddConnectionType)=>Promise<void>,
        readDbConnections:()=>Promise<AddConnectionType[]>,
        getContainers:(data:string)=>Promise<string[]>,
        launchQuery:(data:QueryRequest)=>Promise<void>,
        connect:(data:AddConnectionType)=>Promise<void>,
        subscribeContainers:(callback:(containers:string[])=>void)=>UnSubFunction,
        subscribeQueryResult:(callback:(result:any[])=>void)=>UnSubFunction,
        subscribeQueryCount:(callback:(result:number)=>void)=>UnSubFunction
    }
}