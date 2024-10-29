import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar';
import Home from './components/Home';
import PortfolioList from './components/PortfolioList';
import { PortfolioProvider } from './context/PortfolioContext';
import Login from './components/Login';
import Signup from './components/Signup';
import StockList from './components/StockList';
import { StockProvider } from './context/StockContext';

function App() {
  return (
    <>
    <PortfolioProvider>
    <StockProvider>
    <Router>
      <Navbar />
        <div className='container' >
          <Routes>
            <Route exact path="/" element={<Home/>} />
            <Route exact path="/portfoliolist" element={<PortfolioList/> } />
            <Route exact path="/login" element={<Login/> } />
            <Route exact path="/signup" element={<Signup/> } />
            <Route path="/portfolio/:portfolioId/stocks" element={<StockList />} />
          </Routes>
        </div>
    </Router>
    </StockProvider>
    </PortfolioProvider>
    </>
  );
}

export default App;
