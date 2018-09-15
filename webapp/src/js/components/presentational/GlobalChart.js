import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

const GlobalChart = ({ data, selected, colors, datakey }) => (
  <ResponsiveContainer width="99%" height={400}>
    <LineChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis minTickGap={15} dataKey="date" />
      <YAxis type="number" />
      <Tooltip />
      <Legend />
      {selected.map((item, i) => {
        return (
          <Line
            key={i}
            name={`r/${item}`}
            dot={false}
            connectNulls={true}
            strokeWidth={2}
            type="monotone"
            dataKey={item + datakey}
            stroke={colors[i]}
          />
        );
      })}
    </LineChart>
  </ResponsiveContainer>
);

export default GlobalChart;
