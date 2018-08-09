import React from "react";
import PropTypes from "prop-types";

import {
  Segment,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

const VolumeChart = ({ filteredCommPosts }) => (
  <ResponsiveContainer width="99%" height={400}>
    <LineChart
      data={filteredCommPosts}
      margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis minTickGap={15} dataKey="MonthDay" />
      <YAxis yAxisId="left" />
      <YAxis yAxisId="right" orientation="right" />
      <Tooltip />
      <Legend />
      <Line
        name="# Posts"
        dot={false}
        connectNulls={true}
        strokeWidth={2}
        yAxisId="left"
        type="monotone"
        dataKey="n_post"
        stroke="#8884d8"
      />
      <Line
        name="# Comments"
        dot={false}
        connectNulls={true}
        strokeWidth={2}
        yAxisId="right"
        type="monotone"
        dataKey="n_comment"
        stroke="#82ca9d"
      />
    </LineChart>
  </ResponsiveContainer>
);

VolumeChart.propTypes = {
  filteredCommPosts: PropTypes.array.isRequired
};

export default VolumeChart;
