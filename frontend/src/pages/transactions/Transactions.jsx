import { useState, useEffect } from 'react'
import { transactionsApi } from '../../api/transactions'
import { categoriesApi } from '../../api/categories'
import { Plus, Pencil, Trash2, X, ChevronLeft, ChevronRight } from 'lucide-react'

const emptyForm = { category_id: '', amount: '', description: '', date: new Date().toISOString().slice(0, 10) }

export default function Transactions() {
  const [transactions, setTransactions] = useState([])
  const [categories, setCategories]     = useState([])
  const [pagination, setPagination]     = useState(null)
  const [loading, setLoading]           = useState(true)
  const [showModal, setShowModal]       = useState(false)
  const [form, setForm]                 = useState(emptyForm)
  const [editing, setEditing]           = useState(null)
  const [saving, setSaving]             = useState(false)
  const [error, setError]               = useState('')
  const [page, setPage]                 = useState(1)
  const [filters, setFilters]           = useState({ type: '', category_id: '' })

  const fetchTransactions = () => {
    setLoading(true)
    transactionsApi.getAll({ page, ...filters })
      .then((res) => {
        setTransactions(res.data.data.transactions)
        setPagination(res.data.data.pagination)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchTransactions() }, [page, filters])

  useEffect(() => {
    categoriesApi.getAll().then((res) => setCategories(res.data.data))
  }, [])

  const openCreate = () => {
    setEditing(null)
    setForm(emptyForm)
    setError('')
    setShowModal(true)
  }

  const openEdit = (tx) => {
    setEditing(tx)
    setForm({
      category_id: tx.category_id,
      amount:      tx.amount,
      description: tx.description || '',
      date:        tx.date,
    })
    setError('')
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this transaction?')) return
    await transactionsApi.delete(id)
    fetchTransactions()
  }

  const handleSubmit = async () => {
    if (!form.category_id) { setError('Please select a category'); return }
    if (!form.amount)      { setError('Amount is required'); return }
    setSaving(true)
    try {
      if (editing) {
        await transactionsApi.update(editing.id, form)
      } else {
        await transactionsApi.create(form)
      }
      setShowModal(false)
      fetchTransactions()
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  const getCategoryType = (categoryId) => {
    const cat = categories.find((c) => c.id === Number(categoryId))
    return cat?.type
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Transactions</h1>
          <p className="text-slate-500 text-sm mt-1">Track your income and expenses</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={16} /> Add Transaction
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6">
        <select
          value={filters.type}
          onChange={(e) => { setFilters({ ...filters, type: e.target.value }); setPage(1) }}
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <select
          value={filters.category_id}
          onChange={(e) => { setFilters({ ...filters, category_id: e.target.value }); setPage(1) }}
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="text-center text-slate-400 py-20">Loading...</div>
        ) : transactions.length === 0 ? (
          <div className="text-center text-slate-400 py-20">
            <p>No transactions found.</p>
            <p className="text-sm mt-1">Add your first transaction to get started!</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left text-xs font-semibold text-slate-500 px-6 py-3">Date</th>
                <th className="text-left text-xs font-semibold text-slate-500 px-6 py-3">Category</th>
                <th className="text-left text-xs font-semibold text-slate-500 px-6 py-3">Description</th>
                <th className="text-right text-xs font-semibold text-slate-500 px-6 py-3">Amount</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 group">
                  <td className="px-6 py-4 text-sm text-slate-500">{tx.date}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span>{tx.category?.icon}</span>
                      <span className="text-sm font-medium text-slate-700">{tx.category?.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">{tx.description || '—'}</td>
                  <td className="px-6 py-4 text-right">
                    <span className={`text-sm font-semibold ${tx.category?.type === 'income' ? 'text-blue-600' : 'text-red-600'}`}>
                      {tx.category?.type === 'income' ? '+' : '-'} RM {Number(tx.amount).toLocaleString('en-MY', { minimumFractionDigits: 2 })}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEdit(tx)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => handleDelete(tx.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.last_page > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-slate-500">
            Page {pagination.current_page} of {pagination.last_page} — {pagination.total} total
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page === pagination.last_page}
              className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-slate-800">{editing ? 'Edit' : 'New'} Transaction</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">{error}</div>}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                <select
                  value={form.category_id}
                  onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">Select category</option>
                  {['income', 'expense'].map((type) => (
                    <optgroup key={type} label={type.charAt(0).toUpperCase() + type.slice(1)}>
                      {categories.filter((c) => c.type === type).map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Amount (RM)</label>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description <span className="text-slate-400">(optional)</span></label>
                <input
                  type="text"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="e.g. July salary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 border border-slate-200 text-slate-600 text-sm font-medium py-2 rounded-lg hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium py-2 rounded-lg disabled:opacity-50"
              >
                {saving ? 'Saving...' : editing ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}