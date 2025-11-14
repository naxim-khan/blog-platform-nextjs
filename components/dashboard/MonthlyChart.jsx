"use client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

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
        <div className="bg-white/95 backdrop-blur-xl p-4 border border-gray-200/50 rounded-2xl shadow-xl">
          <p className="font-bold text-gray-900 text-sm mb-2 bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
            {label}
          </p>
          <div className="space-y-2">
            {payload.map((entry, index) => (
              <div key={index} className="flex items-center gap-3">
                <div 
                  className="w-3 h-3 rounded-full shadow-sm"
                  style={{ backgroundColor: entry.color }}
                ></div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-600 capitalize">
                    {entry.dataKey}
                  </p>
                  <p className="text-sm font-bold text-gray-900">
                    {entry.dataKey === 'views' 
                      ? entry.value.toLocaleString() 
                      : entry.value
                    }
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }) => {
    return (
      <div className="flex items-center justify-center gap-6 mt-4 mb-2 flex-wrap">
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full shadow-sm"
              style={{ backgroundColor: entry.color }}
            ></div>
            <span className="text-xs font-medium text-gray-600 capitalize">
              {entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="h-80 sm:h-72 w-full relative">
      {/* Gradient Background Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-pink-50/30 rounded-2xl pointer-events-none"></div>
      
      <ResponsiveContainer width="100%" height="100%">
        <BarChart 
          data={chartData} 
          margin={{ 
            top: 5, 
            right: 0, 
            left: -20, 
            bottom: 10 
          }}
          barGap={3}
          barCategoryGap="15%"
        >
          <defs>
            {/* Gradient for Posts */}
            <linearGradient id="postsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.4} />
            </linearGradient>
            
            {/* Gradient for Views */}
            <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.4} />
            </linearGradient>
          </defs>
          
          <CartesianGrid 
            strokeDasharray="2 4" 
            stroke="#f3f4f6" 
            vertical={false}
            strokeOpacity={0.6}
          />
          
          <XAxis 
            dataKey="month" 
            axisLine={false}
            tickLine={false}
            tick={{ 
              fontSize: 10, 
              fill: '#6b7280',
              fontWeight: 500 
            }}
            padding={{ left: 10, right: 10 }}
          />
          
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ 
              fontSize: 10, 
              fill: '#6b7280',
              fontWeight: 500 
            }}
            width={30}
            tickFormatter={(value) => {
              if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
              return value;
            }}
          />
          
          <Tooltip 
            content={<CustomTooltip />}
            cursor={{ 
              fill: 'rgba(139, 92, 246, 0.05)',
              stroke: 'rgba(139, 92, 246, 0.1)',
              strokeWidth: 1,
              radius: 8
            }}
          />
          
          <Legend 
            content={<CustomLegend />}
            verticalAlign="top"
          />
          
          <Bar 
            dataKey="posts" 
            fill="url(#postsGradient)"
            stroke="#3b82f6"
            strokeWidth={0}
            radius={[6, 6, 0, 0]}
            className="transition-all duration-300 hover:opacity-80 cursor-pointer"
            maxBarSize={40}
          />
          
          <Bar 
            dataKey="views" 
            fill="url(#viewsGradient)"
            stroke="#8b5cf6"
            strokeWidth={0}
            radius={[6, 6, 0, 0]}
            className="transition-all duration-300 hover:opacity-80 cursor-pointer"
            maxBarSize={40}
          />
        </BarChart>
      </ResponsiveContainer>

      {/* Mobile Optimization */}
      <div className="block sm:hidden absolute bottom-2 left-1/2 transform -translate-x-1/2">
        <p className="text-xs text-gray-500 text-center bg-white/80 backdrop-blur-sm rounded-full px-3 py-1 border border-gray-200/50">
          👆 Tap bars for details
        </p>
      </div>
    </div>
  );
}