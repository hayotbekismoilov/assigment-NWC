import { create } from 'zustand';
import type {
    Moto, Part, Worker, WorkerTask, Transaction,
    Customer, Order, Supplier, InventoryMovement, CrmStats,
    WorkerPayment, WorkerHistoryEvent, WorkerPaymentType, Shop, PaymentMethod
} from '../types/crm';
import {
    mockMotos, mockParts, mockWorkers, mockWorkerTasks,
    mockTransactions, mockCustomers, mockOrders, mockSuppliers,
    mockInventoryMovements, mockWorkerPayments, mockWorkerHistory, mockShops
} from '../data/mockData';

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function formatPrice(price: number): string {
    return new Intl.NumberFormat('uz-UZ').format(price);
}

interface CrmState {
    motos: Moto[];
    parts: Part[];
    workers: Worker[];
    workerTasks: WorkerTask[];
    workerPayments: WorkerPayment[];
    workerHistory: WorkerHistoryEvent[];
    transactions: Transaction[];
    customers: Customer[];
    orders: Order[];
    suppliers: Supplier[];
    inventoryMovements: InventoryMovement[];
    shops: Shop[];

    // Computed
    getStats: () => CrmStats;
    getShopStats: (shopId: string) => { totalSales: number; totalRevenue: number };
    getWorkerEarnings: (workerId: string) => number;
    getWorkerUnpaid: (workerId: string) => number;
    getWorkerMotoCount: (workerId: string) => number;
    getMotoProfit: (motoId: string) => number;
    getLowStockParts: () => Part[];
    formatPrice: (price: number) => string;

    // Worker payment/balance
    getWorkerTotalPaid: (workerId: string) => number;
    getWorkerBalance: (workerId: string) => number;

    // Moto CRUD
    addMoto: (moto: Omit<Moto, 'id' | 'createdAt'>) => void;
    updateMoto: (id: string, data: Partial<Moto>) => void;
    deleteMoto: (id: string) => void;
    completeMoto: (id: string) => void;
    sellMoto: (id: string, customerId: string, price: number, shopId?: string) => void;

    // Part CRUD
    addPart: (part: Omit<Part, 'id'>) => void;
    updatePart: (id: string, data: Partial<Part>) => void;
    deletePart: (id: string) => void;

    // Worker CRUD
    addWorker: (worker: Omit<Worker, 'id' | 'joinedAt'>) => void;
    updateWorker: (id: string, data: Partial<Worker>) => void;
    deleteWorker: (id: string) => void;

    // Worker Tasks
    addWorkerTask: (task: Omit<WorkerTask, 'id'>) => void;
    payWorkerTask: (taskId: string) => void;
    payAllWorkerTasks: (workerId: string) => void;

    // Worker Payments
    addWorkerPayment: (payment: { workerId: string; amount: number; type: WorkerPaymentType; note: string }) => void;
    addWorkerHistoryEvent: (event: Omit<WorkerHistoryEvent, 'id'>) => void;

    // Transactions
    addTransaction: (tx: Omit<Transaction, 'id'>) => void;

    // Customer CRUD
    addCustomer: (customer: Omit<Customer, 'id' | 'createdAt'>) => void;
    updateCustomer: (id: string, data: Partial<Customer>) => void;

    // Orders
    addOrder: (order: Omit<Order, 'id'>) => void;
    updateOrderPayment: (id: string, amount: number) => void;

    // Shop CRUD
    addShop: (shop: Omit<Shop, 'id' | 'createdAt' | 'debt'>) => void;
    updateShop: (id: string, data: Partial<Shop>) => void;
    deleteShop: (id: string) => void;
    payShopDebt: (id: string, amount: number, method: PaymentMethod) => void;
    sellMotoToShop: (motoId: string, shopId: string, price: number, isCredit: boolean) => void;

    // Inventory
    addInventoryMovement: (movement: Omit<InventoryMovement, 'id'>) => void;
}

