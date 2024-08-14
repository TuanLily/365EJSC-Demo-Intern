
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import './App.css';

import List from './Pages/Students/List';
import Create from './Pages/Students/Create';
import Edit from './Pages/Students/Edit';
import Dashboard from './Pages/Students/Dashboard';
import Login from './Pages/Login/Login';
import DefaultLayout from './Layouts/Layouts/DefaultLayout/DefaultLayout';

const isAuthenticated = () => {
  return !!localStorage.getItem('accessToken');
};

function App() {
  return (
    <div className="App">
      <Routes>
      <Route path="/login" element={<Login />} />
            <Route
                element={
                    isAuthenticated() ? (
                        <DefaultLayout />
                    ) : (
                        <Navigate to="/login" replace />
                    )
                }
            >
                <Route path="/" element={<Dashboard />} />
                <Route path="/student/list" element={<List />} />
                <Route path="/student/create" element={<Create />} />
                <Route path="/student/edit/:id" element={<Edit />} />
            </Route>
        </Routes>
    </div>
  );
}

export default App;
