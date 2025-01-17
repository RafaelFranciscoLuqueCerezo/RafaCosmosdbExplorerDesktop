type DataType = {
    dbConnections: AddConnectionType[]
}

type AddConnectionType = {
    label:string,
    endpoint:string,
    secret:string,
    connectionType:string
}