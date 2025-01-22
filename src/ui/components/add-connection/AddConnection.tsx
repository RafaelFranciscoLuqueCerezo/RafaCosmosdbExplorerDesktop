import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import { Page, useAppStore } from "../../store/ApplicationStore";



export default function AddConnectionPage(){

  const [loading,setLoading]= useState(false);
  const navigateTo = useAppStore((state)=>state.navigateTo);
  const addConnection = useAppStore((state)=>state.addConnection)
  

  let formData : AddConnectionType = {
    label:'',
    endpoint:'',
    secret:'',
    connectionType:''
  }

  const createConnection = useCallback((e:any)=>{
    e.preventDefault();
    window.electron.saveDbConfig(formData);
    addConnection(formData);
    navigateTo(Page.BLANK);
    //actualizar store
  },[]);


  useEffect(() => {
    setLoading(false);
    }, []);


  return (
    <div style={{width:'100vw',display:"flex", flexDirection:"column", alignItems:'center'}}>
      <div style={{display:"flex", flexDirection:"column", width:"300px", textWrap:"wrap"}}>
        <h2>Nueva conexion</h2>
        <p style={{fontSize:"small"}}>Configura la conexion con la base de datos. Rellena todos los campos necesarios y pulse el boton de crear para guardar la configuracion de conexion de la base de datos</p>
      </div>
      <form style={{display:'flex',width:'300px', flexDirection:'column', marginTop:'20px'}} onSubmit={createConnection}>
        <TextField required name="label" label="Etiqueta" variant="outlined" onChange={(e:any)=>{formData.label=e.target.value}}/>
        <TextField sx={{marginTop:'15px'}} required name="endpoint" label="Endpoint" variant="outlined" onChange={(e:any)=>{formData.endpoint=e.target.value}}/>
        <TextField sx={{marginTop: '15px'}} required name="secret" label="Secreto" variant="outlined" onChange={(e:any)=>{formData.secret=e.target.value}}/>
          <FormControl sx={{ minWidth: 180, marginTop:'15px' }}>
            <InputLabel id="demo-simple-select-label">Tipo de conexion</InputLabel>
            <Select
            labelId="demo-simple-select-label"
            name="connect-type"
            label="Tipo de conexion"
            onChange={(e:any)=>{formData.connectionType=e.target.value}}
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