import { useCallback, useEffect, useState } from "react";
import IconButton from '@mui/material/IconButton';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { CntOpMap } from "../../../../CntOpMap";
import './ImportSection.css';

type Props = {
    operation:Operation
}

export const ImportSection = ({operation}:Props)=>{
    const [importContent,setImportContent] = useState<string>('');

    const handleInputChange = useCallback((value:string) => {
        try {
            const parsedJson = JSON.parse(value);
            const formattedJson = JSON.stringify(parsedJson, null, 3);
            setImportContent(formattedJson);
        } catch (error) {
            setImportContent(value);
        }
    },[]);

    useEffect(()=>{
        //TODO recuperar del mapa global tanto el resultado como el text area
        CntOpMap.innitVariables(operation);
        setImportContent(CntOpMap.getImport(operation));
    },[operation])

    return (
        <div style={{display:"flex",flexDirection:"column",justifyContent:'flex-start',alignItems:'stretch',height:'100%'}}>
            <div style={{height:'100%',display:'flex',justifyContent:'stretch',padding:'5px 5px 5px 0',position:'relative'}}>
                <textarea  style={{paddingLeft:'40px'}} spellCheck='false' className='import-area' value={importContent}
                    onChange={
                        (event)=>{
                            CntOpMap.addImport(operation,event.target.value)
                            handleInputChange(event.target.value);
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
                    <IconButton className="no-outline" style={{position:'absolute',left:'0',top:'10px'}} onClick={(_)=>window.electron.importDocument({op:operation,content:importContent})} color='info'>
                            <PlayArrowIcon />
                    </IconButton>
            </div>
        
            </div>
    )
}