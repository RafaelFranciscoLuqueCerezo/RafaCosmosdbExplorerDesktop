import { useAppStore, Page, Store } from "../../store/ApplicationStore";
import AddConnection from "../add-connection/AddConnection";

export default function OperationsPanel(){
  const url: Page = useAppStore((state:Store) => state.url);
  const connections: AddConnectionType[] = useAppStore((state:Store) => state.connections);

    return (
        <>
         {url === Page.ADD_CONNECTION && <AddConnection connections={connections}/> }
        </>
      )
}
