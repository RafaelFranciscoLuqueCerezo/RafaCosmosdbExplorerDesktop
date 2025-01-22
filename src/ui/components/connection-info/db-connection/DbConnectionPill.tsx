import { useCallback, useEffect, useState } from "react";
import { Collapse, Divider, List, ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem, Typography } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import FolderIcon from '@mui/icons-material/Folder';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import CleanHandsIcon from '@mui/icons-material/CleanHands';
import AddIcon from '@mui/icons-material/Add';
import React from "react";
import './DbConnectionPill.css'

type Props ={
    name:string
}
export default function DbConnectionPill({name}:Props){
    const [open,setOpen] = useState(false);
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

    },[])
    return(
        <div className="dbConnectionPillContainer">
        <ListItemButton onContextMenu={handleContextMenu} dense disableGutters onClick={()=>{setOpen(!open)}}>
                    {open ? <ExpandLess /> : <ExpandMore />}
                    <ListItemIcon>
                    </ListItemIcon>
                    <ListItemText primary={name} />
                    </ListItemButton>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                    <ListItemButton sx={{ ml: 2 }} dense disableGutters>
                        <ListItemIcon>
                        <FolderIcon sx={{fontSize:'small'}} />
                        </ListItemIcon>
                        <ListItemText primary={"ContainerDeImportancioa1"} />
            
                    </ListItemButton>
                    <ListItemButton sx={{ml: 2}} dense disableGutters>
                        <ListItemIcon>
                        <FolderIcon sx={{fontSize:'small'}} />
                        </ListItemIcon>
                        <ListItemText primary={"Container2"} />
                    </ListItemButton>
                    
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