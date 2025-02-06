
import { useCallback, useEffect, useRef, useState } from 'react';
import './SqlSection.css';
import Grid from '@mui/material/Grid2';
import { CntOpMap } from '../../../../CntOpMap';
import SearchIcon from '@mui/icons-material/Search';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import Chip from '@mui/material/Chip';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import IconButton from '@mui/material/IconButton';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';

type Props = {
    operation:Operation
}
export const SqlSection = ({operation}:Props)=>{

    const [sql,setSql] = useState("");
    const [result,setResult] = useState("");
    const [count,setCount] = useState(0);
    const textAreaRef = useRef<any>(null);
    const playQuery = useCallback(()=>{
        if(textAreaRef.current==null){
            return;
        }
        console.log(textAreaRef);
        const sqlQuery = textAreaRef.current.value.substring(textAreaRef.current.selectionStart, textAreaRef.current.selectionEnd);
        window.electron.launchQuery({op:operation,sentence:sqlQuery});
    
    },[])

    useEffect(()=>{
        //TODO recuperar del mapa global tanto el resultado como el text area
        CntOpMap.innitVariables(operation);
        setSql(CntOpMap.getSql(operation));
        setResult(CntOpMap.getResult(operation));

        const asyncFunction = async () => {
            window.electron.subscribeQueryResult((result:any[])=>{
                const resultString : string = JSON.stringify(result);
                CntOpMap.addResult(operation,resultString);
                setResult(resultString);
            });
            window.electron.subscribeQueryCount((result:number)=>{
                setCount(result);
            })
          }
        asyncFunction();

    },[operation]);


    return (
        <Grid container direction="column" sx={{
            justifyContent: "flex-start",
            alignItems: "stretch",
            height:'100%'
          }}>
            <Grid sx={{height:'30%',display:'flex',justifyContent:'stretch',padding:'5px 5px 5px 0',position:'relative'}}>
                <textarea ref={textAreaRef} spellCheck='false' className='editor-sql' value={sql} 
                onChange={
                    (event)=>{
                        CntOpMap.addSql(operation,event.target.value)
                        setSql(event.target.value);
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
                <IconButton style={{position:'absolute',right:'15px',top:'10px'}} onClick={playQuery} color='info'>
                    <PlayArrowIcon />
                </IconButton>
            </Grid>
            <Grid sx={{height:'67.5%',display:'flex',justifyContent:'stretch',padding:'5px 5px 5px 0'}}>
                <div className='result-sql'>
                    <div className='search'>
                    <SearchIcon style={{position:'absolute',top:'0',left:'10px'}}/>
                    <Chip style={{position:'absolute', top: '40px', right:'75px'}} icon={<TravelExploreIcon color='info' />} label={count} />
                    <IconButton style={{position:'absolute',top: '35px', right:'35px'}} onClick={(_)=>console.log('asdf')} color='info'>
                        <OpenInNewIcon />
                    </IconButton>
                    <IconButton style={{position:'absolute',top: '35px', right:'0'}} onClick={(_)=>console.log('asdf')} color='error'>
                        <DeleteRoundedIcon />
                    </IconButton>
                    <input type='search' placeholder='buscar...'/>
                    </div>
                    <div>Result:{result}</div>
                </div>
                
                
            </Grid>
        </Grid>
    )
}