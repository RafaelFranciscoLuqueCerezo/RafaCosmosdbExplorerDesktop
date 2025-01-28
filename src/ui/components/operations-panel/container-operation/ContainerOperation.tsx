import { useEffect, useState } from "react";
import './ContainerOperation.css';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import PhoneIcon from '@mui/icons-material/Phone';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PersonPinIcon from '@mui/icons-material/PersonPin';
import { useAppStore } from "../../../store/ApplicationStore";

type Props = {
    operation:Operation
}
export const ContainerOperation = ({operation}:Props)=>{

    const [value, setValue] = useState(0);
    const activeOperation = useAppStore((state)=>state.activeOperation);
    const changeActiveOperation = useAppStore((state)=>state.changeActiveOperation);
    const isActive:boolean = operation.dbLabel == activeOperation.dbLabel && operation.container == activeOperation.container;
    console.log(isActive);


    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return(
        <div style={{marginRight:'10px'}}>
            <div style={{width:'auto'}} onClick={(_)=>changeActiveOperation(operation)}>
                <div  className={`${isActive && 'container-op-active'}`}style={{padding:'2px',backgroundColor: '#f9f9f9'}}>
                        <span><strong>{operation.dbLabel}</strong>-{operation.container}</span>
                        <IconButton aria-label="delete" size="small">
                            <CloseIcon fontSize="inherit"/>
                        </IconButton>
                </div> 
            </div>
            {isActive && 
            <Tabs value={value} onChange={handleChange} aria-label="icon tabs example">
                <Tab icon={<PhoneIcon />} aria-label="phone" />
                <Tab icon={<FavoriteIcon />} aria-label="favorite" />
                <Tab icon={<PersonPinIcon />} aria-label="person" />
            </Tabs>
            }
        </div>
    )
}