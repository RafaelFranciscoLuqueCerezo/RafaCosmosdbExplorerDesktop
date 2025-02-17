import { useEffect, useState } from "react";

export const Popup = () => {
    const [props,setProps] = useState<PopUpProps>({type:'ko',message:''})

    useEffect(()=>{
        const popupUnSub : UnSubFunction = window.electron.subscribePopup((response:PopUpProps)=>{
            setProps(response);
        });

    },[])
    
    return (
        <div style={{display:props.type == 'no' ? 'none' : 'flex',position:'absolute',width:'100vw',height:'100vh',justifyContent:'center',alignItems:'center'}}>
            <div style={{backgroundColor:'white',boxShadow: '2px 2px 4px 0px rgba(66, 68, 90, 1)',padding:'5px',borderRadius:'10px'}}>
                <h2>Titulo del popup</h2>
                <div style={{width:'100%',height:'2px',backgroundColor:'red'}}/>
                <div>
                    contenido contenido contenido ajsd lfjalsdj fl;jkajsh fljkh asjkldh fjklahs jkldfh jklash dfljkh ajklsdhf jklah sdj
                </div>
            </div>

        </div>
    
        
        
    )
}