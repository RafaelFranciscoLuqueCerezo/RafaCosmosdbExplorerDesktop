
import { useEffect, useState } from 'react';
import './SqlSection.css';
import Grid from '@mui/material/Grid2';
import { CntOpMap } from '../../../../CntOpMap';
import { Box } from '@mui/material';

type Props = {
    operation:Operation
}
export const SqlSection = ({operation}:Props)=>{

    const [sql,setSql] = useState("");
    const [result,setResult] = useState("");

    useEffect(()=>{
        //TODO recuperar del mapa global tanto el resultado como el text area
        CntOpMap.innitVariables(operation);
        setSql(CntOpMap.getSql(operation));
        setResult(CntOpMap.getResult(operation));
        console.log(sql);
    },[operation])

    return (
        <Grid container direction="column" sx={{
            justifyContent: "flex-start",
            alignItems: "stretch",
            height:'100%'
          }}>
            <Grid sx={{height:'30%',display:'flex',justifyContent:'stretch',padding:'5px 5px 5px 0'}}>
                <textarea spellCheck='false' className='editor-sql' value={sql} 
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
            </Grid>
            <Grid sx={{height:'67.5%',display:'flex',justifyContent:'stretch',padding:'5px 5px 5px 0'}}>
                <div className='result-sql'>
                    <div>Result:{result}</div>
                    <div>Result:{result}</div>
                    <div>Result:{result}</div>
                    <div>Result:{result}</div>
                    <div>Result:{result}</div>
                    <div>Result:{result}</div>
                    <div>Result:{result}</div>
                    <div>Result:{result}</div>
                    <div>Result:{result}</div>
                    <div>Result:{result}</div>
                    <div>Result:{result}</div>
                    <div>Result:{result}</div>
                    <div>Result:{result}</div>
                    <div>Result:{result}</div>
                    <div>Result:{result}</div>
                    <div>Result:{result}</div>
                    <div>Result:{result}</div>
                    <div>Result:{result}</div>
                    <div>Result:{result}</div>
                    <div>Result:{result}</div>
                    <div>Result:{result}</div>
                    <div>Result:{result}</div>
                    <div>Result:{result}</div>
                    <div>Result:{result}</div>
                    <div>Result:{result}</div>
                    <div>Result:{result}</div>
                    <div>Result:{result}</div>
                    <div>Result:{result}</div>
                    <div>Result:{result}</div>
                    <div>Result:{result}</div>
                    <div>Result:{result}</div>
                    <div>Result:{result}</div>
                    <div>Result:{result}</div>
                    <div>Result:{result}</div>
                    <div>Result:{result}</div>
                    <div>Result:{result}</div>
                    <div>Result:{result}</div>
                    <div>Result:{result}</div>
                    <div>Result:{result}</div>
                    <div>Result:{result}</div>
                    <div>Result:{result}</div>
                    <div>Result:{result}</div>
                    <div>Result:{result}</div>
                    <div>Result:{result}</div>
                    <div>Result:{result}</div>
                    <div>Result:{result}</div>
                    <div>Result:{result}</div>
                    <div>Result:{result}</div>
                    <div>Result:{result}</div>
                    <div>Result:{result}</div>
                    <div>Result:{result}</div>
                    <div>Result:{result}</div>
                    <div>Result:{result}</div>
                    <div>Result:{result}</div>
                </div>
                <input className='search' type='search'/>
                
            </Grid>
        </Grid>
    )
}