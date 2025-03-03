import { useEffect, useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import InfoTwoToneIcon from '@mui/icons-material/InfoTwoTone';
import ReportTwoToneIcon from '@mui/icons-material/ReportTwoTone';

export const Popup = () => {
    const [props,setProps] = useState<PopUpProps>({type:'no',title:'',message:''})

    useEffect(()=>{
        const popupUnSub : UnSubFunction = window.electron.subscribePopup((response:PopUpProps)=>{
            setProps(response);
        });

        return()=>{
            popupUnSub();
        }

    },[])
    
    return (
        <div style={{display:props.type == 'no' ? 'none' : 'flex',position:'absolute',width:'100vw',height:'100vh',justifyContent:'center',alignItems:'center'}}>
            <div style={{zIndex:'6',backgroundColor:props.type == 'ok' ? '#dcf8ff' : '#ffdcdc',boxShadow: '2px 2px 4px 0px rgba(66, 68, 90, 1)',padding:'20px',borderRadius:'10px',maxWidth:'600px',marginBottom:'300px'}}>
                <div style={{display:'flex',justifyContent:'space-between'}}>
                    <div style={{display:'flex',position:'relative',bottom:'10px'}}>
                    {props.type == 'ok' && <InfoTwoToneIcon color="info" sx={{position:'relative',top:'27px',marginRight:'10px'}}/>}
                    {props.type == 'ko' && <ReportTwoToneIcon color="error" sx={{position:'relative',top:'27px',marginRight:'10px'}}/>}
                    <h2>{props.title}</h2>
                    </div>
                    <IconButton className="no-outline"  aria-label="delete" size="small" sx={{position:'relative',bottom:'30px',left:'10px'}} onClick={(_)=>{setProps({type:'no',title:'',message:''})}}>
                        <CloseIcon/>
                    </IconButton>
                    
                </div>
                
                <div style={{width:'100%',height:'1px',backgroundColor:'gray',opacity:'.3',position:'relative',bottom:'10px'}}/>
                <div>
                    {props.message}
                </div>
            </div>

        </div>
    
        
        
    )
}