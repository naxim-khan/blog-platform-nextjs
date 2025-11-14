"use client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function MonthlyChart({ data }) {
  const chartData = data.length > 0 ? data : [
    { month: 'Jan', posts: 12, views: 1240 },
    { month: 'Feb', posts: 8, views: 980 },
    { month: 'Mar', posts: 15, views: 1560 },
    { month: 'Apr', posts: 10, views: 1120 },
    { month: 'May', posts: 18, views: 1890 },
    { month: 'Jun', posts: 14, views: 1420 },
    { month: 'Jul', posts: 9, views: 1050 },
    { month: 'Aug', posts: 16, views: 1680 },
    { month: 'Sep', posts: 11, views: 1180 },
    { month: 'Oct', posts: 13, views: 1360 },
    { month: 'Nov', posts: 7, views: 890 },
    { month: 'Dec', posts: 20, views: 2100 },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-sm">
          <p className="font-medium text-gray-900 text-sm">{label}</p>
          <div className="space-y-1 mt-1">
            {payload.map((entry, index) => (
              <p key={index} className="text-xs" style={{ color: entry.color }}>
                {entry.name}: <span className="font-medium">{entry.value}</span>
              </p>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="2 4" stroke="#f3f4f6" vertical={false} />
          <XAxis 
            dataKey="month" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: '#6b7280' }}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: '#6b7280' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="posts" 
            fill="#3b82f6" 
            radius={[2, 2, 0, 0]}
            className="opacity-90 hover:opacity-100 transition-opacity"
          />
          <Bar 
            dataKey="views" 
            fill="#8b5cf6" 
            radius={[2, 2, 0, 0]}
            className="opacity-90 hover:opacity-100 transition-opacity"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}