import React from 'react';

const DashboardChart = () => {
  // Sample data - replace with real data from API
  const data = [
    { name: 'Week 1', occupancy: 65, revenue: 45000 },
    { name: 'Week 2', occupancy: 72, revenue: 52000 },
    { name: 'Week 3', occupancy: 78, revenue: 58000 },
    { name: 'Week 4', occupancy: 85, revenue: 67000 }
  ];

  const maxRevenue = Math.max(...data.map(d => d.revenue));
  const maxOccupancy = 100;

  return (
    <div className="w-full h-[300px]">
      <div className="flex items-end justify-between h-full space-x-4 px-4">
        {data.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center space-y-2">
            {/* Bars */}
            <div className="w-full flex justify-center space-x-1 items-end h-[200px]">
              {/* Occupancy Bar */}
              <div className="relative flex-1 bg-blue-500 rounded-t transition-all hover:bg-blue-600"
                style={{
                  height: `${(item.occupancy / maxOccupancy) * 100}%`,
                  minHeight: '10px'
                }}
                title={`Occupancy: ${item.occupancy}%`}
              >
                <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-blue-600 dark:text-blue-400">
                  {item.occupancy}%
                </span>
              </div>

              {/* Revenue Bar */}
              <div className="relative flex-1 bg-green-500 rounded-t transition-all hover:bg-green-600"
                style={{
                  height: `${(item.revenue / maxRevenue) * 100}%`,
                  minHeight: '10px'
                }}
                title={`Revenue: $${item.revenue.toLocaleString()}`}
              >
                <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-green-600 dark:text-green-400">
                  ${(item.revenue / 1000).toFixed(0)}k
                </span>
              </div>
            </div>

            {/* Label */}
            <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">
              {item.name}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex justify-center items-center space-x-6 mt-6">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded"></div>
          <span className="text-sm text-gray-600 dark:text-gray-400">Occupancy (%)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span className="text-sm text-gray-600 dark:text-gray-400">Revenue ($)</span>
        </div>
      </div>
    </div>
  );
};

export default DashboardChart;