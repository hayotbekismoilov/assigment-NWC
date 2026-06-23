import { useState, useEffect } from 'react';
import { Search, Trash2 } from 'lucide-react';
import { api } from '../../api';

function formatPrice(price: number) {
  return new Intl.NumberFormat('uz-UZ').format(price);
}

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    const params: Record<string, string> = {};
    if (search) params.search = search;
    api.users.list(params)
      .then(data => setUsers(data.items))
      .catch(() => { })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [search]);

  const handleDelete = async (id: number) => {
    if (!confirm("Foydalanuvchini o'chirmoqchimisiz?")) return;
    try {
      await api.users.delete(id);
      load();
    } catch (e: any) {
      alert(e.message);
    }
  };

  return (
    <div className="admin-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Foydalanuvchilar</h1>
          <p className="page-subtitle">{users.length} ta foydalanuvchi</p>
        </div>
      </div>

      <div className="table-controls">
        <div className="navbar-search">
          <Search size={16} />
          <input
            placeholder="Qidirish..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? <p>Yuklanmoqda...</p> : (
        <div className="admin-card">
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Foydalanuvchi</th>
                  <th>Kontaktlar</th>
                  <th>Buyurtmalar</th>
                  <th>Umumiy xarid</th>
                  <th>Rol</th>
                  <th>Amallar</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td>
                      <div className="user-table-info">
                        <div className="user-avatar-small">
                          {(u.full_name || u.username || '?')[0].toUpperCase()}
                        </div>
                        <div className="item-info">
                          <span className="item-name">{u.full_name || u.username}</span>
                          <span className="item-brand">@{u.username}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="user-contacts">
                        {u.email && <span className="contact-item">{u.email}</span>}
                        {u.phone && <span className="contact-item">{u.phone}</span>}
                      </div>
                    </td>
                    <td><span className="count-pill">{u.orders_count}</span></td>
                    <td className="font-bold">{formatPrice(u.total_spent)} so'm</td>
                    <td>
                      <span className={`status-badge ${u.role === 'admin' ? 'active' : 'pending'}`}>
                        {u.role === 'admin' ? 'Admin' : 'Foydalanuvchi'}
                      </span>
                    </td>
                    <td>
                      {u.role !== 'admin' && (
                        <div className="table-actions">
                          <button className="action-btn delete" title="O'chirish" onClick={() => handleDelete(u.id)}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
