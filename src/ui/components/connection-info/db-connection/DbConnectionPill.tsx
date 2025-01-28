import { useCallback, useEffect, useState } from "react";
import { Collapse, List, ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem, Typography } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import FolderIcon from '@mui/icons-material/Folder';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import CleanHandsIcon from '@mui/icons-material/CleanHands';
import AddIcon from '@mui/icons-material/Add';
import React from "react";
import './DbConnectionPill.css'
import { DbContainerPill } from "../db-container/DbContainerPill";

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
        //Llamar a electron para obtener los containers, solo llamarlo una vez
        console.log(`HOLITA DESDE ${config.dbName}`);
        const asyncFunction = async () => {
            window.electron.connect(config)
            .then((_)=>window.electron.getContainers(config.label))
            .then((_)=>window.electron.subscribeContainers((cnt:string[])=>setContainers(cnt)))
          }
        asyncFunction();

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
                        {containers.map((container:string)=><DbContainerPill dbLabel={config.label} container={container}/>)}
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
                    <MenuItem onClick={handleClose}>
                    <ListItemIcon>
                        <DeleteForeverIcon/>
                    </ListItemIcon>
                    <Typography variant="inherit">Borrar conexion</Typography>
                    </MenuItem>
                    <MenuItem onClick={handleClose}>
                    <ListItemIcon>
                        <CleanHandsIcon/>
                    </ListItemIcon>
                    <Typography variant="inherit">Limpiar contenedor</Typography>
                    </MenuItem>
                    <MenuItem onClick={handleClose}>
                    <ListItemIcon>
                        <AddIcon/>
                    </ListItemIcon>
                    <Typography variant="inherit">Crear borrado programado</Typography>
                    </MenuItem>
                </Menu>
        </div>
    )

}