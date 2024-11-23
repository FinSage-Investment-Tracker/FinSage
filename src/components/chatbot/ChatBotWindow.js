import React, { useState, useEffect, useRef } from 'react';

function ChatBotWindow() {
  const initialQuestions = [
    {
      question: "What is meant by Fundamentals of a company?",
      answer: "Fundamental analysis components include price-to-earnings ratio (P/E ratio), return on equity (RoE), earnings per share (EPS), price-to-book ratio (P/B ratio), and Dividend Yield",
      details: [
        { question: "P/E ratio", answer: "The price-to-earnings (P/E) ratio is a measure of a company's current share price relative to its per-share earnings." },
        { question: "RoE", answer: "Return on equity (RoE) is a measure of financial performance that calculates the profitability of a business in relation to shareholders' equity." },
        { question: "EPS", answer: "Earnings per share (EPS) is the portion of a company's profit allocated to each outstanding share of common stock." },
        { question: "P/B ratio", answer: "The price-to-book (P/B) ratio compares a company's market value to its book value, reflecting the value investors are willing to pay for each dollar of net assets." },
        { question: "Dividend Yield", answer: "Dividend yield is the annual dividend paid by a company expressed as a percentage of its share price." }
      ]
    },
    {
      question: "Stock", answer: "Some FAQ's related to Stock",
      details: [
        { question: "What is a stocks capital gains report?", answer: "A stocks capital gains report shows your capital gains or losses for the financial year from all realized stock transactions." },
        { question: "Intraday", answer: "Sold on the same day" },
        { question: "Short Term", answer: "Sold within 1 year" },
        { question: "Long term", answer: "Sold on or after 1 year" },
        { question: "What is a stocks P&L (Profit and Loss) report?", answer: "The Stocks Profit and Loss report shows: Realised profit or loss for each completed trade within the selected date range." },
        { question: "What is a dividend report?", answer: "A dividend report shows the dividend amount per share, the ex-date, and the total amount you're eligible to receive within the selected date range." },
        { question: "What is a stocks transactions cum holdings statement?", answer: "A Stocks Transactions cum Holdings statement lists your demat transactions in stocks over a selected date range, along with the value of your holdings." },
        { question: "What are DP charges (depository participant charges)?", answer: "DP Charges (Depository Participant Charges) are compulsory for all sell transactions in your Demat account." }
      ]
    },
    {
      question: "IPO", answer: "Initial Public Offering (IPO) can be defined as the process in which a private company or corporation can become public by selling a portion of its stake to the investors.",
      details: [
        { question: "What is Pre-apply for an IPO?", answer: "Pre-applying for an IPO allows you to submit your application before the official subscription period begins." },
        { question: "When will I receive the application number for an IPO bid I pre-applied for?", answer: "You will receive an application number within a few hours of bid opening." },
        { question: "Can I apply for the same IPO on multiple platforms?", answer: "No, you cannot apply for the same IPO using the same PAN. Each IPO is restricted to one per PAN." },
        { question: "What is the maximum amount which I can invest in an IPO?", answer: "The maximum investment depends on your investor category." },
        { question: "Retail Individual Investor (Regular)", answer: "Maximum limit is 2 lakhs" },
        { question: "High Net-Worth Individual (HNI)", answer: "You can invest 2 lakh to 5 lakh." },
        { question: "How many bids can I place?", answer: "You can place up to 3 bids in an IPO, each with different price and quantity combinations." },
      ]
    },
    {
      question: "Get Fundamentals of a Company",
      answer: "Enter the company symbol to fetch its fundamentals.",
      askForSymbol: true
    }
  ];

  const [chatHistory, setChatHistory] = useState([]);
  const [currentOptions, setCurrentOptions] = useState(initialQuestions);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [companySymbol, setCompanySymbol] = useState('');
  // const [companyData, setCompanyData] = useState(null);
  // const [isAskingSymbol, setIsAskingSymbol] = useState(false);
  const [previousStates, setPreviousStates] = useState([]);
  const endOfChatRef = useRef(null);

  useEffect(() => {
    setChatHistory([{ type: 'bot', text: 'Hi! How can I help you today?' }]);
  }, []);

  useEffect(() => {
    if (endOfChatRef.current) {
      endOfChatRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory]);

  const handleOptionClick = (option) => {
    const newMessage = { type: 'user', text: option.question };
    const botReply = { type: 'bot', text: option.answer };

    setChatHistory((prev) => [...prev, newMessage, botReply]);

    if (option.details) {
      setPreviousStates((prev) => [...prev, { type: 'options', options: currentOptions }]);
      setSelectedQuestion(option);
      setCurrentOptions(option.details);
    } else if (option.askForSymbol) {
      setPreviousStates((prev) => [...prev, { type: 'options', options: currentOptions }]);
      setSelectedQuestion(option);
      setCurrentOptions([{ question: 'Enter Company Symbol', type: 'input' }]);
    } else {
      // For leaf-level questions, show only navigation buttons
      setPreviousStates((prev) => [...prev, { type: 'options', options: currentOptions }]);
      setCurrentOptions([]); // Clear the current options to hide buttons
      setSelectedQuestion(null); // Clear selected question if needed
    }
  };



  // Define API key
  const apiKey = process.env.REACT_APP_CHATBOT;

  const handleSymbolSubmit = async () => {
    if (companySymbol.trim()) {
      fetchCompanyData(companySymbol); // Call API to fetch company data
    } else {
      alert("Please enter a valid company symbol.");
    }
  };

  const fetchCompanyData = async (symbol) => {
    const url = `https://indian_stock_price_and_fundamentals.p.rapidapi.com/analyze/${symbol}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'x-rapidapi-key': apiKey, // Your RapidAPI key
          'x-rapidapi-host': 'indian_stock_price_and_fundamentals.p.rapidapi.com',
        },
      });

      const data = await response.json();

      console.log(data);

      console.log("API Response:", data); // Log API response

      if (data) {
        const name = symbol;
        const bsecode = data.Bse_Code || 'N/A';
        const revenue = data['2023-12-31']?.Quarterly_Results?.Revenue?.Value || 'N/A';
        const peRatio = data['2023-12-31']?.Ratios?.Adj_PE?.Value || 'N/A';
        const pegRatio = data['2023-12-31']?.Ratios?.Adj_PEG?.Value || 'N/A';
        const eps = data['2023-12-31']?.Ratios?.Adj_EPS?.Value || 'N/A';
        const ps = data['2023-12-31']?.Ratios?.PS?.Value || 'N/A';

        const companyInfo = `${name} :-
          BSE Code: ${bsecode}
          Revenue : ${revenue}
          P/E Ratio: ${peRatio}
          PEG Ratio: ${pegRatio}
          EPS: ${eps}
          P/S Ratio: ${ps}`.trim();

        setChatHistory((prev) => [
          ...prev,
          { type: 'user', text: `Company Symbol: ${symbol}` },
          { type: 'bot', text: companyInfo, isHTML: true },
        ]);

        // setCompanyData({
        //   name,
        //   bsecode,
        //   revenue,
        //   peRatio,
        //   pegRatio,
        //   eps,
        //   ps,
        // });

        // setIsAskingSymbol(false);
      } else {
        alert("No data found for the given symbol.");
      }
    } catch (error) {
      console.error("Error fetching company data:", error);
      alert("Failed to fetch data. Please try again.");
    }
  };



  const handleInputChange = (event) => {
    setCompanySymbol(event.target.value);
  };

  const handleBack = () => {
    if (previousStates.length > 0) {
      const lastState = previousStates.pop();
      setPreviousStates([...previousStates]);
      setCurrentOptions(lastState.options || initialQuestions);
      setSelectedQuestion(null);
      setCompanySymbol('');
      // setCompanyData(null);
    }
  };

  const handleBackToMainMenu = () => {

    setCurrentOptions(initialQuestions);
    setSelectedQuestion(null);
    setPreviousStates([]);
    setCompanySymbol('');
    // setCompanyData(null);
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '80px',
        right: '20px',
        width: '350px',
        height: '500px',
        backgroundColor: 'white',
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.3)',
        borderRadius: '10px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          flex: 1,
          padding: '10px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {chatHistory.map((msg, index) => (
          <div
            key={index}
            style={{
              textAlign: msg.type === 'user' ? 'right' : 'left',
              marginBottom: '10px',
            }}
          >
            <p
              style={{
                display: 'inline-block',
                padding: '10px',
                borderRadius: '10px',
                backgroundColor: msg.type === 'user' ? '#0078D7' : '#f0f0f0',
                color: msg.type === 'user' ? 'white' : 'black',
                maxWidth: '80%',
                whiteSpace: 'pre-wrap',
                textAlign: 'left',
                margin: 0,
              }}
            >
              {msg.type === 'bot' && (
                <strong
                  style={{
                    display: 'block',
                    marginBottom: '5px',
                    fontWeight: 'bold',
                  }}
                >
                  BOT:
                </strong>
              )}
              {msg.text}
            </p>
          </div>
        ))}

        <div ref={endOfChatRef} />
      </div>

      <div
        style={{
          borderTop: '1px solid #ccc',
          padding: '10px',
        }}
      >
        <div
          style={{
            maxHeight: '250px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          {currentOptions.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionClick(option)}
              style={{
                display: 'block',
                width: '100%',
                padding: '10px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
            >
              {option.question}
            </button>
          ))}

          {selectedQuestion?.askForSymbol && (
            <div>
              <input
                type="text"
                value={companySymbol}
                onChange={handleInputChange}
                placeholder="Enter Company Symbol"
                style={{
                  padding: '10px',
                  borderRadius: '5px',
                  marginBottom: '10px',
                  width: '100%',
                  border: '1px solid #ccc',
                }}
              />
              <button
                onClick={handleSymbolSubmit}
                style={{
                  padding: '10px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                }}
              >
                Get Fundamentals
              </button>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
          {previousStates.length > 0 && (
            <button
              onClick={handleBack}
              style={{
                flex: 1,
                marginRight: '5px',
                padding: '10px',
                backgroundColor: 'rgb(114 106 191)',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
            >
              Back
            </button>
          )}
          <button
            onClick={handleBackToMainMenu}
            style={{
              flex: 1,
              marginLeft: previousStates.length > 0 ? '5px' : '0',
              padding: '10px',
              backgroundColor: 'rgb(114 106 191)',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Back to Main Menu
          </button>
        </div>
      </div>
    </div>
  );

}
export default ChatBotWindow;