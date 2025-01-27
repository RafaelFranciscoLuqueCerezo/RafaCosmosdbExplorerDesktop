import path from 'path';
import {app } from 'electron';


export function isDev():boolean{
    return process.env.NODE_ENV === 'development';
}
export const DATA_FILE : string = path.join(app.getAppPath(),'local-data.json');
export const CERT_FOLDER : string = path.join(app.getAppPath(),'certificates');
