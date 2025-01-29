import { useEffect, useState } from "react";
import './ContainerOperation.css';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useAppStore } from "../../../store/ApplicationStore";
import AttachFileIcon from '@mui/icons-material/AttachFile';
import AutoDeleteIcon from '@mui/icons-material/AutoDelete';
import AnalyticsIcon from '@mui/icons-material/Analytics';

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
        <div className="container-operation-opts" style={{marginRight:'5px'}}>
            <div style={{cursor:'pointer'}} onClick={(_)=>changeActiveOperation(operation)}>
                <div  className={`${isActive && 'container-op-active'}`}style={{padding:'2px',backgroundColor: '#f9f9f9', display:"flex",justifyContent:'space-between',minWidth:'154px',whiteSpace:'nowrap',overflow:'hidden'}}>
                        <div><strong style={{fontSize:'xx-small'}}>{operation.dbLabel}</strong><span style={{fontSize:'x-small'}}>-{operation.container}</span></div>
                        <IconButton aria-label="delete" size="small">
                            <CloseIcon fontSize="inherit"/>
                        </IconButton>
                </div> 
            </div>
            {isActive && 
            <Tabs  value={value} onChange={handleChange} aria-label="icon tabs example">
                <Tab  icon={<AnalyticsIcon fontSize="small"/>} aria-label="phone" />
                <Tab  icon={<AttachFileIcon fontSize="small"/>} aria-label="favorite" />
                <Tab  icon={<AutoDeleteIcon fontSize="small"/>} aria-label="person" />
            </Tabs>
            }
        </div>
    )
}