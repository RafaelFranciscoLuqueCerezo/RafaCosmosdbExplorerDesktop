import {app, BrowserWindow,ipcMain,Menu } from 'electron';
import path from 'path';
import { isDev } from './util.js';
import { getPreloadPath } from './pathResolver.js';

//Menu.setApplicationMenu(null);

function saveDbConfig(data:AddConnectionType){
    console.log(data.label);
}



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
})
