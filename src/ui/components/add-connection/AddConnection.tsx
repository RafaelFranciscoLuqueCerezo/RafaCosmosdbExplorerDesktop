import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import React, { DetailedHTMLProps, FormEventHandler, FormHTMLAttributes, useCallback, useEffect, useState } from "react";
import AddIcon from '@mui/icons-material/Add';

interface AddFormData {
  label:string,
  endpoint:string,
  secret:string,
  connectionType:string
}

export default function AddConnectionPage(){

  const [loading,setLoading]= useState(false);

  let formData : AddFormData = {
    label:'',
    endpoint:'',
    secret:'',
    connectionType:''
  }

  const createConnection = useCallback((e:any)=>{
    e.preventDefault();
    //TODO recopilar informacion y guardar configuracion conexion db , ponerla en el listado de db
  },[]);


  useEffect(() => {
    }, []);


  return (
    <div style={{padding:'0px 30px 8px 30px' }}>
      <h2>Formulario creacion conexion a base de datos</h2>
      <form style={{display:'flex', flexDirection:'column'}} onSubmit={createConnection}>
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