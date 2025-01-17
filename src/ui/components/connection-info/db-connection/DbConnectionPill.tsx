import { useState } from "react";
import { Collapse, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { ExpandLess, ExpandMore, StarBorder } from '@mui/icons-material';

type Props ={
    name:string
}
export default function DbConnectionPill({name}:Props){
    const [open,setOpen] = useState(false);
    return(
        <>
        <ListItemButton onClick={()=>{setOpen(!open)}}>
                    <ListItemIcon>
                    </ListItemIcon>
                    <ListItemText primary={name} />
                    {open ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                    <ListItemButton sx={{ pl: 4 }}>
                        <ListItemIcon>
                        <StarBorder />
                        </ListItemIcon>
                        <ListItemText primary="Starred" />
                    </ListItemButton>
                    </List>
                </Collapse>
        </>
    )

}