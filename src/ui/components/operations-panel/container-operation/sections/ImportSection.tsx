import { useEffect, useState } from "react";
import IconButton from '@mui/material/IconButton';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { CntOpMap } from "../../../../CntOpMap";
import './ImportSection.css';
type Props = {
    operation:Operation
}

export const ImportSection = ({operation}:Props)=>{
    const [importContent,setImportContent] = useState("");

    useEffect(()=>{
        //TODO recuperar del mapa global tanto el resultado como el text area
        CntOpMap.innitVariables(operation);
        setImportContent(CntOpMap.getImport(operation));
    },[operation])

    return (
        <div style={{display:"flex",flexDirection:"column",justifyContent:'flex-start',alignItems:'stretch',height:'100%'}}>
            <div style={{height:'100%',display:'flex',justifyContent:'stretch',padding:'5px 5px 5px 0',position:'relative'}}>
                <textarea  spellCheck='false' className='import-area' value={importContent} 
                    onChange={
                        (event)=>{
                            CntOpMap.addImport(operation,event.target.value)
                            setImportContent(event.target.value);
                        }}
                    onKeyDown={(event)=>{
                        if(event.key=='Tab' ){
                            event.preventDefault();
                            const textArea = event.currentTarget;
                            textArea.setRangeText(
                            "\t",
                            textArea.selectionStart,
                            textArea.selectionEnd,
                            "end"
                            );
                        }
                    }}
                        >
                    </textarea>
                    <IconButton style={{position:'absolute',right:'15px',top:'10px'}} onClick={(_)=>console.log('asdf')} color='info'>
                            <PlayArrowIcon />
                    </IconButton>
            </div>
        
            </div>
    )
}