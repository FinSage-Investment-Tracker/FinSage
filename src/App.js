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
import MfList from './components/MfList'
import PortfolioLayout from './components/PortfolioLayout';
import { MFProvider } from './context/MfContext';
import FixedDepositList from './components/fixeddeposit/FixedDepositList';
import GoldList from './components/gold/GoldList';
import { FDProvider } from './context/FDContext';
import IpoList from './components/ipo/IpoList';


function App() {
  return (
    <>
    <PortfolioProvider>
    <StockProvider>
    <MFProvider>
    <FDProvider>
    <Router>
      <Navbar />
        <div className='container' >
          <Routes>
            <Route exact path="/" element={<Home/>} />
            <Route exact path="/login" element={<Login/> } />
            <Route exact path="/signup" element={<Signup/> } />
            <Route exact path="/portfoliolist" element={<PortfolioList/> } />
            <Route exact path="/ipo" element={<IpoList/> } />
            {/* nested tabs */}
            <Route path="/portfolio/:portfolioId" element={<PortfolioLayout />} >
            <Route path="stocks" element={<StockList />} />
            <Route path="mutualfunds" element={<MfList />} />
            <Route path="fixeddeposit" element={<FixedDepositList />} />
            <Route path="gold" element={<GoldList />} />
            </Route>
          </Routes>
        </div>
    </Router>
    </FDProvider>
    </MFProvider>
    </StockProvider>
    </PortfolioProvider>
    </>
  );
}

export default App;
