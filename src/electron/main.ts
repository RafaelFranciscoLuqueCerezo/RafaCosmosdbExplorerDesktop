import {app, BrowserWindow,ipcMain,Menu } from 'electron';
import { Agent, ConnectionMode, ContainerDefinition, ContainerRequest, ContainerResponse, CosmosClient, FeedResponse, ItemResponse, Resource } from "@azure/cosmos";
import https from 'https';
import path from 'path';
import { CERT_FOLDER, DATA_FILE, initRelativePath, isDev } from './util.js';
import { getPreloadPath } from './pathResolver.js';
import fs from 'fs';

let cosmosdbClients : Client[] = [];
let cosmosdbAgents : Agent[] = []

Menu.setApplicationMenu(null);

function initLoader(){
    mainWindow.webContents.send('loader',true);
}
function finishLoader(){
    mainWindow.webContents.send('loader',false);
}




function connect(config:AddConnectionType){
    initLoader();

    if(cosmosdbClients.find((element:Client)=>element.label==config.label)){
        finishLoader();
        return;
    }
    const agent = new https.Agent( {
        ca: fs.readFileSync(path.join(CERT_FOLDER,`${config.label}.crt`)),
        keepAlive:true,
        rejectUnauthorized:false
    });
    const client = new CosmosClient({
        key: config.secret,
        endpoint: config.endpoint,
        connectionPolicy:{
            enableEndpointDiscovery:false,
            connectionMode: ConnectionMode.Gateway,
            requestTimeout: 50000,
        
        },
        agent
    })
    cosmosdbClients.push({label:config.label,dbName:config.dbName,client})
    cosmosdbAgents.push(agent);
    finishLoader();
}

async function getContainers(label:string):Promise<void>{
    initLoader();
    const element = cosmosdbClients.find((client:Client)=>client.label===label);
    if(element === undefined){
        finishLoader();
        mainWindow.webContents.send('containers',[]);
        return;
    }

    try{
        const client : CosmosClient = element.client as CosmosClient;
        const response = await client.database(element.dbName).containers.readAll().fetchAll();
        finishLoader();
        mainWindow.webContents.send('containers',response.resources.map((x)=>x.id));
        
        
    } catch (error:any){
        finishLoader();
        mainWindow.webContents.send('containers',[]);
    }
   

}

async function launchQuery(op:Operation,sentence:string):Promise<void>{
    initLoader();
    const savedConnection : Client|undefined = cosmosdbClients.find((x:Client)=>x.label == op.dbLabel);
    if(savedConnection == undefined){
        finishLoader();
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
        finishLoader();
        mainWindow.webContents.send('sql-result',result.resources);
        mainWindow.webContents.send('sql-count',result.resources.length);
    }).catch((err)=>{
        finishLoader();
        mainWindow.webContents.send('popup',{type:'ko',title:'Sentencia SQL No valida',message:`${err}`})
    })
    
}

