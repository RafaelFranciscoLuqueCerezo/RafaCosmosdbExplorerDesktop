import {app, BrowserWindow,ipcMain,Menu } from 'electron';
import { ConnectionMode, CosmosClient, FeedResponse, ItemResponse } from "@azure/cosmos";
import https from 'https';
import path from 'path';
import { CERT_FOLDER, DATA_FILE, isDev } from './util.js';
import { getPreloadPath } from './pathResolver.js';
import fs from 'fs';

export let cosmosdbClients : Client[] = [];

//Menu.setApplicationMenu(null);

//FUNCIONES BACK
function connect(config:AddConnectionType){
    if(cosmosdbClients.find((element:Client)=>element.label==config.label)){
        return;
    }
    const client = new CosmosClient({
        key: config.secret,
        endpoint: config.endpoint,
        connectionPolicy:{
            enableEndpointDiscovery:false,
            connectionMode: ConnectionMode.Gateway,
            requestTimeout: 50000,
        
        },
        agent: new https.Agent( {
            ca: fs.readFileSync(path.join(CERT_FOLDER,`${config.label}.crt`)),
            keepAlive:true,
            rejectUnauthorized:false
        })
    })
    cosmosdbClients.push({label:config.label,dbName:config.dbName,client})
}

async function getContainers(label:string):Promise<void>{
    const element = cosmosdbClients.find((client:Client)=>client.label===label);
    if(element === undefined){
        mainWindow.webContents.send('containers',[]);
        return;
    }

    try{
        const client : CosmosClient = element.client as CosmosClient;
        const response = await client.database(element.dbName).containers.readAll().fetchAll();
        console.log('devuelve resultasdod');
        mainWindow.webContents.send('containers',response.resources.map((x)=>x.id));
        
    } catch (error:any){
        mainWindow.webContents.send('containers',[]);
    }
   

}

async function launchQuery(op:Operation,sentence:string):Promise<void>{
    const savedConnection : Client|undefined = cosmosdbClients.find((x:Client)=>x.label == op.dbLabel);
    if(savedConnection == undefined){
        return;
    }
    const client : CosmosClient = savedConnection.client as CosmosClient;
    //launch query para el resultado
    client.database(savedConnection.dbName)
    .container(op.container)
    .items
    .query(sentence,undefined)
    .fetchAll()
    .then((result:FeedResponse<any>)=>{
        mainWindow.webContents.send('sql-result',result.resources);
        mainWindow.webContents.send('sql-count',result.resources.length);
    })
    //launch query para el conteo
}

async function deleteItems(op:Operation,ids:string[]): Promise<void>{
    console.log(ids);
    console.log(op);
    const savedConnection : Client|undefined = cosmosdbClients.find((x:Client)=>x.label == op.dbLabel);
    if(savedConnection == undefined){
        return;
    }
    const client : CosmosClient = savedConnection.client as CosmosClient;
    let promises: Promise<ItemResponse<any>>[] = []
    //remover items del contenedor
    ids.forEach((id:string)=>{
        promises.push(
        client.database(savedConnection.dbName)
        .container(op.container)
        .item(id)
        .delete());
    });

    return Promise.all(promises).then((response)=>{
        mainWindow.webContents.send('popup',{type:'ok',message:`los documentos fueron borrados exitosamente`})
    }).catch((error)=>{
        mainWindow.webContents.send('popup',{type:'ko',message:`Algo salio mal al eliminar los documentos del contenedor ${op.container} de la base de datos ${op.dbLabel}`})
    });
    
}



function saveDbConfig(connectionConfig:AddConnectionType){

    try{
        const data = fs.readFileSync(DATA_FILE,"utf-8");
        let appLocalData:DataType = JSON.parse(data);
        appLocalData.dbConnections.push(connectionConfig);
        fs.writeFileSync(DATA_FILE,JSON.stringify(appLocalData));

    }catch(err){
        const innitalData: DataType = {
            dbConnections:[connectionConfig]
        } 
        fs.writeFileSync(DATA_FILE,JSON.stringify(innitalData));
    } finally{
        console.log('cert file saving...')
        const buffer = Buffer.from(connectionConfig.label, 'binary');
        if (!fs.existsSync(CERT_FOLDER)) {
            fs.mkdirSync(CERT_FOLDER);
        }
        fs.writeFileSync(path.join(CERT_FOLDER,`${connectionConfig.label}.crt`),buffer);
        console.log('cert file saved OK');
        
    }

}

function readDbConnections() : AddConnectionType[]{
    try{
        let data = fs.readFileSync(DATA_FILE,"utf-8");
        let appLocalData:DataType = JSON.parse(data);
        return appLocalData.dbConnections;

    } catch (err){
        return [];
    }
}





let mainWindow:BrowserWindow;
//LISTENERS
app.on("ready" ,()=>{
    mainWindow = new BrowserWindow({
        webPreferences:{
            preload:getPreloadPath(),
        }
    });

    if (isDev()){
        mainWindow.loadURL('http://localhost:5123');
    } else {
        mainWindow.loadFile(path.join(app.getAppPath(),'/dist-react/index.html'));
    }
    

})
app.whenReady().then(()=>{
    ipcMain.handle("saveDbConfig",(event:any,payload:AddConnectionType)=>{saveDbConfig(payload)})
    ipcMain.handle("readDbConnections", ()=>readDbConnections())
    ipcMain.handle("connect",(event:any,payload:AddConnectionType)=>{connect(payload)})
    ipcMain.handle("getContainers",(event:any,payload:string)=>{getContainers(payload)})
    ipcMain.handle("launchQuery",(event:any,payload:QueryRequest)=>{launchQuery(payload.op,payload.sentence)})
    ipcMain.handle("deleteItems",(event:any,payload:DeleteItemRequest)=>{deleteItems(payload.op,payload.ids)})
})
