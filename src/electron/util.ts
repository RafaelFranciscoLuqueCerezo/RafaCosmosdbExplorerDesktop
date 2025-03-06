import path from 'path';
import {app } from 'electron';
import fs from 'fs';


export function isDev():boolean{
    return process.env.NODE_ENV === 'development';
}
const userDataPath = app.getPath('userData');
const folderPath = path.join(userDataPath,'rafacosmosdbexplorer');

export function initRelativePath () : string {
    const folderPath = path.join(userDataPath,'rafacosmosdbexplorer');
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
    }
      
    return folderPath;
}
export const DATA_FILE : string = path.resolve(folderPath,'local-data.json');
export const CERT_FOLDER : string = path.resolve(folderPath,'certificates');
