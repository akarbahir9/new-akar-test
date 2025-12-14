import React from 'react';
import { Translation } from '../types';
import { MOCK_CHART_DATA } from '../constants';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Zap, Users, Activity, CheckCircle } from 'lucide-react';

interface DashboardProps {
  translation: Translation;
}

const Dashboard: React.FC<DashboardProps> = ({ translation }) => {
  return (
    <div className="p-8 space-y-8 overflow-y-auto h-full">
      <div className="flex justify-between items-end">
        <div>
            <h1 className="text-3xl font-bold mb-2">{translation.dashboard}</h1>
            <p className="text-gray-500 dark:text-gray-400">{translation.welcome}</p>
        </div>
        <button className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2.5 rounded-xl font-medium shadow-lg shadow-primary-500/30 transition-all flex items-center gap-2">
            <Zap className="w-4 h-4" />
            {translation.createFlow}
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
            { label: translation.totalFlows, value: '1,248', icon: Zap, color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-900/20' },
            { label: translation.activeUsers, value: '8,504', icon: Users, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/20' },
            { label: translation.successRate, value: '98.2%', icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/20' },
            { label: translation.recentActivity, value: '+24%', icon: Activity, color: 'text-orange-500', bg: 'bg-orange-100 dark:bg-orange-900/20' },
        ].map((stat, i) => (
            <div key={i} className="bg-white dark:bg-dark-surface p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4 transition-transform hover:-translate-y-1 duration-300">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg}`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{stat.label}</p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stat.value}</h3>
                </div>
            </div>
        ))}
      </div>

      {/* Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-dark-surface p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg">Execution Overview</h3>
                <select className="bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-gray-700 rounded-lg text-sm px-3 py-1 outline-none">
                    <option>Last 7 Days</option>
                    <option>Last 30 Days</option>
                </select>
            </div>
            <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={MOCK_CHART_DATA}>
                        <defs>
                            <linearGradient id="colorFlows" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-gray-700" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                            itemStyle={{ color: '#fff' }}
                        />
                        <Area type="monotone" dataKey="flows" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#colorFlows)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>

        <div className="bg-white dark:bg-dark-surface p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
             <h3 className="font-bold text-lg mb-6">System Health</h3>
             <div className="space-y-6">
                {[
                    { label: 'API Latency', val: 45, max: 100, unit: 'ms', color: 'bg-green-500' },
                    { label: 'Error Rate', val: 2, max: 100, unit: '%', color: 'bg-red-500' },
                    { label: 'CPU Usage', val: 68, max: 100, unit: '%', color: 'bg-blue-500' },
                    { label: 'Memory', val: 42, max: 100, unit: '%', color: 'bg-purple-500' },
                ].map((item, i) => (
                    <div key={i}>
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-500 dark:text-gray-400">{item.label}</span>
                            <span className="font-bold">{item.val}{item.unit}</span>
                        </div>
                        <div className="h-2 w-full bg-gray-100 dark:bg-dark-bg rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.val}%` }}></div>
                        </div>
                    </div>
                ))}
             </div>
             <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
                <p className="text-sm text-center text-gray-500">System running optimally</p>
             </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
