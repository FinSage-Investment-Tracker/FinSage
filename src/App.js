import './App.css';
import React, {useState} from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar';
import Home from './components/Home';
import PortfolioList from './components/PortfolioList';
import Login from './components/Login';
import Signup from './components/Signup';
import StockList from './components/StockList';
import MfList from './components/MfList'
import PortfolioLayout from './components/PortfolioLayout';
import FixedDepositList from './components/fixeddeposit/FixedDepositList';
import GoldList from './components/gold/GoldList';
import IpoList from './components/ipo/IpoList';
import News from './components/News';
import GlobalProvider from './context/GlobalProvider';
import SipList from './components/sip/SipList';
import ChatBotIcon from './components/chatbot/ChatBotIcon';
import ChatBotWindow from './components/chatbot/ChatBotWindow';
import SipCalculator from './components/calculators/SIPCalculator';
import SwpCalculator from './components/calculators/SwpCalculator';
import LumpsumCalculator from './components/calculators/LumpsumCalculator';


function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Function to toggle the chat window
  const toggleChat = () => setIsChatOpen(!isChatOpen);
  return (
    <>
    <GlobalProvider>
    <Router>
      <Navbar />
        <div className='container' >
          <Routes>
            <Route exact path="/" element={<Home/>} />
            <Route exact path="/login" element={<Login/> } />
            <Route exact path="/signup" element={<Signup/> } />
            <Route exact path="/portfoliolist" element={<PortfolioList/> } />
            <Route exact path="/ipo" element={<IpoList/> } />
            <Route exact path="/news" element={<News/> } />
            <Route exact path="/sipcalculator" element={<SipCalculator/> } />
            <Route exact path="/lumpsumcalculator" element={<LumpsumCalculator/> } />
            <Route exact path="/swpcalculator" element={<SwpCalculator/> } />
            {/* nested tabs */}
            <Route path="/portfolio/:portfolioId" element={<PortfolioLayout />} >
            <Route path="stocks" element={<StockList />} />
            <Route path="mutualfunds" element={<MfList />} />
            <Route path="fixeddeposit" element={<FixedDepositList />} />
            <Route path="sip" element={<SipList />} />
            <Route path="gold" element={<GoldList />} />
            </Route>
          </Routes>
        <ChatBotIcon onClick={toggleChat} />
        {isChatOpen && <ChatBotWindow />}
        </div>
    </Router>
    </GlobalProvider>
    </>
  );
}

export default App;
