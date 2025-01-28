import { useState } from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import PhoneIcon from '@mui/icons-material/Phone';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PersonPinIcon from '@mui/icons-material/PersonPin';

type Props = {
    operation:Operation
}
export const ContainerOperation = ({operation}:Props)=>{
    const [open,setOpen] = useState(false);
    const [value, setValue] = useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return(
        <div>
            <div onClick={(_)=>setOpen(!open)}>
                <DeleteIcon/>
                {operation.dbLabel}-{operation.container}
            </div>
            {open && 
            <Tabs value={value} onChange={handleChange} aria-label="icon tabs example">
                <Tab icon={<PhoneIcon />} aria-label="phone" />
                <Tab icon={<FavoriteIcon />} aria-label="favorite" />
                <Tab icon={<PersonPinIcon />} aria-label="person" />
            </Tabs>
            }
        </div>
    )
}