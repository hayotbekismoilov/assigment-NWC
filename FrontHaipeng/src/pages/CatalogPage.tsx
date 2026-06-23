import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Filter, X, ChevronDown } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { api } from '../api';
import type { FilterState, ProductCategory, Product } from '../types';

const categoryOptions: { value: ProductCategory | 'all'; label: string }[] = [
    { value: 'all', label: 'Barchasi' },
    { value: 'motorcycle', label: 'Motosikllar' },
    { value: 'scooter', label: 'Skuterlar' },
    { value: 'electric', label: 'Elektr' },
];

const sortOptions = [
    { value: 'newest', label: 'Eng yangi' },
    { value: 'price-asc', label: 'Arzondan qimmatlga' },
    { value: 'price-desc', label: 'Qimmatdan arzonlga' },
    { value: 'rating', label: 'Reyting bo\'yicha' },
];

export default function CatalogPage() {
    const [params] = useSearchParams();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<FilterState>({
        category: (params.get('cat') as ProductCategory) || 'all',
        minPrice: 0,
        maxPrice: 60000000,
        inStockOnly: false,
        sortBy: 'newest',
    });

    useEffect(() => {
        setLoading(true);
        const p: Record<string, string | number | boolean> = { sort: filter.sortBy, min_price: filter.minPrice, max_price: filter.maxPrice };
        if (filter.category !== 'all') p.category = filter.category;
        if (filter.inStockOnly) p.in_stock = true;

        api.products.list(p).then(data => {
            setProducts(data.items as Product[]);
        }).catch(() => {}).finally(() => setLoading(false));
    }, [filter]);

    return (
        <main className="catalog-page">
            <div className="catalog-page__hero">
                <div className="container">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="catalog-page__title"
                    >
                        Katalog
                    </motion.h1>
                    <p className="catalog-page__sub">Haipeng moto va skuterlarining to'liq to'plami</p>
                </div>
            </div>

            <div className="container">
                <div className="catalog-layout">
                    {/* Sidebar */}
                    <aside className={`catalog-sidebar ${sidebarOpen ? 'catalog-sidebar--open' : ''}`}>
                        <div className="catalog-sidebar__header">
                            <h3>Filtr</h3>
                            <button className="catalog-sidebar__close" onClick={() => setSidebarOpen(false)}>
                                <X size={18} />
                            </button>
                        </div>

                        <div className="filter-group">
                            <h4>Kategoriya</h4>
                            <div className="filter-opts">
                                {categoryOptions.map((opt) => (
                                    <button
                                        key={opt.value}
                                        className={`filter-opt ${filter.category === opt.value ? 'filter-opt--active' : ''}`}
                                        onClick={() => setFilter({ ...filter, category: opt.value })}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="filter-group">
                            <h4>Holati</h4>
                            <label className="filter-check">
                                <input
                                    type="checkbox"
                                    checked={filter.inStockOnly}
                                    onChange={(e) => setFilter({ ...filter, inStockOnly: e.target.checked })}
                                />
                                Faqat mavjudlari
                            </label>
                        </div>

                        <div className="filter-group">
                            <h4>Narx chegara</h4>
                            <div className="price-range">
                                <input
                                    type="range"
                                    min={0}
                                    max={60000000}
                                    step={500000}
                                    value={filter.maxPrice}
                                    onChange={(e) => setFilter({ ...filter, maxPrice: Number(e.target.value) })}
                                    className="price-slider"
                                />
                                <div className="price-labels">
                                    <span>0</span>
                                    <span>{new Intl.NumberFormat('uz-UZ').format(filter.maxPrice)} so'm</span>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Main */}
                    <div className="catalog-main">
                        <div className="catalog-toolbar">
                            <button className="catalog-filter-btn" onClick={() => setSidebarOpen(true)}>
                                <Filter size={16} /> Filtr
                            </button>
                            <span className="catalog-count">{products.length} ta model topildi</span>
                            <div className="catalog-sort">
                                <ChevronDown size={16} />
                                <select
                                    value={filter.sortBy}
                                    onChange={(e) => setFilter({ ...filter, sortBy: e.target.value as FilterState['sortBy'] })}
                                >
                                    {sortOptions.map((opt) => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {loading ? (
                            <div className="catalog-empty"><p>Yuklanmoqda...</p></div>
                        ) : products.length === 0 ? (
                            <div className="catalog-empty">
                                <p>Hech narsa topilmadi. Filtrni o'zgartiring.</p>
                                <button
                                    className="btn btn--ghost"
                                    onClick={() => setFilter({ category: 'all', minPrice: 0, maxPrice: 60000000, inStockOnly: false, sortBy: 'newest' })}
                                >
                                    Filtrni tozalash
                                </button>
                            </div>
                        ) : (
                            <div className="products-grid">
                                {products.map((product, i) => (
                                    <motion.div
                                        key={product.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.04 }}
                                    >
                                        <ProductCard product={product} />
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
