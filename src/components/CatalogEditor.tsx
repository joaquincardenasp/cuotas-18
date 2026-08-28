import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  ShoppingCart, 
  RotateCcw,
  Lock
} from 'lucide-react';
import { ProductItem, DrinkCategoryKey } from '../types';
import { CATEGORY_METADATA } from '../data/initialProducts';
import { formatCLP } from '../utils/calculator';

interface CatalogEditorProps {
  products: ProductItem[];
  isAdmin: boolean;
  onUpdateProducts: (products: ProductItem[]) => void;
  onResetCatalog: () => void;
}

export const CatalogEditor: React.FC<CatalogEditorProps> = ({
  products,
  isAdmin,
  onUpdateProducts,
  onResetCatalog,
}) => {
  const [activeCategory, setActiveCategory] = useState<DrinkCategoryKey | 'all'>('all');
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newItem, setNewItem] = useState<Partial<ProductItem>>({
    name: '',
    category: 'pisco',
    quantity: 1,
    unitPrice: 5000,
    unitLabel: 'unidades',
    storeNote: '',
  });

  const categories: DrinkCategoryKey[] = ['pisco', 'gin', 'cerveza', 'terremoto', 'tequila', 'comun'];

  const handleQuantityChange = (id: string, newQty: number) => {
    if (!isAdmin) return;
    if (newQty < 0) return;
    const updated = products.map((p) => (p.id === id ? { ...p, quantity: newQty } : p));
    onUpdateProducts(updated);
  };

  const handlePriceChange = (id: string, newPrice: number) => {
    if (!isAdmin) return;
    if (newPrice < 0) return;
    const updated = products.map((p) => (p.id === id ? { ...p, unitPrice: newPrice } : p));
    onUpdateProducts(updated);
  };

  const handleNameChange = (id: string, newName: string) => {
    if (!isAdmin) return;
    const updated = products.map((p) => (p.id === id ? { ...p, name: newName } : p));
    onUpdateProducts(updated);
  };

  const handleDeleteItem = (id: string) => {
    if (!isAdmin) return;
    const updated = products.filter((p) => p.id !== id);
    onUpdateProducts(updated);
  };

  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin || !newItem.name?.trim()) return;

    const item: ProductItem = {
      id: `prod-custom-${Date.now()}`,
      name: newItem.name.trim(),
      category: newItem.category || 'pisco',
      quantity: Number(newItem.quantity) || 1,
      unitPrice: Number(newItem.unitPrice) || 0,
      unitLabel: newItem.unitLabel?.trim() || 'unidades',
      storeNote: newItem.storeNote?.trim() || 'Personalizado',
    };

    onUpdateProducts([...products, item]);
    setNewItem({
      name: '',
      category: 'pisco',
      quantity: 1,
      unitPrice: 5000,
      unitLabel: 'unidades',
      storeNote: '',
    });
    setIsAddingNew(false);
  };

  const filteredProducts = activeCategory === 'all' 
    ? products 
    : products.filter((p) => p.category === activeCategory);

  const totalFiltered = filteredProducts.reduce((acc, p) => acc + p.quantity * p.unitPrice, 0);

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl backdrop-blur-sm">
      
      {/* Top Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-red-600/20 text-red-400 border border-red-500/30">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                Catálogo de Compras y Precios
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  {products.length} productos
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Precios de referencia cotizados en <strong className="text-slate-300">dondelanegra.cl</strong>
              </p>
            </div>
          </div>
        </div>

        {isAdmin && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAddingNew(!isAddingNew)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/30 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Agregar Producto</span>
            </button>
            
            <button
              onClick={onResetCatalog}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
              title="Restablecer a la lista original de Don de la Negra"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Restablecer</span>
            </button>
          </div>
        )}
      </div>

      {/* Add New Product Form (Admin Only) */}
      {isAddingNew && isAdmin && (
        <form onSubmit={handleCreateItem} className="my-5 p-4 rounded-xl bg-slate-800/80 border border-blue-500/30 animate-in fade-in slide-in-from-top-2">
          <h3 className="text-sm font-semibold text-blue-300 mb-3 flex items-center gap-1.5">
            <Plus className="w-4 h-4" /> Nuevo Producto para el Paseo
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
            <div className="md:col-span-2">
              <label className="block text-xs text-slate-400 mb-1 font-medium">Nombre del producto</label>
              <input
                type="text"
                placeholder="Ej. Fernet Branca 750cc"
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1 font-medium">Categoría</label>
              <select
                value={newItem.category}
                onChange={(e) => setNewItem({ ...newItem, category: e.target.value as DrinkCategoryKey })}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-blue-500 outline-none"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {CATEGORY_METADATA[cat].emoji} {CATEGORY_METADATA[cat].label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1 font-medium">Cantidad</label>
              <input
                type="number"
                min="1"
                value={newItem.quantity}
                onChange={(e) => setNewItem({ ...newItem, quantity: Math.max(1, parseInt(e.target.value) || 1) })}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1 font-medium">Precio Unitario ($)</label>
              <input
                type="number"
                min="0"
                step="100"
                value={newItem.unitPrice}
                onChange={(e) => setNewItem({ ...newItem, unitPrice: Math.max(0, parseInt(e.target.value) || 0) })}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-slate-700/60">
            <button
              type="button"
              onClick={() => setIsAddingNew(false)}
              className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white bg-slate-900 border border-slate-700"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow"
            >
              Guardar Producto
            </button>
          </div>
        </form>
      )}

      {/* Category Pills Filter */}
      <div className="flex items-center gap-1.5 py-4 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeCategory === 'all'
              ? 'bg-red-600 text-white shadow-md shadow-red-900/30'
              : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          Todos ({products.length})
        </button>

        {categories.map((cat) => {
          const meta = CATEGORY_METADATA[cat];
          const count = products.filter((p) => p.category === cat).length;
          const isSelected = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                isSelected
                  ? 'bg-slate-700 text-white border-blue-500 shadow-md'
                  : 'bg-slate-800/60 text-slate-400 border-slate-700/60 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <span>{meta.emoji}</span>
              <span>{meta.label}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-900/60 text-slate-400 font-mono">
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Products List */}
      <div className="space-y-2.5 mt-2">
        {filteredProducts.map((prod) => {
          const meta = CATEGORY_METADATA[prod.category];
          const lineTotal = prod.quantity * prod.unitPrice;

          return (
            <div
              key={prod.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-800/50 hover:bg-slate-800/80 border border-slate-700/60 transition-all group"
            >
              {/* Product Info & Tag */}
              <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
                <span className="text-xl p-2 rounded-xl bg-slate-900/80 border border-slate-700/80 shrink-0">
                  {meta.emoji}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    {isAdmin ? (
                      <input
                        type="text"
                        value={prod.name}
                        onChange={(e) => handleNameChange(prod.id, e.target.value)}
                        className="text-sm font-semibold text-white bg-transparent border-b border-transparent hover:border-slate-600 focus:border-blue-500 focus:bg-slate-900/60 px-1 py-0.5 rounded outline-none transition-all flex-1 min-w-[160px]"
                      />
                    ) : (
                      <span className="text-sm font-semibold text-white px-1 py-0.5">
                        {prod.name}
                      </span>
                    )}
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${meta.badgeBg}`}>
                      {meta.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
                    <span>{prod.storeNote || 'dondelanegra.cl'}</span>
                    <span>•</span>
                    <span className="text-slate-300 font-mono">{prod.unitLabel}</span>
                  </div>
                </div>
              </div>

              {/* Quantity, Unit Price & Subtotal */}
              <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-700/40">
                
                {/* Quantity Controls */}
                <div className="flex items-center gap-1 bg-slate-900/80 border border-slate-700 rounded-lg p-1">
                  {isAdmin && (
                    <button
                      onClick={() => handleQuantityChange(prod.id, prod.quantity - 1)}
                      className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 rounded font-bold transition-colors"
                    >
                      -
                    </button>
                  )}
                  <span className="w-10 text-center text-xs font-bold text-white font-mono">
                    {prod.quantity}
                  </span>
                  {isAdmin && (
                    <button
                      onClick={() => handleQuantityChange(prod.id, prod.quantity + 1)}
                      className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 rounded font-bold transition-colors"
                    >
                      +
                    </button>
                  )}
                </div>

                {/* Unit Price */}
                <div className="text-right min-w-[90px]">
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Unitario</div>
                  <div className="text-xs text-slate-300 font-mono">
                    {isAdmin ? (
                      <div className="flex items-center justify-end gap-0.5">
                        <span>$</span>
                        <input
                          type="number"
                          step="100"
                          min="0"
                          value={prod.unitPrice}
                          onChange={(e) => handlePriceChange(prod.id, parseInt(e.target.value) || 0)}
                          className="w-16 text-right bg-transparent border-b border-transparent hover:border-slate-600 focus:border-blue-500 text-slate-200 outline-none px-0.5"
                        />
                      </div>
                    ) : (
                      formatCLP(prod.unitPrice)
                    )}
                  </div>
                </div>

                {/* Subtotal */}
                <div className="text-right min-w-[100px] bg-slate-900/40 px-2.5 py-1 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Subtotal</div>
                  <div className="text-sm font-bold text-emerald-400 font-mono">
                    {formatCLP(lineTotal)}
                  </div>
                </div>

                {/* Delete Button (Admin Only) */}
                {isAdmin && (
                  <button
                    onClick={() => handleDeleteItem(prod.id)}
                    className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-950/40 rounded-lg transition-colors"
                    title="Eliminar producto"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* Footer Subtotal */}
      <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <div>
          Mostrando <strong className="text-white">{filteredProducts.length}</strong> items
          {activeCategory !== 'all' && ` en ${CATEGORY_METADATA[activeCategory].label}`}
        </div>
        <div className="flex items-center gap-2">
          <span>Subtotal sección:</span>
          <span className="text-sm font-extrabold text-white font-mono">{formatCLP(totalFiltered)}</span>
        </div>
      </div>

    </div>
  );
};
