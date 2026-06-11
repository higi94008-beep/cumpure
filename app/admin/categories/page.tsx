'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Plus, Edit2, Trash2, X, Check, Tag } from 'lucide-react'
import toast from 'react-hot-toast'
import type { Category } from '@/types/database'

const EMPTY = { name: '', slug: '', description: '', image_url: '', is_active: true, sort_order: 0, parent_id: null as string | null }

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<'add' | 'edit' | null>(null)
  const [editCat, setEditCat] = useState<any>(EMPTY)
  const [saving, setSaving] = useState(false)

  const load = async () => {
    const { data } = await supabase.from('categories').select('*').order('sort_order')
    setCategories(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleSave = async () => {
    if (!editCat.name) return toast.error('Name is required')
    setSaving(true)
    const slug = editCat.slug || editCat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    const data = { ...editCat, slug, sort_order: Number(editCat.sort_order) }

    if (modal === 'add') {
      const { error } = await supabase.from('categories').insert(data)
      if (error) toast.error(error.message)
      else { toast.success('Category added!'); setModal(null); load() }
    } else {
      const { error } = await supabase.from('categories').update(data).eq('id', editCat.id)
      if (error) toast.error(error.message)
      else { toast.success('Updated!'); setModal(null); load() }
    }
    setSaving(false)
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? Products in this category will be uncategorised.`)) return
    const { error } = await supabase.from('categories').delete().eq('id', id)
    if (error) toast.error(error.message)
    else { toast.success('Deleted'); load() }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Categories</h2>
          <p className="text-gray-500 text-sm">{categories.length} categories</p>
        </div>
        <button onClick={() => { setEditCat({ ...EMPTY }); setModal('add') }} className="btn-primary py-2 text-sm">
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full" />
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-20">
            <Tag className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400">No categories yet</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
              <tr>
                <th className="text-left px-4 py-3">Name</th>
                <th className="text-left px-4 py-3">Slug</th>
                <th className="text-left px-4 py-3">Order</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-right px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {categories.map(cat => (
                <tr key={cat.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">{cat.name}</td>
                  <td className="px-4 py-3 text-gray-400 font-mono text-xs">{cat.slug}</td>
                  <td className="px-4 py-3 text-gray-500">{cat.sort_order}</td>
                  <td className="px-4 py-3">
                    <span className={`badge text-xs ${cat.is_active ? 'badge-green' : 'bg-gray-100 text-gray-500'}`}>{cat.is_active ? 'Active' : 'Inactive'}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center gap-1 justify-end">
                      <button onClick={() => { setEditCat({ ...cat }); setModal('edit') }} className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg"><Edit2 className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleDelete(cat.id, cat.name)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="font-bold text-lg">{modal === 'add' ? 'Add Category' : 'Edit Category'}</h3>
              <button onClick={() => setModal(null)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Name *</label>
                <input value={editCat.name} onChange={e => setEditCat({ ...editCat, name: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-') })} className="input-field" placeholder="e.g. Fresh Produce" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Slug</label>
                <input value={editCat.slug} onChange={e => setEditCat({ ...editCat, slug: e.target.value })} className="input-field" placeholder="fresh-produce" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Description</label>
                <textarea rows={2} value={editCat.description || ''} onChange={e => setEditCat({ ...editCat, description: e.target.value })} className="input-field resize-none" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Image URL</label>
                <input value={editCat.image_url || ''} onChange={e => setEditCat({ ...editCat, image_url: e.target.value })} className="input-field" placeholder="https://..." />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Sort Order</label>
                <input type="number" value={editCat.sort_order} onChange={e => setEditCat({ ...editCat, sort_order: e.target.value })} className="input-field" />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={editCat.is_active} onChange={e => setEditCat({ ...editCat, is_active: e.target.checked })} className="accent-brand-600 w-4 h-4" />
                <span className="text-sm text-gray-700">Active</span>
              </label>
            </div>
            <div className="flex gap-3 p-6 border-t">
              <button onClick={() => setModal(null)} className="flex-1 btn-outline py-2.5 text-sm">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="flex-1 btn-primary py-2.5 text-sm">
                <Check className="w-4 h-4" />
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
