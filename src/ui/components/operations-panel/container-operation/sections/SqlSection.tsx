
import { useEffect, useState } from 'react';
import './SqlSection.css';
import Grid from '@mui/material/Grid2';
import { CntOpMap } from '../../../../CntOpMap';

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
            backgroundColor:"red",
            height:'100%'
          }}>
            <Grid sx={{height:'40%',backgroundColor:'blue'}}>
                <textarea className='editor-sql' value={sql} 
                onChange={
                    (event)=>{
                        CntOpMap.addSql(operation,event.target.value)
                        setSql(event.target.value);
                    }}>
                
                </textarea>
            </Grid>
            <Grid sx={{height:'60%',backgroundColor:'gray'}}>
                {result}
            </Grid>
        </Grid>
    )
}