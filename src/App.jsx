
// Router 
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom' 
import { ProductsProvider } from './contexts/ProductsContext';
import { CountProvider } from './contexts/CountContext';
import { AuthProvider } from './contexts/AuthContext';
import './App.css'
import MainLayout from './layouts/MainLayout'
import Home from './pages/Home'
import Login from './components/Login/Login'

function App() {
  return (
    <Router>
      <AuthProvider>
        <CountProvider>  
          <ProductsProvider>
            <Routes>
              {/* Public route for login */}
              <Route path="/login" element={<Login />} />
              
              {/* Public route - anyone can view products */}
              <Route 
                path="/" 
                element={
                  <MainLayout>
                    <Home />
                  </MainLayout>
                } 
              />
            </Routes>
          </ProductsProvider>
        </CountProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
