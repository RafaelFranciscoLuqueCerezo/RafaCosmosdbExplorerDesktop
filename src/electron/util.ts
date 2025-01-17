import fs from 'fs';
import path from 'path';
import {app } from 'electron';


export function isDev():boolean{
    return process.env.NODE_ENV === 'development';
}
export const DATA_FILE : string = path.join(app.getAppPath(),'/local-data.json')
export function writeConnectionConfig(data:DataType){
    fs.writeFile(DATA_FILE,JSON.stringify(data),err=>{
        if (err){
            throw err;
        } else {
            console.log("ok");
        }
    })
}