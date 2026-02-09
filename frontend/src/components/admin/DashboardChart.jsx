import React from 'react';

const DashboardChart = ({ data = [] }) => {
  // Use real data if provided, otherwise sample data
  const chartData = data.length > 0 ? data.map(d => ({
    name: d._id, // date string
    count: d.count
  })) : [
    { name: 'Week 1', count: 5 },
    { name: 'Week 2', count: 12 },
    { name: 'Week 3', count: 8 },
    { name: 'Week 4', count: 15 }
  ];

  const maxCount = Math.max(...chartData.map(d => d.count), 5);

  return (
    <div className="w-full h-[300px]">
      <div className="flex items-end justify-between h-full space-x-2 px-2 overflow-x-auto pb-4">
        {chartData.map((item, index) => {
          // Only show last 7-10 days if it's long data
          if (chartData.length > 10 && index < chartData.length - 10) return null;

          return (
            <div key={index} className="flex-1 min-w-[40px] flex flex-col items-center space-y-2 group">
              {/* Bar */}
              <div className="w-full flex justify-center items-end h-[200px]">
                <div className="relative w-full mx-1 bg-primary-500/80 dark:bg-primary-600/80 rounded-t-lg transition-all group-hover:bg-primary-500 dark:group-hover:bg-primary-400"
                  style={{
                    height: `${(item.count / maxCount) * 100}%`,
                    minHeight: '4px'
                  }}
                >
                  <span className="absolute -top-7 left-1/2 transform -translate-x-1/2 text-[10px] font-black text-primary-700 dark:text-primary-300 opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.count}
                  </span>
                </div>
              </div>

              {/* Label - short date */}
              <div className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-tighter transform -rotate-45 origin-top-left mt-2">
                {item.name.split('-').slice(1).join('/')}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex justify-center items-center space-x-6 mt-8">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-primary-500 rounded"></div>
          <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Daily Inquiry Volume</span>
        </div>
      </div>
    </div>
  );
};

export default DashboardChart;