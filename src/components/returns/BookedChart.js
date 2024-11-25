import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';

// Registering chart.js components
ChartJS.register(LineElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const BookedChart = ({ data }) => {
  // Ensure the chart starts from 0
  const chartData = {
    labels: ['0', ...data.map(item => item.symbol)], // Adding '0' as the first label
    datasets: [
      {
        label: 'Booked Returns',
        data: [0, ...data.map(item => item.returns)], // Adding 0 as the first data point
        borderColor: 'rgba(75, 192, 192, 1)', // Line color
        backgroundColor: 'rgba(75, 192, 192, 0.2)', // Line fill color
        fill: true,
      },
    ],
  };

  // Chart options (adjust as necessary)
  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Returns',
        },
      },
    },
  };

  return <Line data={chartData} options={options}/>;
};

export default BookedChart;
