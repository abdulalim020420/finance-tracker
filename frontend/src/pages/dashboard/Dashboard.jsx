import { useState, useEffect } from 'react'
import { dashboardApi } from '../../api/dashboard'
import StatCard from '../../components/ui/StatCard'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts'

export default function Dashboard() {
  const [summary, setSummary]   = useState(null)
  const [loading, setLoading]   = useState(true)
  const [month, setMonth]       = useState(() => new Date().toISOString().slice(0, 7))

  useEffect(() => {
    setLoading(true)
    dashboardApi.getSummary(month)
      .then((res) => setSummary(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [month])

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Your financial overview</p>
        </div>
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      {loading ? (
        <div className="text-center text-slate-400 py-20">Loading...</div>
      ) : (
        <>
          {/* Stat Cards */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <StatCard title="Balance"       amount={summary?.balance}       type="balance" />
            <StatCard title="Total Income"  amount={summary?.total_income}  type="income"  />
            <StatCard title="Total Expense" amount={summary?.total_expense} type="expense" />
          </div>

          {/* Daily Trend Chart */}
          {summary?.daily_trend?.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8">
              <h2 className="text-base font-semibold text-slate-800 mb-6">Daily Trend</h2>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={summary.daily_trend}>
                  <defs>
                    <linearGradient id="income" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}    />
                    </linearGradient>
                    <linearGradient id="expense" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#ef4444" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}    />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} tickFormatter={(d) => d.slice(5)} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    formatter={(value) => [`RM ${Number(value).toFixed(2)}`, undefined]}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Legend />
                  <Area type="monotone" dataKey="income"  stroke="#3b82f6" fill="url(#income)"  strokeWidth={2} />
                  <Area type="monotone" dataKey="expense" stroke="#ef4444" fill="url(#expense)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Category Breakdown */}
          {summary?.by_category?.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h2 className="text-base font-semibold text-slate-800 mb-4">By Category</h2>
              <div className="space-y-3">
                {summary.by_category.map((cat) => (
                  <div key={cat.category_id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{cat.icon}</span>
                      <div>
                        <p className="text-sm font-medium text-slate-800">{cat.category_name}</p>
                        <p className="text-xs text-slate-400">{cat.count} transaction{cat.count > 1 ? 's' : ''}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-semibold ${cat.type === 'income' ? 'text-blue-600' : 'text-red-600'}`}>
                        {cat.type === 'income' ? '+' : '-'} RM {Number(cat.total).toLocaleString('en-MY', { minimumFractionDigits: 2 })}
                      </p>
                      <p className="text-xs text-slate-400 capitalize">{cat.type}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {summary?.daily_trend?.length === 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
              <p className="text-slate-400 text-sm">No transactions found for this month.</p>
              <p className="text-slate-400 text-sm">Add your first transaction to get started!</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}