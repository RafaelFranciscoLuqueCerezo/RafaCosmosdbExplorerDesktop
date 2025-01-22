import { useEffect } from 'react';
import './App.css'
import ConnectionInfo from './components/connection-info/ConnectionInfo'
import OperationsPanel from './components/operations-panel/OperationsPanel'
import { useAppStore } from './store/ApplicationStore';

function App() {

  const initConnections = useAppStore((state)=>state.initConnections);

  useEffect(()=>{

    const asyncFunction = async () => {
      window.electron.readDbConnections().then((result)=>initConnections(result));
    }

    asyncFunction();

  },[])

  return (
    <div id='mainContainer'>
      <ConnectionInfo/>
      <OperationsPanel/>
    </div>
  )
}

export default App
