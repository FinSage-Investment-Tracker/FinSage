import React, { useState } from 'react';
import { Slider, Typography, TextField } from '@mui/material';
import { PieChart, Pie, Cell, Legend } from 'recharts';

function calculateSip(investment, rateOfReturn, timePeriod) {
  const i = rateOfReturn / 12 / 100;
  const n = 12 * timePeriod;
  const ans = investment * ((Math.pow(1 + i, n) - 1) / i) * (i + 1);
  return Math.round(ans);
}

const SipCalculator = () => {
  const [investment, setInvestment] = useState(25000);
  const [rateOfReturn, setRateOfReturn] = useState(12);
  const [timePeriod, setTimePeriod] = useState(10);

  // Calculate future value
  const futureValue = calculateSip(investment, rateOfReturn, timePeriod);
  const totalInvestment = investment * 12 * timePeriod;
  const estimatedReturns = futureValue - totalInvestment;

  // Data for Pie Chart
  const data = [
    { name: 'Invested Amount', value: totalInvestment },
    { name: 'Estimated Returns', value: estimatedReturns },
  ];

  const COLORS = ['#8884d8', '#82ca9d'];

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <Typography variant="h5" gutterBottom>
        SIP Calculator
      </Typography>

      {/* Investment Input */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography>Total Investment (₹)</Typography>
          <TextField
            type="number"
            value={investment}
            onChange={(e) => setInvestment(Number(e.target.value))}
            variant="outlined"
            size="small"
            style={{ width: '150px' }}
          />
        </div>
        <Slider
          value={investment}
          onChange={(e, newValue) => setInvestment(newValue)}
          min={1000}
          max={1000000}
          step={500}
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
            onChange={(e) => setRateOfReturn(Number(e.target.value))}
            variant="outlined"
            size="small"
            style={{ width: '150px' }}
          />
        </div>
        <Slider
          value={rateOfReturn}
          onChange={(e, newValue) => setRateOfReturn(newValue)}
          min={1}
          max={30}
          step={0.1}
          valueLabelDisplay="auto"
        />
      </div>

      {/* Time Period Input */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography>Time Period (years)</Typography>
          <TextField
            type="number"
            value={timePeriod}
            onChange={(e) => setTimePeriod(Number(e.target.value))}
            variant="outlined"
            size="small"
            style={{ width: '150px' }}
          />
        </div>
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
      <div style={{ marginBottom: '20px' }}>
        <Typography>Invested Amount: ₹ {totalInvestment.toLocaleString()}</Typography>
        <Typography>Est. Returns: ₹ {estimatedReturns.toLocaleString()}</Typography>
        <Typography>Total Value: ₹ {futureValue.toLocaleString()}</Typography>
      </div>

      <p>
        Prospective investors can think that SIPs and mutual funds are the same. However, SIPs are merely a method of investing in mutual funds, the other method being a lump sum. A SIP calculator is a tool that helps you determine the returns you can avail when parking your funds in such investment tools. Systematic Investment Plan or SIP is a process of investing a fixed sum of money in mutual funds at regular intervals. SIPs usually allow you to invest weekly, quarterly, or monthly.
      </p>
    </div>
  );
};

export default SipCalculator;