export const useCrmStore = create<CrmState>()((set, get) => ({
    motos: mockMotos,
    parts: mockParts,
    workers: mockWorkers,
    workerTasks: mockWorkerTasks,
    workerPayments: mockWorkerPayments,
    workerHistory: mockWorkerHistory,
    transactions: mockTransactions,
    customers: mockCustomers,
    orders: mockOrders,
    suppliers: mockSuppliers,
    inventoryMovements: mockInventoryMovements,
    shops: mockShops,

    formatPrice,

    getStats: () => {
        const { motos, workers, parts, transactions, workerTasks, orders } = get();
        const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
        const totalExpense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
        const unpaidSalary = workerTasks.filter(t => !t.paid).reduce((s, t) => s + t.amount, 0);
        const today = new Date().toISOString().split('T')[0];
        const todayProduction = motos.filter(m => m.completedAt === today).length;
        const pendingOrders = orders.filter(o => o.paymentStatus !== 'paid').length;

        return {
            totalMotos: motos.length,
            readyMotos: motos.filter(m => m.status === 'ready').length,
            soldMotos: motos.filter(m => m.status === 'sold').length,
            assemblingMotos: motos.filter(m => m.status === 'assembling').length,
            totalWorkers: workers.length,
            activeWorkers: workers.filter(w => w.status === 'active').length,
            totalParts: parts.reduce((s, p) => s + p.quantity, 0),
            lowStockParts: parts.filter(p => p.quantity <= p.minStock).length,
            totalIncome,
            totalExpense,
            totalProfit: totalIncome - totalExpense,
            todayProduction,
            pendingOrders,
            unpaidSalary,
        };
    },

    getShopStats: (shopId) => {
        const { orders } = get();
        const shopOrders = orders.filter(o => o.shopId === shopId);
        return {
            totalSales: shopOrders.length,
            totalRevenue: shopOrders.reduce((sum, o) => sum + o.price, 0)
        };
    },

    getWorkerEarnings: (workerId) => {
        return get().workerTasks.filter(t => t.workerId === workerId).reduce((s, t) => s + t.amount, 0);
    },

    getWorkerUnpaid: (workerId) => {
        return get().workerTasks.filter(t => t.workerId === workerId && !t.paid).reduce((s, t) => s + t.amount, 0);
    },

    getWorkerMotoCount: (workerId) => {
        const motoIds = new Set(get().workerTasks.filter(t => t.workerId === workerId).map(t => t.motoId));
        return motoIds.size;
    },

    getWorkerTotalPaid: (workerId) => {
        return get().workerPayments
            .filter(p => p.workerId === workerId)
            .reduce((s, p) => {
                if (p.type === 'penalty') return s; // penalty is not a payment
                return s + p.amount;
            }, 0);
    },

    getWorkerBalance: (workerId) => {
        const worker = get().workers.find(w => w.id === workerId);
        if (!worker) return 0;
        const payments = get().workerPayments.filter(p => p.workerId === workerId);
        const advances = payments.filter(p => p.type === 'advance').reduce((s, p) => s + p.amount, 0);
        const penalties = payments.filter(p => p.type === 'penalty').reduce((s, p) => s + p.amount, 0);
        const salaryPaid = payments.filter(p => p.type === 'salary').reduce((s, p) => s + p.amount, 0);
        return worker.baseSalary - advances - penalties - salaryPaid;
    },

    getMotoProfit: (motoId) => {
        const moto = get().motos.find(m => m.id === motoId);
        if (!moto) return 0;
        return moto.sellPrice - moto.costPrice;
    },

    getLowStockParts: () => {
        return get().parts.filter(p => p.quantity <= p.minStock);
    },

    // === MOTO CRUD ===
    addMoto: (motoData) => {
        const moto: Moto = {
            ...motoData,
            id: 'm' + generateId(),
            createdAt: new Date().toISOString().split('T')[0],
        };
        set(s => ({ motos: [...s.motos, moto] }));
    },

    updateMoto: (id, data) => {
        set(s => ({ motos: s.motos.map(m => m.id === id ? { ...m, ...data } : m) }));
    },

    deleteMoto: (id) => {
        set(s => ({ motos: s.motos.filter(m => m.id !== id) }));
    },

    completeMoto: (id) => {
        set(s => ({
            motos: s.motos.map(m => m.id === id ? { ...m, status: 'ready' as const, completedAt: new Date().toISOString().split('T')[0] } : m)
        }));
    },

    sellMoto: (id, customerId, price, shopId) => {
        const { motos, addTransaction, addOrder } = get();
        const moto = motos.find(m => m.id === id);
        if (!moto) return;

        set(s => ({
            motos: s.motos.map(m => m.id === id ? { ...m, status: 'sold' as const, sellPrice: price, soldAt: new Date().toISOString().split('T')[0], shopId } : m)
        }));

        addTransaction({
            type: 'income',
            category: 'sale',
            amount: price,
            description: `${moto.model} sotildi (#${moto.serialNumber})`,
            date: new Date().toISOString().split('T')[0],
            method: 'cash',
            status: 'completed',
            createdBy: 'Admin',
            relatedMotoId: id,
        });

        addOrder({
            customerId,
            motoId: id,
            price,
            paymentStatus: 'paid',
            paidAmount: price,
            date: new Date().toISOString().split('T')[0],
            shopId,
        });
    },

    // === SHOP CRUD ===
    addShop: (shopData) => {
        const shop: Shop = {
            ...shopData,
            id: 'sh' + generateId(),
            createdAt: new Date().toISOString().split('T')[0],
            debt: 0,
        };
        set(s => ({ shops: [...s.shops, shop] }));
    },

    updateShop: (id, data) => {
        set(s => ({ shops: s.shops.map(sh => sh.id === id ? { ...sh, ...data } : sh) }));
    },

    deleteShop: (id) => {
        set(s => ({ shops: s.shops.filter(sh => sh.id !== id) }));
    },

    payShopDebt: (id, amount, method) => {
        const { shops, addTransaction } = get();
        const shop = shops.find(s => s.id === id);
        if (!shop) return;

        set(s => ({
            shops: s.shops.map(sh => sh.id === id ? { ...sh, debt: Math.max(0, sh.debt - amount) } : sh)
        }));

        addTransaction({
            type: 'income',
            category: 'other',
            amount,
            description: `Do'kon qarzi to'landi: ${shop.name}`,
            date: new Date().toISOString().split('T')[0],
            method,
            status: 'completed',
            createdBy: 'Admin',
            note: `Do'kon qarzi so'ndirilishi`,
        });
    },

    sellMotoToShop: (motoId, shopId, price, isCredit) => {
        const { motos, shops, addTransaction, addOrder } = get();
        const moto = motos.find(m => m.id === motoId);
        const shop = shops.find(s => s.id === shopId);
        if (!moto || !shop) return;

        // 1. Update Moto status and shopId
        set(s => ({
            motos: s.motos.map(m => m.id === motoId ? {
                ...m,
                status: 'sold' as const,
                sellPrice: price,
                soldAt: new Date().toISOString().split('T')[0],
                shopId
            } : m)
        }));

        // 2. Increase shop debt if credit
        if (isCredit) {
            set(s => ({
                shops: s.shops.map(sh => sh.id === shopId ? { ...sh, debt: sh.debt + price } : sh)
            }));
        }

        // 3. Add Transaction (if not credit, it's direct income)
        addTransaction({
            type: 'income',
            category: 'sale',
            amount: isCredit ? 0 : price, // Cash received is 0 if sold on credit
            description: `${moto.model} filialga sotildi (#${moto.serialNumber}) - ${shop.name}`,
            date: new Date().toISOString().split('T')[0],
            method: 'transfer',
            status: 'completed',
            createdBy: 'Admin',
            relatedMotoId: motoId,
            note: isCredit ? "Nasiyaga (qarzga) berildi" : "To'lov qabul qilindi",
        });

        // 4. Add Order (for record keeping, even if it's a B2B transfer)
        addOrder({
            customerId: 'shop_' + shopId, // Fake customer ID for shop orders
            motoId,
            price,
            paymentStatus: isCredit ? 'unpaid' : 'paid',
            paidAmount: isCredit ? 0 : price,
            date: new Date().toISOString().split('T')[0],
            shopId,
        });
    },

    // === PART CRUD ===
    addPart: (partData) => {
        const part: Part = { ...partData, id: 'p' + generateId() };
        set(s => ({ parts: [...s.parts, part] }));
    },

    updatePart: (id, data) => {
        set(s => ({ parts: s.parts.map(p => p.id === id ? { ...p, ...data } : p) }));
    },

    deletePart: (id) => {
        set(s => ({ parts: s.parts.filter(p => p.id !== id) }));
    },

    // === WORKER CRUD ===
    addWorker: (workerData) => {
        const worker: Worker = {
            ...workerData,
            id: 'w' + generateId(),
            joinedAt: new Date().toISOString().split('T')[0],
        };
        set(s => ({ workers: [...s.workers, worker] }));
    },

    updateWorker: (id, data) => {
        set(s => ({ workers: s.workers.map(w => w.id === id ? { ...w, ...data } : w) }));
    },

    deleteWorker: (id) => {
        set(s => ({ workers: s.workers.filter(w => w.id !== id) }));
    },

    // === WORKER TASKS ===
    addWorkerTask: (taskData) => {
        const task: WorkerTask = { ...taskData, id: 'wt' + generateId() };
        set(s => ({ workerTasks: [...s.workerTasks, task] }));
    },

    payWorkerTask: (taskId) => {
        const task = get().workerTasks.find(t => t.id === taskId);
        if (!task) return;
        set(s => ({
            workerTasks: s.workerTasks.map(t => t.id === taskId ? { ...t, paid: true } : t)
        }));
        get().addTransaction({
            type: 'expense',
            category: 'salary',
            amount: task.amount,
            description: `Ish haqi: ${get().workers.find(w => w.id === task.workerId)?.name || 'Ishchi'}`,
            date: new Date().toISOString().split('T')[0],
            method: 'cash',
            status: 'completed',
            createdBy: 'Admin',
            relatedWorkerId: task.workerId,
        });
    },

    payAllWorkerTasks: (workerId) => {
        const unpaidTasks = get().workerTasks.filter(t => t.workerId === workerId && !t.paid);
        const totalAmount = unpaidTasks.reduce((s, t) => s + t.amount, 0);
        if (totalAmount === 0) return;

        set(s => ({
            workerTasks: s.workerTasks.map(t =>
                t.workerId === workerId && !t.paid ? { ...t, paid: true } : t
            )
        }));

        get().addTransaction({
            type: 'expense',
            category: 'salary',
            amount: totalAmount,
            description: `To'liq ish haqi: ${get().workers.find(w => w.id === workerId)?.name || 'Ishchi'}`,
            date: new Date().toISOString().split('T')[0],
            method: 'cash',
            status: 'completed',
            createdBy: 'Admin',
            relatedWorkerId: workerId,
        });
    },

    // === WORKER PAYMENTS ===
    addWorkerPayment: ({ workerId, amount, type, note }) => {
        const worker = get().workers.find(w => w.id === workerId);
        if (!worker) return;
        const today = new Date().toISOString().split('T')[0];

        // 1. Add payment record
        const payment: WorkerPayment = {
            id: 'wp' + generateId(),
            workerId,
            amount,
            type,
            date: today,
            note,
        };
        set(s => ({ workerPayments: [...s.workerPayments, payment] }));

        // 2. Create finance expense (for advance, salary, bonus — not penalty)
        if (type !== 'penalty') {
            get().addTransaction({
                type: 'expense',
                category: 'salary',
                amount,
                description: `${type === 'advance' ? 'Avans' : type === 'salary' ? 'Oylik' : 'Bonus'}: ${worker.name}`,
                date: today,
                method: 'cash',
                status: 'completed',
                createdBy: 'Admin',
                relatedWorkerId: workerId,
                note,
            });
        }

        // 3. Add history event
        const historyType = type === 'bonus' ? 'bonus' as const : type === 'penalty' ? 'penalty' as const : 'payment' as const;
        const desc = type === 'advance' ? `Avans oldi: ${note}` :
            type === 'salary' ? `Oylik to'landi: ${note}` :
                type === 'bonus' ? `Bonus oldi: ${note}` :
                    `Jarima: ${note}`;

        get().addWorkerHistoryEvent({
            workerId,
            type: historyType,
            description: desc,
            amount,
            date: today,
        });
    },

    addWorkerHistoryEvent: (eventData) => {
        const event: WorkerHistoryEvent = { ...eventData, id: 'wh' + generateId() };
        set(s => ({ workerHistory: [...s.workerHistory, event] }));
    },

    // === TRANSACTIONS ===
    addTransaction: (txData) => {
        const tx: Transaction = { ...txData, id: 't' + generateId() };
        set(s => ({ transactions: [...s.transactions, tx] }));
    },

    // === CUSTOMER CRUD ===
    addCustomer: (customerData) => {
        const customer: Customer = {
            ...customerData,
            id: 'c' + generateId(),
            createdAt: new Date().toISOString().split('T')[0],
        };
        set(s => ({ customers: [...s.customers, customer] }));
    },

    updateCustomer: (id, data) => {
        set(s => ({ customers: s.customers.map(c => c.id === id ? { ...c, ...data } : c) }));
    },

    // === ORDERS ===
    addOrder: (orderData) => {
        const order: Order = { ...orderData, id: 'o' + generateId() };
        set(s => ({ orders: [...s.orders, order] }));
    },

    updateOrderPayment: (id, amount) => {
        set(s => ({
            orders: s.orders.map(o => {
                if (o.id !== id) return o;
                const newPaid = o.paidAmount + amount;
                const status = newPaid >= o.price ? 'paid' as const : newPaid > 0 ? 'partial' as const : 'unpaid' as const;
                return { ...o, paidAmount: newPaid, paymentStatus: status };
            })
        }));
    },

    // === INVENTORY ===
    addInventoryMovement: (movementData) => {
        const movement: InventoryMovement = { ...movementData, id: 'im' + generateId() };
        set(s => {
            const updatedParts = s.parts.map(p => {
                if (p.id !== movementData.partId) return p;
                return {
                    ...p,
                    quantity: movementData.type === 'incoming'
                        ? p.quantity + movementData.quantity
                        : Math.max(0, p.quantity - movementData.quantity)
                };
            });
            return {
                inventoryMovements: [...s.inventoryMovements, movement],
                parts: updatedParts,
            };
        });
    },
}));
