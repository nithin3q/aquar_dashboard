import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import Dashboard from './components/Dashboard/Dashboard';
import Users from './components/Dashboard/Users';
import Connections from './components/Dashboard/Connections';
import Sidebar from './components/Layout/Sidebar';
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from './theme';
import Topbar from './components/Layout/Topbar';
import ProtectedRoute from './components/Auth/ProtectedRoute';

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
    setLoading(false); // Set loading to false once we've checked auth
  }, []);

  if (loading) return null; // Optionally render a loading spinner here

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <div className="app">
            <Routes>
              <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
              <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
                <Route 
                  path="/*" 
                  element={
                    <>
                      <Sidebar isSidebar={isSidebar} />
                      <main className="content">
                        <Topbar setIsSidebar={setIsSidebar} />
                        <Routes>
                          <Route path="/dashboard/*" element={<Dashboard />} />
                          <Route path="/users" element={<Users />} />
                          <Route path="/connections" element={<Connections />} />
                        </Routes>
                      </main>
                    </>
                  } 
                />
              </Route>
              <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
          </div>
        </Router>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
