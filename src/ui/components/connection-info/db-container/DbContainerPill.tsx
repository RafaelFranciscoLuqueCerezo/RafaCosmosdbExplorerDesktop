import {ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem, Typography } from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import{ useCallback, useState } from 'react';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import CleanHandsIcon from '@mui/icons-material/CleanHands';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import { useAppStore } from '../../../store/ApplicationStore';

type Props = {
    dbLabel:string,
    container:string
}
export const DbContainerPill=({container,dbLabel}:Props)=>{
    const [contextMenu, setContextMenu] = useState<{
        mouseX: number;
        mouseY: number;
      } | null>(null);
    const [open,setOpen] = useState(false);
    const addOperation = useAppStore((state)=>state.addOperation);

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

    return(
        <>
        <ListItemButton sx={{ ml: 2 }} dense disableGutters onContextMenu={handleContextMenu} onClick={()=>{setOpen(!open)}} >
            <ListItemIcon>
            <FolderIcon sx={{fontSize:'small'}} />
            </ListItemIcon>
            <ListItemText primary={container} />
        </ListItemButton>
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
            addOperation({
                dbLabel,
                container,
                type:'SQL'
            })
            handleClose();
        }}>
        <ListItemIcon>
            <QueryStatsIcon/>
        </ListItemIcon>
        <Typography variant="inherit">Operaciones</Typography>
        </MenuItem>
        <MenuItem onClick={handleClose}>
        <ListItemIcon>
            <CleanHandsIcon/>
        </ListItemIcon>
        <Typography variant="inherit">Limpiar contenedor</Typography>
        </MenuItem>
        <MenuItem onClick={handleClose}>
        <ListItemIcon>
            <DeleteForeverIcon/>
        </ListItemIcon>
        <Typography variant="inherit">Borrar contenedor</Typography>
        </MenuItem>
        </Menu>
        </>
    )
}