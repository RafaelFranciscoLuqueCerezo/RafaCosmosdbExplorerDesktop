type DataType = {
    dbConnections: AddConnectionType[]
}

type AddConnectionType = {
    label:string,
    endpoint:string,
    secret:string,
    connectionType:string
}
interface Window {
    electron:{
        saveDbConfig: (data:AddConnectionType)=>void,
        readDbConnections:()=>Promise<AddConnectionType[]>
    }
}