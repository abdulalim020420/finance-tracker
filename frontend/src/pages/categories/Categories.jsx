import { useState, useEffect } from 'react'
import { categoriesApi } from '../../api/categories'
import { Plus, Pencil, Trash2, X } from 'lucide-react'

const ICONS  = ['💰','🏠','🚗','🍔','💊','🎮','✈️','📚','👗','💡','📱','🎵']
const COLORS = ['#22c55e','#3b82f6','#ef4444','#f59e0b','#8b5cf6','#ec4899','#14b8a6','#f97316']

const emptyForm = { name: '', type: 'expense', icon: '💰', color: '#22c55e' }

export default function Categories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading]       = useState(true)
  const [showModal, setShowModal]   = useState(false)
  const [form, setForm]             = useState(emptyForm)
  const [editing, setEditing]       = useState(null)
  const [saving, setSaving]         = useState(false)
  const [error, setError]           = useState('')

  const fetchCategories = async () => {
  try {
    const res = await categoriesApi.getAll()
    setCategories(res.data.data)
  } catch (err) {
    console.error(err)
  }
}

  useEffect(() => {
    let cancelled = false

    const fetch = async () => {
      try {
        const res = await categoriesApi.getAll()
        if (!cancelled) setCategories(res.data.data)
      } catch (err) {
        console.error(err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetch()

    return () => { cancelled = true }
  }, [])

  const openCreate = () => {
    setEditing(null)
    setForm(emptyForm)
    setError('')
    setShowModal(true)
  }

  const openEdit = (cat) => {
    setEditing(cat)
    setForm({ name: cat.name, type: cat.type, icon: cat.icon, color: cat.color })
    setError('')
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this category?')) return
    await categoriesApi.delete(id)
    fetchCategories()
  }

  const handleSubmit = async () => {
    if (!form.name.trim()) { setError('Name is required'); return }
    setSaving(true)
    try {
      if (editing) {
        await categoriesApi.update(editing.id, form)
      } else {
        await categoriesApi.create(form)
      }
      setShowModal(false)
      fetchCategories()
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  const income  = categories.filter((c) => c.type === 'income')
  const expense = categories.filter((c) => c.type === 'expense')

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Categories</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your income and expense categories</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={16} /> Add Category
        </button>
      </div>

      {loading ? (
        <div className="text-center text-slate-400 py-20">Loading...</div>
      ) : (
        <div className="grid grid-cols-2 gap-6">
          {[{ label: 'Income', list: income }, { label: 'Expense', list: expense }].map(({ label, list }) => (
            <div key={label} className="bg-white rounded-2xl border border-slate-200 p-6">
              <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">{label}</h2>
              {list.length === 0 ? (
                <p className="text-slate-400 text-sm text-center py-8">No {label.toLowerCase()} categories yet</p>
              ) : (
                <div className="space-y-2">
                  {list.map((cat) => (
                    <div key={cat.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 group">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg" style={{ backgroundColor: cat.color + '22' }}>
                          {cat.icon}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-800">{cat.name}</p>
                          <div className="w-3 h-3 rounded-full inline-block mt-0.5" style={{ backgroundColor: cat.color }} />
                        </div>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEdit(cat)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => handleDelete(cat.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-slate-800">{editing ? 'Edit' : 'New'} Category</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">{error}</div>}

            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="e.g. Groceries"
                />
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {['income', 'expense'].map((t) => (
                    <button
                      key={t}
                      onClick={() => setForm({ ...form, type: t })}
                      className={`py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                        form.type === t
                          ? t === 'income' ? 'bg-blue-500 text-white' : 'bg-red-500 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Icon */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Icon</label>
                <div className="flex flex-wrap gap-2">
                  {ICONS.map((icon) => (
                    <button
                      key={icon}
                      onClick={() => setForm({ ...form, icon })}
                      className={`w-9 h-9 rounded-lg text-lg flex items-center justify-center transition-colors ${
                        form.icon === icon ? 'bg-emerald-100 ring-2 ring-emerald-500' : 'bg-slate-100'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Color</label>
                <div className="flex gap-2">
                  {COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() => setForm({ ...form, color })}
                      className={`w-7 h-7 rounded-full transition-transform ${form.color === color ? 'scale-125 ring-2 ring-offset-2 ring-slate-400' : ''}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
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