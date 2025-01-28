import { useEffect, useState } from "react";
import DeleteIcon from '@mui/icons-material/Delete';
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

    const isActive=()=>{
        return operation.dbLabel == activeOperation.dbLabel && operation.container == activeOperation.container;
    }


    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return(
        <div>
            <div onClick={(_)=>changeActiveOperation(operation)}>
                <DeleteIcon/>
                {operation.dbLabel}-{operation.container}
            </div>
            {isActive() && 
            <Tabs value={value} onChange={handleChange} aria-label="icon tabs example">
                <Tab icon={<PhoneIcon />} aria-label="phone" />
                <Tab icon={<FavoriteIcon />} aria-label="favorite" />
                <Tab icon={<PersonPinIcon />} aria-label="person" />
            </Tabs>
            }
        </div>
    )
}