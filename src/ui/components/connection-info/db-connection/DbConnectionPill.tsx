import { useCallback, useEffect, useState } from "react";
import { Collapse, List, ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem, Typography } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import CleanHandsIcon from '@mui/icons-material/CleanHands';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CachedIcon from '@mui/icons-material/Cached';
import React from "react";
import './DbConnectionPill.css'
import { DbContainerPill } from "../db-container/DbContainerPill";
import { useAppStore } from "../../../store/ApplicationStore";

type Props ={
    config:AddConnectionType
}
export default function DbConnectionPill({config}:Props){
    const [open,setOpen] = useState(false);
    const [containers,setContainers] = useState<string[]>([]);
    const [contextMenu, setContextMenu] = React.useState<{
        mouseX: number;
        mouseY: number;
      } | null>(null);
    
    const removeConnection = useAppStore((state)=>state.removeConnection);

    const handleContextMenu = useCallback((event: React.MouseEvent) => {
        event.preventDefault();
        setContextMenu(
          contextMenu === null
            ? {
                mouseX: event.clientX + 2,
                mouseY: event.clientY - 6,
              }
            : // repeated contextmenu when it is already open closes it with Chrome 84 on Ubuntu
              // Other native context menus might behave different.
              // With this behavior we prevent contextmenu from the backdrop to re-locale existing context menus.
              null,
        );
      },[])

    const handleClose = useCallback(() => {
        setContextMenu(null);
    },[]);

    useEffect(()=>{
        const unSub : UnSubFunction = window.electron.subscribeContainers((cnt:string[])=>setContainers(cnt));
        window.electron.connect(config).then((_)=>window.electron.getContainers(config.label));
        return()=>{
            unSub();
        }
    },[])
    return(
        <div className="dbConnectionPillContainer" style={{overflowY: 'auto'}}>
        <ListItemButton onContextMenu={handleContextMenu} dense disableGutters onClick={()=>{setOpen(!open)}}>
                    {open ? <ExpandLess /> : <ExpandMore />}
                    <ListItemIcon>
                    </ListItemIcon>
                    <ListItemText primary={config.label} />
                    </ListItemButton>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {containers.map((container:string,index:number)=><DbContainerPill key={`${config.label}-${container}-${index}`} dbLabel={config.label} container={container}/>)}
                    </List>
                </Collapse>
                <Menu
                    open={contextMenu !== null}
                    onClose={handleClose}
                    anchorReference="anchorPosition"
                    anchorPosition={
                        contextMenu !== null
                        ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
                        : undefined
                    }
                    >
                    <MenuItem onClick={(_)=>{
                        window.electron.refresh(config);
                    }}>
                    <ListItemIcon>
                        <CachedIcon/>
                    </ListItemIcon>
                    <Typography variant="inherit">Refrescar conexion</Typography>
                    </MenuItem>
                    <MenuItem onClick={(_)=>{
                        window.electron.removeDbConfig(config.label).then((_)=>{
                            removeConnection(config.label)
                        })
                    }}>
                    <ListItemIcon>
                        <DeleteForeverIcon/>
                    </ListItemIcon>
                    <Typography variant="inherit">Borrar conexion</Typography>
                    </MenuItem>
                    <MenuItem onClick={(_)=>{
                        const containersOperation: Operation[] = containers.map((container:string)=>({dbLabel:config.label,container,type:'NONE'}));
                        window.electron.cleanAllContainers(containersOperation);
                    }}>
                    <ListItemIcon>
                        <CleanHandsIcon/>
                    </ListItemIcon>
                    <Typography variant="inherit">Limpiar contenedores</Typography>
                    </MenuItem>
                    <MenuItem onClick={(_)=>{
                        const containersOperation: Operation[] = containers.map((container:string)=>({dbLabel:config.label,container,type:'NONE'}));
                        window.electron.deleteAllContainers(containersOperation);
                    }}>
                    <ListItemIcon>
                        <DeleteOutlineIcon/>
                    </ListItemIcon>
                    <Typography variant="inherit">Borrar contenedores</Typography>
                    </MenuItem>
                </Menu>
        </div>
    )

}