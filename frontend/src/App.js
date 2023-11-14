import { Route , Routes } from 'react-router-dom';
import Notes from './components/Notes';
import Index from './components/Index';

const App = ()=>
{
  return(<div className='App'>
    <Routes>
        <Route exact path='/Notes' element={<Notes />} />
        <Route path='/' element={<Index />} />
    </Routes>
  </div>)
}

export default App;
