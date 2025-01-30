import { useRef, useState } from "react";
import { ContainerOperationPill } from "./ContainerOperationPill";
import { SqlSection } from "./sections/SqlSection";

type Props = {
    operations:Operation[]
  }
export const  ContainerOperationSection = ({operations}:Props)=>{
  
    const scrollRef = useRef(null);
    const [isDown, setIsDown] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [operation,setOperation] = useState<Operation>({dbLabel:'',container:'',type:'SQL'})
  
    const handleMouseDown = (e:any) => {
      setIsDown(true);
      if(scrollRef === null) {
        return;
      }
      //@ts-ignore
      setStartX(e.pageX - scrollRef.current.offsetLeft);
      //@ts-ignore
      setScrollLeft(scrollRef.current.scrollLeft);
    };
  
    const handleMouseLeave = () => {
      setIsDown(false);
    };
  
    const handleMouseUp = () => {
      setIsDown(false);
    };
  
    const handleMouseMove = (e:any) => {
      if (!isDown) return;
      e.preventDefault();
      if(scrollRef === null) {
        return;
      }
      //@ts-ignore
      const x = e.pageX - scrollRef.current.offsetLeft;
      const walk = (x - startX) * 3; // Ajusta la velocidad del desplazamiento
      //@ts-ignore
      scrollRef.current.scrollLeft = scrollLeft - walk;
    };
    
    return (
      <div style={{display:'flex',flexDirection:'column',paddingLeft:'10px'}}>
      <div style={{height:'8vh', display:'flex',overflowX:'hidden',whiteSpace:'noWrap',cursor:'grap',userSelect:'none'}}
      ref={scrollRef}
      onMouseDown={handleMouseDown}
      onMouseLeave={handleMouseLeave}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      >
        {operations.map((op:Operation)=><ContainerOperationPill changeOperation={(operation:Operation)=>setOperation(operation)} operation={op}/>)}
      </div>
      <div style={{height:'92vh',backgroundColor:'yellow'}}>
        {operation.type==='SQL' && <SqlSection operation={operation}/>}
        {operation.type==='DELETE' && <div>delete</div>}
        {operation.type==='IMPORT' && <div>import</div>}
      </div>
      </div>
    )
  }