import './styles.css';
import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import { Page, useAppStore } from "../../store/ApplicationStore";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';


const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

type Props = {
  connections:AddConnectionType[];
}


export default function AddConnectionPage({connections}:Props){

  const [loading,setLoading]= useState(false);
  const [fileName,setFileName] = useState("");
  const [label,setLabel]=useState("");
  const [dbName,setDbName]=useState("");
  const [endpoint,setEndpoint]=useState("");
  const [secret,setSecret]=useState("");
  const [connectionType,setConnectionType]=useState("");
  const [certFile,setCertFile]=useState("");

  const navigateTo = useAppStore((state)=>state.navigateTo);
  const addConnection = useAppStore((state)=>state.addConnection)


  const createConnection = useCallback(async(e:any,config:AddConnectionType)=>{
    e.preventDefault();
    if(config.certFile===""){
      alert('por favor introduzca un fichero de certificacion para la conexion con la base de datos');
      return;
    }
    if(connections.find((element:AddConnectionType)=>element.label===config.label)){
      alert(`Ya existe ese label (${config.label}), por favor escriba un nombre de label distinto`);
      setLabel("");
      return;
    }
  
    await window.electron.saveDbConfig(config);
    addConnection(config);
    setLoading(false);
    navigateTo(Page.BLANK);
    //actualizar store
  },[])


  useEffect(() => {
    setLoading(false);
    }, []);


  return (
    <div className="addConectionContainer" style={{display:"flex", flexDirection:"column", alignItems:'center'}}>
      <div style={{display:"flex", flexDirection:"column", width:"300px", textWrap:"wrap"}}>
        <h2>Nueva conexion</h2>
        <p style={{fontSize:"small"}}>Configura la conexion con la base de datos. Rellena todos los campos necesarios y pulse el boton de crear para guardar la configuracion de conexion de la base de datos</p>
      </div>
      <form style={{display:'flex',width:'300px', flexDirection:'column', marginTop:'20px'}} onSubmit={
        (e:any)=>{
        createConnection(
          e,
          {
              label,
              dbName,
              endpoint,
              secret,
              connectionType,
              certFile
        })
      }}>
        <div className='certFileContainer' style={{width:'100%',display:'flex',flexDirection:'column'}}>
          <TextField
            id="file-cert"
            label="Certificado conexion"
            focused
            required
            value={fileName}
            slotProps={{
              input: {
                readOnly: true,
              },
            }}
            />
          <Button
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={0}
            startIcon={<CloudUploadIcon />}
          >
            Upload files
            <VisuallyHiddenInput
              type="file"
              onChange={(event:any) => {
                console.log(event.target.files[0].name);
                setFileName(event.target.files[0].name);
                setCertFile(event.target.files[0]);
              }}
              multiple
            />
          </Button>
        </div>
        <TextField sx={{marginTop:'15px'}} value={label} required name="label" label="Etiqueta" variant="outlined" onChange={(e:any)=>setLabel(e.target.value)}/>
        <TextField sx={{marginTop:'15px'}} value={endpoint} required name="endpoint" label="Endpoint" variant="outlined" onChange={(e:any)=>setEndpoint(e.target.value)}/>
        <TextField sx={{marginTop: '15px'}} value={secret} required name="secret" label="Secreto" variant="outlined" onChange={(e:any)=>setSecret(e.target.value)}/>
        <TextField sx={{marginTop: '15px'}} value={dbName} required name="name" label="Nombre base de datos" variant="outlined" onChange={(e:any)=>setDbName(e.target.value)}/>
          <FormControl sx={{ minWidth: 180, marginTop:'15px' }}>
            <InputLabel id="demo-simple-select-label">Tipo de conexion</InputLabel>
            <Select
            labelId="demo-simple-select-label"
            name="connect-type"
            label="Tipo de conexion"
            value={connectionType}
            onChange={(e:any)=>setConnectionType(e.target.value)}
            >
            <MenuItem value={10}>Gateway</MenuItem>
            </Select>
          </FormControl>
          <Button type="submit" sx={{marginTop:'25px'}} loading={loading} loadingPosition="start" variant="contained" startIcon={<AddIcon />}>
            Crear conexion
          </Button>
        </form>
    </div>
  )

}