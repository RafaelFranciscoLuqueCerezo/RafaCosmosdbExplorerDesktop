
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
import JSONPretty from 'react-json-pretty';

type Props = {
    operation:Operation
}

function searchThroughResult(result:any[],text:string):any[]{
    if(result.length==0){
        return [];
    }
    let matchedResult:any[] = [];
    result.forEach((element:any)=>{
        recursiveSearch(element,matchedResult,text);
    })
    return matchedResult;

}

function recursiveSearch(element:any,matchedResult:any[],text:string):void{
    for(let key in element){
        let value:any = element[key];
        //todo este intanceOf no funciona
        if( !(value instanceof Object)){
            if(String(value).includes(text)){
                matchedResult.push(element);
                return;
            }
            continue;
            
        }
        recursiveSearch(value,matchedResult,text)
        
    }
}


export const SqlSection = ({operation}:Props)=>{

    const [sql,setSql] = useState("");
    const [result,setResult] = useState<any[]>([]);
    const [count,setCount] = useState(0);
    const [highlightResult,setHighlightedResult] = useState<any[] | undefined>(undefined);
    const textAreaRef = useRef<any>(null);
    const jsonRef = useRef<any>(null);

    useEffect(()=>{
        CntOpMap.innitVariables(operation);
        setSql(CntOpMap.getSql(operation));
        setResult(CntOpMap.getResult(operation));
        setCount(CntOpMap.getCount(operation));
        const resultUnSub : UnSubFunction = window.electron.subscribeQueryResult((response:any[])=>{
            CntOpMap.addResult(operation,response);
            setResult(response);
        });
        const countUnSub : UnSubFunction = window.electron.subscribeQueryCount((response:number)=>{
            CntOpMap.addCount(operation,response);
            setCount(response);
        })
        return ()=>{
            resultUnSub();
            countUnSub();
        };

        
    },[operation]);


    const playQuery = useCallback(()=>{
        if(textAreaRef.current==null){
            return;
        }
        console.log(textAreaRef);
        const sqlQuery = textAreaRef.current.value.substring(textAreaRef.current.selectionStart, textAreaRef.current.selectionEnd);
        window.electron.launchQuery({op:operation,sentence:sqlQuery});
    
    },[operation])


    const search = useCallback((text:string)=>{
        if(text==''){
            setHighlightedResult(undefined);
        }
        const matched:any[] = searchThroughResult(result,text);
        setHighlightedResult(matched);

    },[result])


    const getResult = useCallback(()=>{
        console.log(highlightResult);
        const temp =   (highlightResult!=undefined && highlightResult.length == 0 ) ? result : highlightResult;
        console.log(temp);
        return temp;
    },[result,highlightResult])




    


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
                    <input type='search' placeholder='buscar...' onChange={(event:any)=>search(event.target.value)}/>
                    </div>
                    <JSONPretty ref={jsonRef} style={{width:'500px', overflowX:'hidden'}} id='result-sql-json' data={getResult()} keyStyle='color:#fc7d7d;font-weight:bold' stringStyle='color:#7d83fc' booleanStyle='color:#f95b9a;font-weight:bold' />
                </div>
                
                
            </Grid>
        </Grid>
    )
}