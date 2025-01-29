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
  return (
    <div style={{display:'flex',flexDirection:'column',backgroundColor:'blue',width:'100%'}}>
    <div style={{paddingLeft:'10px', display:'flex', backgroundColor:'red',width:'100%'}}>
      {operations.map((op:Operation)=><ContainerOperation operation={op}/>)}
      
    </div>
    <div style={{height:'auto',backgroundColor:'yellow'}}>
      asdlkfjasl;jdf
    </div>
    </div>
  )
}
