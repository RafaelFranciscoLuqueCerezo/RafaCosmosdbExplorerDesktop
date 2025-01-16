import { ApplicationStore, Page, Store } from "../../store/ApplicationStore";
import AddConnection from "../add-connection/AddConnection";

export default function OperationsPanel(){
  const url: Page = ApplicationStore((state:Store) => state.url);

    return (
        <>
         {url === Page.ADD_CONNECTION && <AddConnection/> }
        </>
      )
}
