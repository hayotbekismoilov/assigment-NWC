export type MotoStatus = 'pending' | 'assembling' | 'ready' | 'sold';
export type PaymentStatus = 'paid' | 'partial' | 'unpaid';
export type TransactionType = 'income' | 'expense';
export type TransactionCategory = 'salary' | 'parts' | 'sale' | 'other';
export type WorkerPayType = 'per_moto' | 'per_task' | 'fixed';
export type WorkerPaymentType = 'advance' | 'salary' | 'bonus' | 'penalty';
export type WorkerHistoryType = 'joined' | 'payment' | 'task' | 'bonus' | 'penalty' | 'status_change';
export type MovementType = 'incoming' | 'outgoing';

export interface Shop {
    id: string;
    name: string;
    address: string;
    phone: string;
    managerId?: string;
    status: 'active' | 'inactive';
    createdAt: string;
    image?: string;
    locationUrl?: string;
    debt: number;
}

export interface Moto {
    id: string;
    model: string;
    serialNumber: string;
    status: MotoStatus;
    costPrice: number;
    sellPrice: number;
    partsUsed: { partId: string; quantity: number }[];
    workersAssigned: string[];
    createdAt: string;
    completedAt?: string;
    soldAt?: string;
    image?: string;
    shopId?: string;
}

export interface Part {
    id: string;
    name: string;
    quantity: number;
    price: number;
    minStock: number;
    supplierId?: string;
    unit: string;
}

export interface Worker {
    id: string;
    name: string;
    position: string;
    phone: string;
    payType: WorkerPayType;
    payRate: number;
    baseSalary: number;
    status: 'active' | 'inactive';
    joinedAt: string;
    avatar?: string;
}

export interface WorkerTask {
    id: string;
    workerId: string;
    motoId: string;
    description: string;
    amount: number;
    date: string;
    paid: boolean;
}

export interface AssemblyOrder {
    id: string;
    motoId: string;
    status: MotoStatus;
    parts: { partId: string; quantity: number }[];
    workers: string[];
    startDate: string;
    endDate?: string;
    totalCost: number;
    laborCost: number;
    partsCost: number;
}

export interface InventoryMovement {
    id: string;
    partId: string;
    type: MovementType;
    quantity: number;
    reason: string;
    date: string;
    performedBy: string;
}

export type PaymentMethod = 'cash' | 'card' | 'transfer';
export type TransactionStatus = 'completed' | 'pending';

export interface Transaction {
    id: string;
    type: TransactionType;
    category: TransactionCategory;
    amount: number;
    description: string;
    date: string;
    method: PaymentMethod;
    status: TransactionStatus;
    createdBy: string;
    note?: string;
    receipt?: string;
    relatedMotoId?: string;
    relatedWorkerId?: string;
    relatedSupplierId?: string;
    relatedOrderId?: string;
}

export interface Customer {
    id: string;
    name: string;
    phone: string;
    address?: string;
    createdAt: string;
}

export interface Order {
    id: string;
    customerId: string;
    motoId: string;
    price: number;
    paymentStatus: PaymentStatus;
    paidAmount: number;
    date: string;
    notes?: string;
    shopId?: string;
}

export interface Supplier {
    id: string;
    name: string;
    phone: string;
    address?: string;
    debt: number;
}

export interface CrmStats {
    totalMotos: number;
    readyMotos: number;
    soldMotos: number;
    assemblingMotos: number;
    totalWorkers: number;
    activeWorkers: number;
    totalParts: number;
    lowStockParts: number;
    totalIncome: number;
    totalExpense: number;
    totalProfit: number;
    todayProduction: number;
    pendingOrders: number;
    unpaidSalary: number;
}

export interface WorkerPayment {
    id: string;
    workerId: string;
    amount: number;
    type: WorkerPaymentType;
    date: string;
    note: string;
}

export interface WorkerHistoryEvent {
    id: string;
    workerId: string;
    type: WorkerHistoryType;
    description: string;
    amount?: number;
    date: string;
}
