export default function StatCard({ title, amount, type }) {
  const colors = {
    balance: 'bg-emerald-500',
    income:  'bg-blue-500',
    expense: 'bg-red-500',
  }

  const textColors = {
    balance: 'text-emerald-600',
    income:  'text-blue-600',
    expense: 'text-red-600',
  }

  const bgColors = {
    balance: 'bg-emerald-50',
    income:  'bg-blue-50',
    expense: 'bg-red-50',
  }

  return (
    <div className={`${bgColors[type]} rounded-2xl p-6`}>
      <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
      <p className={`text-2xl font-bold ${textColors[type]}`}>
        RM {Number(amount).toLocaleString('en-MY', { minimumFractionDigits: 2 })}
      </p>
    </div>
  )
}