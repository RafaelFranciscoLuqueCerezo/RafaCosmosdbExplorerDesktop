import {app, BrowserWindow,ipcMain,Menu } from 'electron';
import { ConnectionMode, CosmosClient } from "@azure/cosmos";
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
})
