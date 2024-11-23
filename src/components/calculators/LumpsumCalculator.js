import React, { useState } from 'react';
import { Slider, Typography,  TextField } from '@mui/material';
import { PieChart, Pie, Cell, Legend } from 'recharts';

const LumpsumCalculator = () => {
  const [investment, setInvestment] = useState(25000);
  const [rateOfReturn, setRateOfReturn] = useState(12);
  const [timePeriod, setTimePeriod] = useState(10);

  // Calculate future value
  const futureValue = Math.round(investment * Math.pow(1 + rateOfReturn / 100, timePeriod));
  const estimatedReturns = Math.round(futureValue - investment);

  // Data for Pie Chart
  const data = [
    { name: 'Invested Amount', value: investment },
    { name: 'Estimated Returns', value: estimatedReturns },
  ];

  // Colors for Pie Chart sections
  const COLORS = ['#8884d8', '#82ca9d'];

  // Handler functions for manual input
  const handleInvestmentChange = (e) => setInvestment(Number(e.target.value));
  const handleRateOfReturnChange = (e) => setRateOfReturn(Number(e.target.value));
  const handleTimePeriodChange = (e) => setTimePeriod(Number(e.target.value));

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <Typography variant="h5" gutterBottom>
        Lumpsum Calculator
      </Typography>

      {/* Investment Slider and Input */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '300px' }}>
      <Typography>Total Investment (₹)</Typography>
      <TextField
          type="number"
          value={investment}
          onChange={handleInvestmentChange}
          variant="outlined"
          size="small"
          style={{ width: '150px' }}
        />
    </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Slider
          value={investment}
          onChange={(e, newValue) => setInvestment(newValue)}
          min={1000}
          max={10000000}
          step={1000}
          valueLabelDisplay="auto"
        />
        
      </div>

      {/* Rate of Return Slider and Input */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '215px' }}>
      <Typography>Expected Return Rate (p.a) (%)</Typography>
      <TextField
          type="number"
          value={rateOfReturn}
          onChange={handleRateOfReturnChange}
          variant="outlined"
          size="small"
          style={{ width: '150px' }}
        />
        </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '50px' }}>
        <Slider
          value={rateOfReturn}
          onChange={(e, newValue) => setRateOfReturn(newValue)}
          min={1}
          max={30}
          step={0.1}
          valueLabelDisplay="auto"
        />
      </div>

      {/* Time Period Slider and Input */}

      <div style={{ display: 'flex', alignItems: 'center', gap: '300px' }}>
      <Typography>Time Period (years)</Typography>
      <TextField
          type="number"
          value={timePeriod}
          onChange={handleTimePeriodChange}
          variant="outlined"
          size="small"
          style={{ width: '150px' }}
        />
        </div>
     
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Slider
          value={timePeriod}
          onChange={(e, newValue) => setTimePeriod(newValue)}
          min={1}
          max={50}
          step={1}
          valueLabelDisplay="auto"
        />
        
      </div>

      {/* Pie Chart */}
      <div style={{display: 'flex', justifyContent: 'center',alignItems: 'center'}}>
      <PieChart width={300} height={300}>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          fill="#8884d8"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Legend />
      </PieChart>
      </div>
      

      {/* Investment Summary */}
      <div style={{ marginTop: '20px' }}>
        <Typography>Invested Amount: ₹ {investment.toLocaleString()}</Typography>
        <Typography>Est. Returns: ₹ {estimatedReturns.toLocaleString()}</Typography>
        <Typography>Total Value: ₹ {futureValue.toLocaleString()}</Typography>
      </div>

      <p>
      Investments in Mutual Funds can be broadly classified into two types- lumpsum and SIP. A lumpsum investment is when the depositor invests a significant sum of money on a particular mutual fund scheme. SIP or Systematic Investment Plan, on the other hand, entails the investment of smaller amounts on a monthly basis.</p>

    <p>Both these type of mutual fund investment strategies have their fair share of benefits. Lumpsum investments are particularly preferred by a majority of investors, as there are lesser variables involved and returns are generally on the higher side. </p>
    </div>
  );
};

export default LumpsumCalculator;