'use client'
import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { formatPrice } from '@/lib/utils'
import { Plus, Search, Edit2, Trash2, Eye, EyeOff, X, Check, Package } from 'lucide-react'
import toast from 'react-hot-toast'
import Image from 'next/image'
import type { Product, Category } from '@/types/database'

const EMPTY_PRODUCT = {
  name: '', slug: '', description: '', price: 0, compare_price: null as number | null,
  category_id: null as string | null, images: [] as string[], tags: [] as string[],
  is_active: true, is_featured: false, stock_quantity: 10, unit: '', weight: null as string | null,
  brand: null as string | null, sku: null as string | null
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<'add' | 'edit' | null>(null)
  const [editProduct, setEditProduct] = useState<any>(EMPTY_PRODUCT)
  const [saving, setSaving] = useState(false)
  const [tagInput, setTagInput] = useState('')
  const [imageInput, setImageInput] = useState('')

  const load = useCallback(async () => {
    const [{ data: prods }, { data: cats }] = await Promise.all([
      supabase.from('products').select('*').order('created_at', { ascending: false }),
      supabase.from('categories').select('*').order('name'),
    ])
    setProducts(prods || [])
    setCategories(cats || [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const filtered = products.filter(p =>
    !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.brand?.toLowerCase().includes(search.toLowerCase())
  )

  const openAdd = () => {
    setEditProduct({ ...EMPTY_PRODUCT })
    setTagInput('')
    setImageInput('')
    setModal('add')
  }

  const openEdit = (p: Product) => {
    setEditProduct({ ...p, compare_price: p.compare_price || null })
    setTagInput('')
    setImageInput('')
    setModal('edit')
  }

  const handleSave = async () => {
    if (!editProduct.name || !editProduct.price) return toast.error('Name and price are required')
    setSaving(true)
    const slug = editProduct.slug || editProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    const data = { ...editProduct, slug, price: Number(editProduct.price), compare_price: editProduct.compare_price ? Number(editProduct.compare_price) : null, stock_quantity: Number(editProduct.stock_quantity) }

    if (modal === 'add') {
      const { error } = await supabase.from('products').insert(data)
      if (error) toast.error(error.message)
      else { toast.success('Product added!'); setModal(null); load() }
    } else {
      const { error } = await supabase.from('products').update(data).eq('id', editProduct.id)
      if (error) toast.error(error.message)
      else { toast.success('Product updated!'); setModal(null); load() }
    }
    setSaving(false)
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) toast.error(error.message)
    else { toast.success('Deleted'); load() }
  }

  const toggleActive = async (p: Product) => {
    await supabase.from('products').update({ is_active: !p.is_active }).eq('id', p.id)
    setProducts(products.map(x => x.id === p.id ? { ...x, is_active: !x.is_active } : x))
  }

  const addTag = () => {
    if (tagInput.trim() && !editProduct.tags.includes(tagInput.trim())) {
      setEditProduct({ ...editProduct, tags: [...editProduct.tags, tagInput.trim()] })
      setTagInput('')
    }
  }

  const addImage = () => {
    if (imageInput.trim()) {
      setEditProduct({ ...editProduct, images: [...editProduct.images, imageInput.trim()] })
      setImageInput('')
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Products</h2>
          <p className="text-gray-500 text-sm">{products.length} total products</p>
        </div>
        <button onClick={openAdd} className="btn-primary py-2 text-sm">
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-10 py-2 text-sm" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Package className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400">No products found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                <tr>
                  <th className="text-left px-4 py-3">Product</th>
                  <th className="text-left px-4 py-3">Category</th>
                  <th className="text-left px-4 py-3">Price</th>
                  <th className="text-left px-4 py-3">Stock</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-right px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(product => {
                  const cat = categories.find(c => c.id === product.category_id)
                  return (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                            {product.images?.[0] ? (
                              <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                            ) : (
                              <Package className="w-5 h-5 text-gray-300 m-auto" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800 line-clamp-1">{product.name}</p>
                            {product.brand && <p className="text-xs text-gray-400">{product.brand}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{cat?.name || '—'}</td>
                      <td className="px-4 py-3">
                        <span className="font-semibold text-gray-900">{formatPrice(product.price)}</span>
                        {product.compare_price && <span className="text-xs text-gray-400 line-through ml-1">{formatPrice(product.compare_price)}</span>}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`badge text-xs ${product.stock_quantity > 5 ? 'badge-green' : product.stock_quantity > 0 ? 'badge-orange' : 'bg-red-100 text-red-700'}`}>
                          {product.stock_quantity > 0 ? `${product.stock_quantity} in stock` : 'Out of stock'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => toggleActive(product)} className={`badge text-xs ${product.is_active ? 'badge-green' : 'bg-gray-100 text-gray-500'}`}>
                          {product.is_active ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 justify-end">
                          <button onClick={() => openEdit(product)} className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                          <button onClick={() => handleDelete(product.id, product.name)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="font-bold text-lg">{modal === 'add' ? 'Add Product' : 'Edit Product'}</h3>
              <button onClick={() => setModal(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Product Name *</label>
                  <input value={editProduct.name} onChange={e => setEditProduct({ ...editProduct, name: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-') })} className="input-field" placeholder="e.g. Organic Avocados" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Price (₹) *</label>
                  <input type="number" value={editProduct.price} onChange={e => setEditProduct({ ...editProduct, price: e.target.value })} className="input-field" placeholder="0" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Compare Price (₹)</label>
                  <input type="number" value={editProduct.compare_price || ''} onChange={e => setEditProduct({ ...editProduct, compare_price: e.target.value || null })} className="input-field" placeholder="0" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Brand</label>
                  <input value={editProduct.brand || ''} onChange={e => setEditProduct({ ...editProduct, brand: e.target.value })} className="input-field" placeholder="e.g. Organic Farms" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Unit</label>
                  <input value={editProduct.unit} onChange={e => setEditProduct({ ...editProduct, unit: e.target.value })} className="input-field" placeholder="e.g. 500g, 2 pcs" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Category</label>
                  <select value={editProduct.category_id || ''} onChange={e => setEditProduct({ ...editProduct, category_id: e.target.value || null })} className="input-field">
                    <option value="">Select category</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Stock Quantity</label>
                  <input type="number" value={editProduct.stock_quantity} onChange={e => setEditProduct({ ...editProduct, stock_quantity: e.target.value })} className="input-field" />
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Description</label>
                  <textarea rows={3} value={editProduct.description || ''} onChange={e => setEditProduct({ ...editProduct, description: e.target.value })} className="input-field resize-none" placeholder="Product description..." />
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Images (URLs)</label>
                  <div className="flex gap-2 mb-2">
                    <input value={imageInput} onChange={e => setImageInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addImage())} className="input-field flex-1 text-sm" placeholder="Paste image URL and press Enter" />
                    <button onClick={addImage} className="px-3 py-2 bg-brand-600 text-white rounded-lg text-sm">Add</button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {editProduct.images.map((img: string, i: number) => (
                      <div key={i} className="flex items-center gap-1 bg-gray-100 rounded-lg px-2 py-1">
                        <span className="text-xs text-gray-600 truncate max-w-32">{img.split('/').pop()}</span>
                        <button onClick={() => setEditProduct({ ...editProduct, images: editProduct.images.filter((_: any, j: number) => j !== i) })}><X className="w-3 h-3 text-gray-400" /></button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Tags</label>
                  <div className="flex gap-2 mb-2">
                    <input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())} className="input-field flex-1 text-sm" placeholder="Type tag and press Enter" />
                    <button onClick={addTag} className="px-3 py-2 bg-brand-600 text-white rounded-lg text-sm">Add</button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {editProduct.tags.map((tag: string) => (
                      <span key={tag} className="flex items-center gap-1 badge badge-green">
                        {tag}
                        <button onClick={() => setEditProduct({ ...editProduct, tags: editProduct.tags.filter((t: string) => t !== tag) })}><X className="w-2.5 h-2.5" /></button>
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={editProduct.is_active} onChange={e => setEditProduct({ ...editProduct, is_active: e.target.checked })} className="accent-brand-600 w-4 h-4" />
                    <span className="text-sm text-gray-700">Active</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={editProduct.is_featured} onChange={e => setEditProduct({ ...editProduct, is_featured: e.target.checked })} className="accent-brand-600 w-4 h-4" />
                    <span className="text-sm text-gray-700">Featured</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t">
              <button onClick={() => setModal(null)} className="flex-1 btn-outline py-2.5 text-sm">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="flex-1 btn-primary py-2.5 text-sm">
                <Check className="w-4 h-4" />
                {saving ? 'Saving...' : modal === 'add' ? 'Add Product' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