async function deleteItems(op:Operation,ids:string[]): Promise<void>{
    initLoader();
    const savedConnection : Client|undefined = cosmosdbClients.find((x:Client)=>x.label == op.dbLabel);
    if(savedConnection == undefined){
        finishLoader();
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

    return Promise.all(promises).then((_)=>{
        finishLoader();
        mainWindow.webContents.send('popup',{type:'ok',title:`${op.dbLabel} ${op.container}`,message:`los documentos fueron borrados exitosamente`})
    }).catch((_)=>{
        finishLoader();
        mainWindow.webContents.send('popup',{type:'ko',title:`${op.dbLabel} ${op.container}`,message:`Algo salio mal al eliminar los documentos del contenedor ${op.container} de la base de datos ${op.dbLabel}`})
    });
    
}

async function cleanContainers(op:Operation[]): Promise<void>{
    initLoader();
    if(op.length == 0 ){
        finishLoader();
        return;
    }
    const savedConnection : Client|undefined = cosmosdbClients.find((x:Client)=>x.label == op[0].dbLabel);
    if(savedConnection == undefined){
        finishLoader();
        return;
    }
    const client : CosmosClient = savedConnection.client as CosmosClient;
    let promises: Promise<any>[] = [];

    let title:string = '';
    let message:string = '';
    let errTitle:string = '';
    let errMessage:string = '';
    if(op.length == 1){
        title = 'Exito en la limpieza';
        errTitle = 'Error en la limpieza';
        message = 'El contenedor ha sido limpiado exitosamente';
        errMessage = 'No se pudo limpiar el contenido del contenedor';
    } else {
        title = 'Exito en la limpieza de la base de datos';
        message = 'La base de datos ha sido limpiada exitosamente, todos los contenedores estan vacios'
        errTitle = 'Error en la limpieza de la base de datos';
        errMessage = 'No se pudo limpiar la base de datos correctamente, algo salio mal'
    }


    //clean containers
    op.forEach((element:Operation)=>{
        promises.push(
                client.database(savedConnection.dbName)
                .container(element.container)
                .read().then((properties:ContainerResponse)=>{
                    return client.database(savedConnection.dbName).container(element.container).delete().then((_)=>{
                        const original : (ContainerDefinition & Resource) | undefined = properties.resource;
                        if(original == undefined ){
                            return;
                        }
                        const request: ContainerRequest = {
                            ...original
                        }
                        return client.database(savedConnection.dbName).containers.create(request)
                    })
                })
        )
    });

    

    return Promise.all(promises).then((response)=>{
        return getContainers(op[0].dbLabel).then((_)=>{
            finishLoader();
            mainWindow.webContents.send('popup',{type:'ok',title,message});
        })
    }).catch((error)=>{
        finishLoader();
        mainWindow.webContents.send('popup',{type:'ko',title:errTitle,message:`${errMessage}. Razon: ${error}`});
    });
    
}

async function importDocument(request:ImportDocumentRequest):Promise<void>{
    initLoader();
    let documents:any[]=[]
    try{
        documents = JSON.parse(request.content);
    }catch(error){
        finishLoader();
        mainWindow.webContents.send('popup',{type:'ko',title:'Documentos mal formados',message:'El documento que intenta insertar en el contenedor, esta mal formado, por favor revise el formato'});
        return;
    }
    const savedConnection : Client|undefined = cosmosdbClients.find((x:Client)=>x.label == request.op.dbLabel);
    if(savedConnection == undefined){
        finishLoader();
        return;
    }
    const client : CosmosClient = savedConnection.client as CosmosClient;

    return client.database(savedConnection.dbName).container(request.op.container).items.create(documents).then((_)=>{
        finishLoader();
        mainWindow.webContents.send('popup',{type:'ok',title:'Documentos insertados con exito',message:`Los documentos han sido insertados con exito en el contenedor ${request.op.container}`});
    })

}


async function deleteContainers(op:Operation[]):Promise<void>{
    initLoader();
    if(op.length == 0 ){
        finishLoader();
        return;
    }
    const savedConnection : Client|undefined = cosmosdbClients.find((x:Client)=>x.label == op[0].dbLabel);
    if(savedConnection == undefined){
        finishLoader();
        return;
    }
    const client : CosmosClient = savedConnection.client as CosmosClient;
    let promises: Promise<any>[] = [];

    let title:string = '';
    let message:string = '';
    let errTitle:string = '';
    let errMessage:string = '';
    if(op.length == 1){
        title = 'Exito en la borrado';
        errTitle = 'Error en el borrado';
        message = 'El contenedor ha sido borrado exitosamente';
        errMessage = 'No se pudo borrar el contenedor';
    } else {
        title = 'Exito en el borrado de la base de datos';
        message = 'La base de datos ha sido borrada exitosamente, no existen contenedores'
        errTitle = 'Error en el borrado de la base de datos';
        errMessage = 'No se pudo borrar todos los contenedores de la base de datos, algo salio mal'
    }

    //delete containers
    op.forEach((element:Operation)=>{
        promises.push(
            client.database(savedConnection.dbName).container(element.container).delete()
        )
    })

    return Promise.all(promises).then((_)=>{
        return getContainers(op[0].dbLabel).then((_)=>{
            finishLoader();
            mainWindow.webContents.send('popup',{type:'ok',title,message});
        })
    }).catch((error)=>{
        finishLoader();
        mainWindow.webContents.send('popup',{type:'ko',title:errTitle,message:`${errMessage}. Razon: ${error}`});
        
    });
}



function saveDbConfig(connectionConfig:AddConnectionType){
    initLoader();
    try{
        const data = fs.readFileSync(DATA_FILE,"utf-8");
        let appLocalData:DataType = JSON.parse(data);
        appLocalData.dbConnections.push(connectionConfig);
        fs.writeFileSync(DATA_FILE,JSON.stringify(appLocalData));

    }catch(err){
        console.log(err);
        const innitalData: DataType = {
            dbConnections:[connectionConfig]
        } 
        fs.writeFileSync(DATA_FILE,JSON.stringify(innitalData));
    } finally{
        try{
            const buffer = Buffer.from(connectionConfig.label, 'binary');
            if (!fs.existsSync(CERT_FOLDER)) {
                fs.mkdirSync(CERT_FOLDER);
            }
            fs.writeFileSync(path.join(CERT_FOLDER,`${connectionConfig.label}.crt`),buffer);
            finishLoader();
        } catch (err2){
            console.log(err2)
            finishLoader();
        }
        
        
    }

}

async function removeDbConfig(label:string):Promise<void>{
    initLoader();
    try{
        const data = fs.readFileSync(DATA_FILE,"utf-8");
        let appLocalData:DataType = JSON.parse(data);
        const newConfig : AddConnectionType[] = appLocalData.dbConnections.filter((element:AddConnectionType)=>element.label!==label)
        fs.writeFileSync(DATA_FILE,JSON.stringify(newConfig));
        fs.unlinkSync(path.join(CERT_FOLDER,`${label}.crt`))
        return getContainers(label).then((_)=>{
            finishLoader();
            mainWindow.webContents.send('popup',{type:'ok',title:`Conexion borrada con ${label}`,message:'La conexion con la base de datos ha sido borrada exitosamente'});
        })
    

    }catch(err){
        //popup diciendo que algo salio mal
        finishLoader();
        mainWindow.webContents.send('popup',{type:'ko',title:`Error en la base de datos ${label}`,message:`No se pudo borrar la conexion con la base de datos. Razon ${err}`});
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

function closeAllConnections():void{
    cosmosdbAgents.forEach((agent:Agent)=>{
        agent.destroy();
    });
}

function refreshConnection(config:AddConnectionType):void{
    initLoader();
    //deleting from existing array if needed
    let matchIndex : number = -1;
    const size : number = cosmosdbClients.length;
    for(let i=0;i<size;i++){
        if(cosmosdbClients[i].label == config.label){
            matchIndex = i;
            break;
        }
    }
    if(matchIndex == -1){
        finishLoader();
        return;
    }
    cosmosdbClients.splice(matchIndex,1);
    cosmosdbAgents.splice(matchIndex,1);
    //establishing new connection
    const agent = new https.Agent( {
        ca: fs.readFileSync(path.join(CERT_FOLDER,`${config.label}.crt`)),
        keepAlive:true,
        rejectUnauthorized:false
    });
    const client = new CosmosClient({
        key: config.secret,
        endpoint: config.endpoint,
        connectionPolicy:{
            enableEndpointDiscovery:false,
            connectionMode: ConnectionMode.Gateway,
            requestTimeout: 50000,
        
        },
        agent
    })
    cosmosdbClients.push({label:config.label,dbName:config.dbName,client})
    cosmosdbAgents.push(agent);
    mainWindow.webContents.send('popup',{type:'ok',title:`Conexion refrescada con ${config.label}`,message:'La conexion con la base de datos ha sido refrescada correctamente'});
    finishLoader();
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
        initRelativePath();
        mainWindow.loadFile(path.join(app.getAppPath(),'/dist-react/index.html'));
    }

    mainWindow.on('close',(_)=>{
        closeAllConnections();
    })
    

})

app.whenReady().then(()=>{
    ipcMain.handle("saveDbConfig",(event:any,payload:AddConnectionType)=>{saveDbConfig(payload)})
    ipcMain.handle("removeDbConfig",(event:any,payload:string)=>{removeDbConfig(payload)})
    ipcMain.handle("readDbConnections", ()=>readDbConnections())
    ipcMain.handle("connect",(event:any,payload:AddConnectionType)=>{connect(payload)})
    ipcMain.handle("refresh",(event:any,payload:AddConnectionType)=>{refreshConnection(payload)})
    ipcMain.handle("getContainers",(event:any,payload:string)=>{getContainers(payload)})
    ipcMain.handle("launchQuery",(event:any,payload:QueryRequest)=>{launchQuery(payload.op,payload.sentence)})
    ipcMain.handle("deleteItems",(event:any,payload:DeleteItemRequest)=>{deleteItems(payload.op,payload.ids)})
    ipcMain.handle("cleanContainer",(event:any,payload:Operation)=>{cleanContainers([{dbLabel:payload.dbLabel,container:payload.container,type:'NONE'}])})
    ipcMain.handle("deleteContainer",(event:any,payload:Operation)=>{deleteContainers([{dbLabel:payload.dbLabel,container:payload.container,type:'NONE'}])})
    ipcMain.handle("cleanAllContainers",(event:any,payload:Operation[])=>{cleanContainers(payload)})
    ipcMain.handle("deleteAllContainers",(event:any,payload:Operation[])=>{deleteContainers(payload)})
    ipcMain.handle("importDocument",(event:any,payload:ImportDocumentRequest)=>{importDocument(payload)})
})
