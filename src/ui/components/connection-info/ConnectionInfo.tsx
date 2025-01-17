import './ConnectionInfo.css'
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import Divider from '@mui/material/Divider';
import { ApplicationStore, Page } from '../../store/ApplicationStore';
import { useCallback, useEffect, useState } from 'react';
import { Collapse, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { ExpandLess, ExpandMore, StarBorder } from '@mui/icons-material';
import DbConnectionPill from './db-connection/DbConnectionPill';

async function getConnections():Promise<AddConnectionType[]>{
    //@ts-ignore
    const value=  window.electron.readDbConnections();
    alert(value);
    return value
}

export default function ConnectionInfo(){
    const navigateTo = ApplicationStore((state)=>state.navigateTo);
    

    const onMouseDown = useCallback(()=>{
        document.addEventListener('mousemove', resize);
        document.addEventListener('mouseup', stopResize);
    },[]);
    const resize = useCallback((e:any)=>{
        const connectionContainerElement = document.getElementById("connectionContainer");
        if(connectionContainerElement==null){
            return;
        }
        connectionContainerElement.style.width = e.pageX - connectionContainerElement.getBoundingClientRect().left + 'px';
    },[]);
    const stopResize = useCallback(()=>{
        document.removeEventListener('mousemove', resize);
        document.removeEventListener('mouseup', stopResize);
    },[]);


    return (
        <div id="connectionContainer">
            <div id='connectionContent'>
                <div style={{display:'flex', alignItems: 'center'}}>
                    <h4 style={{marginRight:'2px'}}>Conexiones</h4>
                    <IconButton onClick={()=>navigateTo(Page.ADD_CONNECTION)} aria-label="add" >
                    <AddIcon />
                    </IconButton>
                </div>
                <Divider />
                <List>
                    {
                        getConnections().map((element)=><DbConnectionPill name={element.label}/>)
                    }    
                </List>    
                
            </div>
            <div className='resizable' onMouseDown={onMouseDown}/>
        </div>
      )
}