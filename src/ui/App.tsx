import './App.css'
import ConnectionInfo from './components/connection-info/ConnectionInfo'
import OperationsPanel from './components/operations-panel/OperationsPanel'
import Divider from '@mui/material/Divider';

function App() {

  return (
    <div id='mainContainer'>
      <ConnectionInfo/>
      <OperationsPanel/>
  
    </div>
  )
}

export default App
