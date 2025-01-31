import { useEffect, useState } from "react";
import './ContainerOperationPill.css';
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
const tabOperationArray: ('SQL'|'DELETE'|'IMPORT'|'NONE') []  = ['SQL','IMPORT','DELETE'];

export const ContainerOperationPill = ({operation}:Props)=>{

    const [value, setValue] = useState(0);
    const activeOperation = useAppStore((state)=>state.activeOperation);
    const changeActiveOperation = useAppStore((state)=>state.changeActiveOperation);
    const isActive:boolean = operation.dbLabel == activeOperation.dbLabel && operation.container == activeOperation.container;


    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return(
        <div className="container-operation-opts" style={{marginRight:'5px'}}>
            <div style={{cursor:'pointer'}} onClick={(_)=>{
                changeActiveOperation({...operation,type:tabOperationArray[value]});
            }}>
                <div  className={`${isActive && 'container-op-active'}`}style={{padding:'2px',backgroundColor: '#f9f9f9', display:"flex",justifyContent:'space-between',minWidth:'154px',whiteSpace:'nowrap',overflow:'hidden'}}>
                        <div><strong style={{fontSize:'xx-small'}}>{operation.dbLabel}</strong><span style={{fontSize:'x-small'}}>-{operation.container}</span></div>
                        <IconButton aria-label="delete" size="small">
                            <CloseIcon fontSize="inherit"/>
                        </IconButton>
                </div> 
            </div>
            {isActive && 
            <Tabs  value={value} onChange={handleChange} aria-label="icon tabs example">
                <Tab onClick={(_)=>changeActiveOperation({...operation,type:'SQL'})}  icon={<AnalyticsIcon fontSize="inherit"/>} aria-label="sql" />
                <Tab onClick={(_)=>changeActiveOperation({...operation,type:'IMPORT'})} icon={<AttachFileIcon fontSize="inherit"/>} aria-label="import" />
                <Tab onClick={(_)=>changeActiveOperation({...operation,type:'DELETE'})} icon={<AutoDeleteIcon fontSize="inherit"/>} aria-label="delete" />
            </Tabs>
            }
        </div>
    )
}