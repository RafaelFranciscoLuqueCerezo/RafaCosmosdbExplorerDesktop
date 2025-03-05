import { useEffect, useState } from "react";
import './Loader.css'

export const Loader = ()=>{
    const [open,setOpen] = useState<boolean>(false);
    useEffect(()=>{
        const loaderUnSub : UnSubFunction = window.electron.subscribeLoader((response:boolean)=>{
            setOpen(response);
        });

        return()=>{
            loaderUnSub();
        }

    },[])
    return (
        <div style={{position:'absolute',width:'100vw',height:'100vh',display:open?'flex':'none',justifyContent:'center',alignItems:'center',backgroundColor:'gray',zIndex:'6',opacity:'.6'}}>
                <span className="loader"></span>
        </div>
    );
}