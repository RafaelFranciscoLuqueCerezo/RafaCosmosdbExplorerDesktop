import {app, BrowserWindow,ipcMain,Menu } from 'electron';
import path from 'path';
import { DATA_FILE, isDev, writeConnectionConfig } from './util.js';
import { getPreloadPath } from './pathResolver.js';
import fs from 'fs';

//Menu.setApplicationMenu(null);

//FUNCIONES BACK
function saveDbConfig(connectionConfig:AddConnectionType){
    fs.readFile(DATA_FILE,"utf-8",(err,data)=>{
        if(err){
            const innitalData: DataType = {
                dbConnections:[connectionConfig]
            } 
            writeConnectionConfig(innitalData);
            return;
        }
        let appLocalData:DataType = JSON.parse(data);
        appLocalData.dbConnections.push(connectionConfig);
        writeConnectionConfig(appLocalData);
    })
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






//LISTENERS
app.on("ready" ,()=>{
    const mainWindow = new BrowserWindow({
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
    ipcMain.handle("saveDbConfig",async (event:any,payload:AddConnectionType)=>{saveDbConfig(payload)})
    ipcMain.handle("readDbConnections", ()=>readDbConnections())
})
