import { useState } from "react";
import './ContainerOperationPill.css';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useAppStore } from "../../../store/ApplicationStore";
import AttachFileIcon from '@mui/icons-material/AttachFile';
import AnalyticsIcon from '@mui/icons-material/Analytics';

type Props = {
    operation:Operation
}
const tabOperationArray: ('SQL'|'IMPORT'|'NONE') []  = ['SQL','IMPORT'];

export const ContainerOperationPill = ({operation}:Props)=>{

    const [value, setValue] = useState(0);
    const activeOperation = useAppStore((state)=>state.activeOperation);
    const changeActiveOperation = useAppStore((state)=>state.changeActiveOperation);
    const removeOperation = useAppStore((state)=>state.removeOperation);
    const isActive:boolean = operation.dbLabel == activeOperation.dbLabel && operation.container == activeOperation.container;


    const handleChange = (_:any, newValue: number) => {
        setValue(newValue);
    };

    return(
        <div className="container-operation-opts" style={{marginRight:'5px'}}>
            <div>
                <div  className={`${isActive && 'container-op-active'}`}style={{padding:'2px',backgroundColor: '#f9f9f9', display:"flex",justifyContent:'space-between',minWidth:'154px',whiteSpace:'nowrap',overflow:'hidden'}}>
                        <div style={{cursor:'pointer'}} onClick={(_)=>{changeActiveOperation({...operation,type:tabOperationArray[value]})}} ><strong style={{fontSize:'xx-small'}}>{operation.dbLabel}</strong><span style={{fontSize:'x-small'}}>-{operation.container}</span></div>
                        <IconButton className="no-outline" aria-label="delete" size="small" onClick={(_)=>{removeOperation(operation)}}>
                            <CloseIcon fontSize="inherit"/>
                        </IconButton>
                </div> 
            </div>
            {isActive && 
            <Tabs className="tabs" value={value} onChange={handleChange} aria-label="icon tabs example">
                <Tab className="tab" onClick={(_)=>changeActiveOperation({...operation,type:'SQL'})}  icon={<AnalyticsIcon fontSize="inherit"/>} aria-label="sql" />
                <Tab className="tab" onClick={(_)=>changeActiveOperation({...operation,type:'IMPORT'})} icon={<AttachFileIcon fontSize="inherit"/>} aria-label="import" />
            </Tabs>
            }
        </div>
    )
}