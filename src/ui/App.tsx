import { useEffect } from 'react';
import './App.css'
import ConnectionInfo from './components/connection-info/ConnectionInfo'
import OperationsPanel from './components/operations-panel/OperationsPanel'
import { useAppStore } from './store/ApplicationStore';

function App() {

  const initConnections = useAppStore((state)=>state.initConnections);

  useEffect(()=>{

    const asyncFunction = async () => {
      await window.electron.readDbConnections((response)=>{
        initConnections(response);
      });
    };

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
