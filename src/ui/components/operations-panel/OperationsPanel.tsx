import { useRef, useState } from "react";
import { useAppStore, Page, Store } from "../../store/ApplicationStore";
import AddConnection from "../add-connection/AddConnection";
import { ContainerOperation } from "./container-operation/ContainerOperation";
import './OperationsPanel.css'

export default function OperationsPanel(){
  const url: Page = useAppStore((state:Store) => state.url);
  const connections: AddConnectionType[] = useAppStore((state:Store) => state.connections);
  const operations: Operation[] = useAppStore((state:Store) => state.operations);
  //cuando sera una operacion sobre un contenedor, actualizar state correspondiente y meter un nuevo componente donde corresponda

    return (
        <div id="operationPanelContainer">
         {url === Page.ADD_CONNECTION && <AddConnection connections={connections}/> }
         {url === Page.OPERATION &&  <ContainerOperationPanel operations={operations}/> }
        </div>
      )
}

type Props = {
  operations:Operation[]
}
function ContainerOperationPanel({operations}:Props){

  const scrollRef = useRef(null);
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

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
      {operations.map((op:Operation)=><ContainerOperation operation={op}/>)}
    </div>
    <div style={{height:'92vh',backgroundColor:'yellow'}}>
      asdlkfjasl;jdf
    </div>
    </div>
  )
}
