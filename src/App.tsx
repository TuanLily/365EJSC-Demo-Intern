
import { Route, Routes } from 'react-router-dom';
import './App.css';
import Footer from './Layouts/Footer';
import Header from './Layouts/Header';
import List from './Pages/Students/List';
import Create from './Pages/Students/Create';
import Edit from './Pages/Students/Edit';
import Dashboard from './Pages/Students/Dashboard';

function App() {
  return (
    <div className="App">
      <div className='wrapper'>
        <Header />

        <div className='container'>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/student/list" element={<List />} />
            <Route path="/student/create" element={<Create />} />
            <Route path="/student/edit/:id" element={<Edit />} />
          </Routes>
        </div>

        <Footer />

      </div>

    </div>
  );
}

export default App;
