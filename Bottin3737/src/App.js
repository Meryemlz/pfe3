import './App.css';
import RegisterAdmin from './Auth/RegisterAdmin';
import Register from './Auth/Register';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import HomePage from './Pages/HomePage';
import React, { useContext } from 'react';
import { AuthContext } from './Context/AuthContext';
import { Box } from '@mui/material';
import LoginAdmin from './Auth/LoginAdmin';
import Marketing from './Pages/TypesPages/Marketing';
import Arts from './Pages/TypesPages/Arts';
import Manufacturing from './Pages/TypesPages/Manufacturing';
import Commerce from './Pages/TypesPages/Commerce';
import EnterpriseDetails from './Pages/EnterpriseDetails';
import EnterpriseProfile from './Pages/EnterpriseProfile';
import EnterprisesList from './Pages/AdminDashboard/EnterprisesList';
import ActiveCompanies from './Pages/AdminDashboard/ActiveCompanies';
import InactiveCompanies from './Pages/AdminDashboard/InactiveCompanies';
import Admins from './Pages/AdminDashboard/Admins';
import Complaints from './Pages/AdminDashboard/Complaints';
function App() {
  const RequireAuth = ({ children }) => {
    return currentUser ? children : <Navigate to="/login" />;
  };

  const { currentUser, dispatch } = useContext(AuthContext);
  return (
    <Box width={'100%'} style={{}}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* Admin routes  */}
          <Route path="/register" element={<RegisterAdmin />} />
          <Route path="/login" element={<LoginAdmin />} />

          {/* User routes  */}
          <Route path="/register" element={<Register />} />

          <Route path="/marketing/:name?/:address?" element={<Marketing />} />
          <Route path="/arts/:name?/:address?" element={<Arts />} />
          <Route path="/manufacturing/:name?/:address?" element={<Manufacturing />} />
          <Route path="/commerce/:name?/:address?" element={<Commerce />} />
          <Route path="/enterprise-details/:uid" element={<EnterpriseDetails />} />
          <Route
            path="/enterprise-profile"
            element={
              <RequireAuth>
                <EnterpriseProfile />
              </RequireAuth>
            }
          />
          {/* EnterprisesList */}
          <Route
            path="/enterprises-list"
            element={
              <RequireAuth>
                <EnterprisesList />
              </RequireAuth>
            }
          />
          {/* Active EnterprisesList */}
          <Route
            path="/active-enterprises"
            element={
              <RequireAuth>
                <ActiveCompanies />
              </RequireAuth>
            }
          />
          {/* inactive EnterprisesList */}
          <Route
            path="/inactive-enterprises"
            element={
              <RequireAuth>
                <InactiveCompanies />
              </RequireAuth>
            }
          />
          {/* Admins list */}
          <Route
            path="/admins-list"
            element={
              <RequireAuth>
                <Admins />
              </RequireAuth>
            }
          />
          <Route
            path="/complaints-list"
            element={
              <RequireAuth>
                <Complaints />
              </RequireAuth>
            }
          />
        </Routes>
      </BrowserRouter>
    </Box>
  );
}

export default App;
