import { useAppStore, Page, Store } from "../../store/ApplicationStore";
import AddConnection from "../add-connection/AddConnection";
import './OperationsPanel.css'
import { ContainerOperationSection } from "./container-operation/ContainerOperationSection";

export default function OperationsPanel(){
  const url: Page = useAppStore((state:Store) => state.url);
  const connections: AddConnectionType[] = useAppStore((state:Store) => state.connections);
  const operations: Operation[] = useAppStore((state:Store) => state.operations);
  //cuando sera una operacion sobre un contenedor, actualizar state correspondiente y meter un nuevo componente donde corresponda

    return (
        <div id="operationPanelContainer">
         {url === Page.ADD_CONNECTION && <AddConnection connections={connections}/> }
         {url === Page.OPERATION &&  <ContainerOperationSection operations={operations}/> }
        </div>
      )
}


