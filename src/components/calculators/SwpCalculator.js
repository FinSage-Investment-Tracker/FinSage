import React, { useState } from 'react';
import { Slider, Typography, TextField } from '@mui/material';
import { PieChart, Pie, Cell, Legend } from 'recharts';

function calculateSwp(initialInvestment, rateOfReturn, withdrawalAmount, timePeriod) {
  let balance = initialInvestment;
  const monthlyRate = rateOfReturn / 12 / 100;
  const monthlyWithdrawals = [];

  for (let month = 1; month <= timePeriod * 12; month++) {
    balance += balance * monthlyRate;  // Add monthly return
    balance -= withdrawalAmount;       // Subtract monthly withdrawal

    monthlyWithdrawals.push({ month, balance: Math.round(balance) });
  }

  const totalWithdrawn = withdrawalAmount * monthlyWithdrawals.length;
  return { finalBalance: Math.round(balance), totalWithdrawn };
}

function maxmonthwithdraw(initialInvestment, rateOfReturn, timePeriod) {
  const p = parseFloat(initialInvestment);
  const r = (parseFloat(rateOfReturn) / 100) / 12;
  const t = timePeriod * 12;

  const ans = (p * r) / (1 - Math.pow(1 + r, -t));

  return Math.floor(ans); // Return as integer
}



const SwpCalculator = () => {
  const [initialInvestment, setInitialInvestment] = useState(500000);
  const [rateOfReturn, setRateOfReturn] = useState(10);
  const [withdrawalAmount, setWithdrawalAmount] = useState(5000);
  const [timePeriod, setTimePeriod] = useState(10);

  // Calculate values based on inputs
  const { finalBalance, totalWithdrawn } = calculateSwp(
    initialInvestment,
    rateOfReturn,
    withdrawalAmount,
    timePeriod
  );

  // Calculate the maximum withdrawal amount based on maxmonthwithdraw function
  // const maxWithdrawalAmount = maxmonthwithdraw(initialInvestment, rateOfReturn, timePeriod);

  const data = [
    { name: 'Total Withdrawn', value: totalWithdrawn },
    { name: 'Remaining Balance', value: finalBalance },
  ];

  const COLORS = ['#82ca9d', '#8884d8'];

  // Handle slider value change and restrict it if it exceeds the maximum
  const handleWithdrawalAmountChange = (event, newValue) => {
    // Get the maximum withdrawal amount based on the initial investment, rate of return, and time period
    const maxWithdrawal = maxmonthwithdraw(initialInvestment, rateOfReturn, timePeriod);

    // If the new value exceeds the maximum allowed withdrawal, revert to the max withdrawal amount
    if (newValue > maxWithdrawal) {
      setWithdrawalAmount(maxWithdrawal); // Set to the maximum withdrawal value
    } else {
      setWithdrawalAmount(newValue); // Otherwise, update the withdrawal amount
    }
  };


  const handleFieldChange = (setterFunction, value) => {
    setterFunction(value);
    const maxWithdrawal = maxmonthwithdraw(initialInvestment, rateOfReturn, timePeriod);
    if (withdrawalAmount > maxWithdrawal) {
      setWithdrawalAmount(maxWithdrawal);
    }
  };
  

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <Typography variant="h5" gutterBottom>
        SWP Calculator
      </Typography>

      {/* Initial Investment Input */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography>Initial Investment (₹)</Typography>
          <TextField
            type="number"
            value={initialInvestment}
            onChange={(e) => handleFieldChange(setInitialInvestment, Number(e.target.value))}
            variant="outlined"
            size="small"
            style={{ width: '150px' }}
          />
        </div>
        <Slider
          value={initialInvestment}
          onChange={(e, newValue) => handleFieldChange(setInitialInvestment, newValue)}
          min={1000}
          max={10000000}
          step={1000}
          valueLabelDisplay="auto"
        />
      </div>

      {/* Rate of Return Input */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography>Expected Return Rate (p.a) (%)</Typography>
          <TextField
            type="number"
            value={rateOfReturn}
            onChange={(e) => handleFieldChange(setRateOfReturn, Number(e.target.value))}
            variant="outlined"
            size="small"
            style={{ width: '150px' }}
          />
        </div>
        <Slider
          value={rateOfReturn}
          onChange={(e, newValue) => handleFieldChange(setRateOfReturn, newValue)}
          min={1}
          max={30}
          step={0.1}
          valueLabelDisplay="auto"
        />
      </div>

      {/* Monthly Withdrawal Amount Input */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography>Monthly Withdrawal (₹)</Typography>
          <TextField
            type="number"
            value={withdrawalAmount}
            onChange={(e) => setWithdrawalAmount(Number(e.target.value))}
            variant="outlined"
            size="small"
            style={{ width: '150px' }}
          />
        </div>
        <Slider
          value={withdrawalAmount}
          onChange={handleWithdrawalAmountChange} // Handler with fixed max logic
          min={100}
          max={100000} // Fixed max value
          step={100}
          valueLabelDisplay="auto"
          valueLabel={withdrawalAmount} // Show the current withdrawalAmount as the value label
        />
      </div>

      {/* Time Period Input */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography>Time Period (years)</Typography>
          <TextField
            type="number"
            value={timePeriod}
            onChange={(e) => handleFieldChange(setTimePeriod, Number(e.target.value))}
            variant="outlined"
            size="small"
            style={{ width: '150px' }}
          />
        </div>
        <Slider
          value={timePeriod}
          onChange={(e, newValue) => handleFieldChange(setTimePeriod, newValue)}
          min={1}
          max={30}
          step={1}
          valueLabelDisplay="auto"
        />
      </div>

      {/* Pie Chart */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <PieChart width={300} height={300}>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Legend />
        </PieChart>
      </div>

      {/* Investment Summary */}
      <div>
        <Typography>Total Withdrawn: ₹ {finalBalance < 0
          ? `Max Limit is for given initial investment and time period: ₹ ${maxmonthwithdraw(initialInvestment, rateOfReturn, timePeriod)}`
          : totalWithdrawn.toLocaleString()}</Typography>
        <Typography>Remaining Balance: ₹ {finalBalance < 0 ? "0" : finalBalance.toLocaleString()}</Typography>
      </div>
    </div>
  );
};

export default SwpCalculator;