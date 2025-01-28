import { useAppStore, Page, Store } from "../../store/ApplicationStore";
import AddConnection from "../add-connection/AddConnection";
import { ContainerOperation } from "./container-operation/ContainerOperation";

export default function OperationsPanel(){
  const url: Page = useAppStore((state:Store) => state.url);
  const connections: AddConnectionType[] = useAppStore((state:Store) => state.connections);
  const operations: Operation[] = useAppStore((state:Store) => state.operations);
  //cuando sera una operacion sobre un contenedor, actualizar state correspondiente y meter un nuevo componente donde corresponda

    return (
        <>
         {url === Page.ADD_CONNECTION && <AddConnection connections={connections}/> }
         {url === Page.OPERATION && operations.map((op:Operation)=><ContainerOperation operation={op}/>)  }
        </>
      )
}
