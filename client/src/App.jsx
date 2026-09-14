import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import CreateShipmentPage from './pages/CreateShipmentPage';
import UpdateShipmentPage from './pages/UpdateShipmentPage';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

function DashboardLayout({ children }) {
  return (
    <div className="dashboard">
      <Navbar />
      <main className="dashboard-main">
        {children}
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/create-shipment"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <CreateShipmentPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/update-shipment"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <UpdateShipmentPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
