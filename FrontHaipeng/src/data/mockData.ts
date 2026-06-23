import type {
    Moto, Part, Worker, WorkerTask, Transaction,
    Customer, Order, Supplier, InventoryMovement, WorkerPayment, WorkerHistoryEvent, Shop
} from '../types/crm';

export const mockWorkers: Worker[] = [
    { id: 'w1', name: 'Abdullayev Jasur', position: "Yig'uvchi", phone: '+998901234567', payType: 'per_moto', payRate: 200000, baseSalary: 3000000, status: 'active', joinedAt: '2024-03-15' },
    { id: 'w2', name: 'Karimov Botir', position: "Yig'uvchi", phone: '+998901234568', payType: 'per_moto', payRate: 200000, baseSalary: 3000000, status: 'active', joinedAt: '2024-01-10' },
    { id: 'w3', name: 'Toshmatov Alisher', position: 'Payvandchi', phone: '+998901234569', payType: 'per_task', payRate: 150000, baseSalary: 2500000, status: 'active', joinedAt: '2024-02-20' },
    { id: 'w4', name: 'Rahimov Sardor', position: "Bo'yoqchi", phone: '+998901234570', payType: 'per_moto', payRate: 180000, baseSalary: 2800000, status: 'active', joinedAt: '2024-04-01' },
    { id: 'w5', name: 'Nazarov Dilshod', position: 'Elektrik', phone: '+998901234571', payType: 'per_task', payRate: 170000, baseSalary: 2600000, status: 'active', joinedAt: '2024-05-12' },
    { id: 'w6', name: 'Umarov Sherzod', position: 'Mexanik', phone: '+998901234572', payType: 'per_moto', payRate: 220000, baseSalary: 3200000, status: 'active', joinedAt: '2023-11-05' },
    { id: 'w7', name: 'Qodirov Farrux', position: "Yig'uvchi", phone: '+998901234573', payType: 'per_moto', payRate: 200000, baseSalary: 3000000, status: 'active', joinedAt: '2024-06-20' },
    { id: 'w8', name: 'Ismoilov Jamshid', position: 'Tekshiruvchi', phone: '+998901234574', payType: 'fixed', payRate: 3000000, baseSalary: 3000000, status: 'active', joinedAt: '2024-01-01' },
    { id: 'w9', name: 'Xolmatov Nodir', position: "Yig'uvchi", phone: '+998901234575', payType: 'per_moto', payRate: 190000, baseSalary: 2800000, status: 'inactive', joinedAt: '2024-02-15' },
    { id: 'w10', name: 'Mirzayev Otabek', position: 'Ombor mudiri', phone: '+998901234576', payType: 'fixed', payRate: 3500000, baseSalary: 3500000, status: 'active', joinedAt: '2023-09-01' },
    { id: 'w11', name: 'Sobirov Ulugbek', position: 'Payvandchi', phone: '+998901234577', payType: 'per_task', payRate: 160000, baseSalary: 2500000, status: 'active', joinedAt: '2024-07-10' },
    { id: 'w12', name: 'Ergashev Behruz', position: "Bo'yoqchi", phone: '+998901234578', payType: 'per_moto', payRate: 180000, baseSalary: 2800000, status: 'active', joinedAt: '2024-08-01' },
];

export const mockShops: Shop[] = [
    { id: 'sh1', name: 'Haipeng Center', address: 'Toshkent, Shayxontohur tumani', phone: '+998712000000', managerId: 'w10', status: 'active', createdAt: '2023-01-01', locationUrl: 'https://maps.google.com', debt: 0 },
    { id: 'sh2', name: 'Haipeng Sergeli', address: 'Toshkent, Sergeli tumani, Avtomobil bozori', phone: '+998712000001', managerId: 'w8', status: 'active', createdAt: '2023-06-15', locationUrl: 'https://maps.google.com', debt: 12000000 },
    { id: 'sh3', name: 'Haipeng Samarkand', address: 'Samarqand sh., Gagarin ko\'chasi', phone: '+998662000000', managerId: 'w11', status: 'active', createdAt: '2024-01-10', locationUrl: 'https://maps.google.com', debt: 5000000 },
];

export const mockParts: Part[] = [
    { id: 'p1', name: 'Motor (150cc)', quantity: 45, price: 2500000, minStock: 10, supplierId: 's1', unit: 'dona' },
    { id: 'p2', name: 'Rama (125cc)', quantity: 32, price: 800000, minStock: 8, supplierId: 's1', unit: 'dona' },
    { id: 'p3', name: 'Rama (150cc)', quantity: 28, price: 950000, minStock: 8, supplierId: 's1', unit: 'dona' },
    { id: 'p4', name: 'G\'ildirak (old)', quantity: 60, price: 350000, minStock: 15, supplierId: 's2', unit: 'dona' },
    { id: 'p5', name: 'G\'ildirak (orqa)', quantity: 55, price: 380000, minStock: 15, supplierId: 's2', unit: 'dona' },
    { id: 'p6', name: 'Benzobak', quantity: 40, price: 280000, minStock: 10, supplierId: 's3', unit: 'dona' },
    { id: 'p7', name: 'O\'rindiq', quantity: 50, price: 220000, minStock: 12, supplierId: 's3', unit: 'dona' },
    { id: 'p8', name: 'Faralar komplekt', quantity: 35, price: 180000, minStock: 10, supplierId: 's4', unit: 'komplekt' },
    { id: 'p9', name: 'Tormoz tizimi', quantity: 42, price: 450000, minStock: 10, supplierId: 's2', unit: 'komplekt' },
    { id: 'p10', name: 'Elektr simlar', quantity: 70, price: 120000, minStock: 20, supplierId: 's4', unit: 'komplekt' },
    { id: 'p11', name: 'Amortizator (old)', quantity: 38, price: 320000, minStock: 10, supplierId: 's2', unit: 'dona' },
    { id: 'p12', name: 'Amortizator (orqa)', quantity: 36, price: 350000, minStock: 10, supplierId: 's2', unit: 'dona' },
    { id: 'p13', name: 'Zanjir va zvezdochka', quantity: 48, price: 280000, minStock: 12, supplierId: 's1', unit: 'komplekt' },
    { id: 'p14', name: 'Spidometr', quantity: 30, price: 150000, minStock: 8, supplierId: 's4', unit: 'dona' },
    { id: 'p15', name: 'Oynak (ko\'zgu)', quantity: 65, price: 80000, minStock: 20, supplierId: 's3', unit: 'juft' },
    { id: 'p16', name: 'Plastik kuzov komplekt', quantity: 25, price: 680000, minStock: 8, supplierId: 's3', unit: 'komplekt' },
    { id: 'p17', name: 'Motor (125cc)', quantity: 8, price: 2200000, minStock: 10, supplierId: 's1', unit: 'dona' },
    { id: 'p18', name: 'Qo\'l tutqich', quantity: 55, price: 95000, minStock: 15, supplierId: 's3', unit: 'juft' },
    { id: 'p19', name: 'Egzoz trubasi', quantity: 30, price: 380000, minStock: 8, supplierId: 's1', unit: 'dona' },
    { id: 'p20', name: 'Akkumulyator', quantity: 22, price: 350000, minStock: 8, supplierId: 's4', unit: 'dona' },
    { id: 'p21', name: 'Signal', quantity: 7, price: 45000, minStock: 10, supplierId: 's4', unit: 'dona' },
];

export const mockMotos: Moto[] = [
    { id: 'm1', model: 'Haipeng HP-150', serialNumber: 'HP150-001', status: 'sold', costPrice: 8200000, sellPrice: 12500000, partsUsed: [{ partId: 'p1', quantity: 1 }, { partId: 'p3', quantity: 1 }, { partId: 'p4', quantity: 1 }, { partId: 'p5', quantity: 1 }], workersAssigned: ['w1', 'w3', 'w4'], createdAt: '2026-03-01', completedAt: '2026-03-03', soldAt: '2026-03-10', shopId: 'sh1' },
    { id: 'm2', model: 'Haipeng HP-125', serialNumber: 'HP125-001', status: 'sold', costPrice: 7100000, sellPrice: 10800000, partsUsed: [{ partId: 'p17', quantity: 1 }, { partId: 'p2', quantity: 1 }, { partId: 'p4', quantity: 1 }, { partId: 'p5', quantity: 1 }], workersAssigned: ['w2', 'w3', 'w5'], createdAt: '2026-03-02', completedAt: '2026-03-04', soldAt: '2026-03-12', shopId: 'sh2' },
    { id: 'm3', model: 'Haipeng HP-150 Sport', serialNumber: 'HP150S-001', status: 'sold', costPrice: 9500000, sellPrice: 14200000, partsUsed: [{ partId: 'p1', quantity: 1 }, { partId: 'p3', quantity: 1 }], workersAssigned: ['w1', 'w4', 'w6'], createdAt: '2026-03-03', completedAt: '2026-03-06', soldAt: '2026-03-15', shopId: 'sh1' },
    { id: 'm4', model: 'Haipeng HP-150', serialNumber: 'HP150-002', status: 'ready', costPrice: 8200000, sellPrice: 12500000, partsUsed: [{ partId: 'p1', quantity: 1 }, { partId: 'p3', quantity: 1 }], workersAssigned: ['w2', 'w3', 'w4'], createdAt: '2026-03-05', completedAt: '2026-03-08', shopId: 'sh1' },
    { id: 'm5', model: 'Haipeng HP-125', serialNumber: 'HP125-002', status: 'ready', costPrice: 7100000, sellPrice: 10800000, partsUsed: [{ partId: 'p17', quantity: 1 }, { partId: 'p2', quantity: 1 }], workersAssigned: ['w1', 'w5'], createdAt: '2026-03-06', completedAt: '2026-03-09', shopId: 'sh2' },
    { id: 'm6', model: 'Haipeng HP-200', serialNumber: 'HP200-001', status: 'ready', costPrice: 11000000, sellPrice: 16500000, partsUsed: [{ partId: 'p1', quantity: 1 }, { partId: 'p3', quantity: 1 }], workersAssigned: ['w1', 'w6', 'w4'], createdAt: '2026-03-07', completedAt: '2026-03-11', shopId: 'sh3' },
    { id: 'm7', model: 'Haipeng HP-150 Sport', serialNumber: 'HP150S-002', status: 'ready', costPrice: 9500000, sellPrice: 14200000, partsUsed: [{ partId: 'p1', quantity: 1 }], workersAssigned: ['w2', 'w3'], createdAt: '2026-03-08', completedAt: '2026-03-12', shopId: 'sh1' },
    { id: 'm8', model: 'Haipeng HP-125', serialNumber: 'HP125-003', status: 'assembling', costPrice: 7100000, sellPrice: 10800000, partsUsed: [{ partId: 'p17', quantity: 1 }, { partId: 'p2', quantity: 1 }], workersAssigned: ['w7', 'w3'], createdAt: '2026-03-15' },
    { id: 'm9', model: 'Haipeng HP-150', serialNumber: 'HP150-003', status: 'assembling', costPrice: 8200000, sellPrice: 12500000, partsUsed: [{ partId: 'p1', quantity: 1 }], workersAssigned: ['w1', 'w4'], createdAt: '2026-03-16' },
    { id: 'm10', model: 'Haipeng HP-200', serialNumber: 'HP200-002', status: 'assembling', costPrice: 11000000, sellPrice: 16500000, partsUsed: [], workersAssigned: ['w6', 'w7'], createdAt: '2026-03-17' },
    { id: 'm11', model: 'Haipeng HP-150 Sport', serialNumber: 'HP150S-003', status: 'pending', costPrice: 9500000, sellPrice: 14200000, partsUsed: [], workersAssigned: [], createdAt: '2026-03-18' },
    { id: 'm12', model: 'Haipeng HP-125', serialNumber: 'HP125-004', status: 'pending', costPrice: 7100000, sellPrice: 10800000, partsUsed: [], workersAssigned: [], createdAt: '2026-03-19' },
    { id: 'm13', model: 'Haipeng HP-150', serialNumber: 'HP150-004', status: 'pending', costPrice: 8200000, sellPrice: 12500000, partsUsed: [], workersAssigned: [], createdAt: '2026-03-20' },
    { id: 'm14', model: 'Haipeng HP-200', serialNumber: 'HP200-003', status: 'pending', costPrice: 11000000, sellPrice: 16500000, partsUsed: [], workersAssigned: [], createdAt: '2026-03-21' },
    { id: 'm15', model: 'Haipeng HP-125 Eco', serialNumber: 'HP125E-001', status: 'sold', costPrice: 6500000, sellPrice: 9800000, partsUsed: [{ partId: 'p17', quantity: 1 }, { partId: 'p2', quantity: 1 }], workersAssigned: ['w2', 'w5'], createdAt: '2026-02-20', completedAt: '2026-02-23', soldAt: '2026-03-05', shopId: 'sh2' },
    { id: 'm16', model: 'Haipeng HP-150', serialNumber: 'HP150-005', status: 'sold', costPrice: 8200000, sellPrice: 12500000, partsUsed: [{ partId: 'p1', quantity: 1 }], workersAssigned: ['w1', 'w4'], createdAt: '2026-02-25', completedAt: '2026-02-28', soldAt: '2026-03-08', shopId: 'sh1' },
    { id: 'm17', model: 'Haipeng HP-200', serialNumber: 'HP200-004', status: 'sold', costPrice: 11000000, sellPrice: 16500000, partsUsed: [], workersAssigned: ['w6', 'w1'], createdAt: '2026-02-28', completedAt: '2026-03-02', soldAt: '2026-03-14', shopId: 'sh3' },
];

export const mockWorkerTasks: WorkerTask[] = [
    { id: 'wt1', workerId: 'w1', motoId: 'm1', description: "Motor o'rnatish", amount: 200000, date: '2026-03-01', paid: true },
    { id: 'wt2', workerId: 'w3', motoId: 'm1', description: 'Payvandlash', amount: 150000, date: '2026-03-01', paid: true },
    { id: 'wt3', workerId: 'w4', motoId: 'm1', description: "Bo'yash", amount: 180000, date: '2026-03-02', paid: true },
    { id: 'wt4', workerId: 'w2', motoId: 'm2', description: "Motor o'rnatish", amount: 200000, date: '2026-03-02', paid: true },
    { id: 'wt5', workerId: 'w3', motoId: 'm2', description: 'Payvandlash', amount: 150000, date: '2026-03-02', paid: true },
    { id: 'wt6', workerId: 'w5', motoId: 'm2', description: 'Elektr ulash', amount: 170000, date: '2026-03-03', paid: true },
    { id: 'wt7', workerId: 'w1', motoId: 'm3', description: "Yig'ish", amount: 200000, date: '2026-03-04', paid: true },
    { id: 'wt8', workerId: 'w4', motoId: 'm3', description: "Bo'yash", amount: 180000, date: '2026-03-05', paid: true },
    { id: 'wt9', workerId: 'w6', motoId: 'm3', description: 'Tekshirish', amount: 220000, date: '2026-03-05', paid: true },
    { id: 'wt10', workerId: 'w2', motoId: 'm4', description: "Yig'ish", amount: 200000, date: '2026-03-06', paid: true },
    { id: 'wt11', workerId: 'w3', motoId: 'm4', description: 'Payvandlash', amount: 150000, date: '2026-03-06', paid: false },
    { id: 'wt12', workerId: 'w4', motoId: 'm4', description: "Bo'yash", amount: 180000, date: '2026-03-07', paid: false },
    { id: 'wt13', workerId: 'w1', motoId: 'm5', description: "Yig'ish", amount: 200000, date: '2026-03-07', paid: false },
    { id: 'wt14', workerId: 'w5', motoId: 'm5', description: 'Elektr ulash', amount: 170000, date: '2026-03-08', paid: false },
    { id: 'wt15', workerId: 'w1', motoId: 'm6', description: "Yig'ish", amount: 200000, date: '2026-03-08', paid: false },
    { id: 'wt16', workerId: 'w6', motoId: 'm6', description: 'Mexanik ish', amount: 220000, date: '2026-03-09', paid: false },
    { id: 'wt17', workerId: 'w4', motoId: 'm6', description: "Bo'yash", amount: 180000, date: '2026-03-10', paid: false },
    { id: 'wt18', workerId: 'w7', motoId: 'm8', description: "Yig'ish", amount: 200000, date: '2026-03-15', paid: false },
    { id: 'wt19', workerId: 'w3', motoId: 'm8', description: 'Payvandlash', amount: 150000, date: '2026-03-15', paid: false },
    { id: 'wt20', workerId: 'w1', motoId: 'm9', description: "Yig'ish", amount: 200000, date: '2026-03-16', paid: false },
    { id: 'wt21', workerId: 'w4', motoId: 'm9', description: "Bo'yash", amount: 180000, date: '2026-03-17', paid: false },
    { id: 'wt22', workerId: 'w6', motoId: 'm10', description: 'Mexanik ish', amount: 220000, date: '2026-03-17', paid: false },
    { id: 'wt23', workerId: 'w7', motoId: 'm10', description: "Yig'ish", amount: 200000, date: '2026-03-18', paid: false },
    { id: 'wt24', workerId: 'w2', motoId: 'm15', description: "Yig'ish", amount: 200000, date: '2026-02-20', paid: true },
    { id: 'wt25', workerId: 'w5', motoId: 'm15', description: 'Elektr ulash', amount: 170000, date: '2026-02-21', paid: true },
    { id: 'wt26', workerId: 'w1', motoId: 'm16', description: "Yig'ish", amount: 200000, date: '2026-02-25', paid: true },
    { id: 'wt27', workerId: 'w4', motoId: 'm16', description: "Bo'yash", amount: 180000, date: '2026-02-26', paid: true },
    { id: 'wt28', workerId: 'w6', motoId: 'm17', description: 'Mexanik ish', amount: 220000, date: '2026-02-28', paid: true },
    { id: 'wt29', workerId: 'w1', motoId: 'm17', description: "Yig'ish", amount: 200000, date: '2026-03-01', paid: true },
];

export const mockWorkerPayments: WorkerPayment[] = [
    { id: 'wp1', workerId: 'w1', amount: 1000000, type: 'advance', date: '2026-03-05', note: 'Avans — mart oyi' },
    { id: 'wp2', workerId: 'w1', amount: 500000, type: 'bonus', date: '2026-03-10', note: '3 ta motoni tez yig\'ish uchun bonus' },
    { id: 'wp3', workerId: 'w2', amount: 800000, type: 'advance', date: '2026-03-06', note: 'Avans — mart oyi' },
    { id: 'wp4', workerId: 'w3', amount: 600000, type: 'advance', date: '2026-03-07', note: 'Avans — mart oyi' },
    { id: 'wp5', workerId: 'w4', amount: 500000, type: 'advance', date: '2026-03-08', note: 'Avans — mart oyi' },
    { id: 'wp6', workerId: 'w6', amount: 1200000, type: 'advance', date: '2026-03-05', note: 'Avans — mart oyi' },
    { id: 'wp7', workerId: 'w8', amount: 3000000, type: 'salary', date: '2026-03-10', note: 'Mart oyi to\'liq oylik' },
    { id: 'wp8', workerId: 'w10', amount: 3500000, type: 'salary', date: '2026-03-10', note: 'Mart oyi to\'liq oylik' },
    { id: 'wp9', workerId: 'w4', amount: 200000, type: 'penalty', date: '2026-03-12', note: 'Sifatsiz bo\'yash — qayta ishlash' },
    { id: 'wp10', workerId: 'w6', amount: 300000, type: 'bonus', date: '2026-03-15', note: 'HP-200 murakkab mexanik ish uchun' },
];

export const mockWorkerHistory: WorkerHistoryEvent[] = [
    { id: 'wh1', workerId: 'w1', type: 'joined', description: 'Ishga qabul qilindi', date: '2024-03-15' },
    { id: 'wh2', workerId: 'w1', type: 'task', description: 'HP-150 (#HP150-001) yig\'ishda ishtirok etdi', amount: 200000, date: '2026-03-01' },
    { id: 'wh3', workerId: 'w1', type: 'task', description: 'HP-150 Sport (#HP150S-001) yig\'ishda ishtirok etdi', amount: 200000, date: '2026-03-04' },
    { id: 'wh4', workerId: 'w1', type: 'payment', description: 'Avans oldi — mart oyi', amount: 1000000, date: '2026-03-05' },
    { id: 'wh5', workerId: 'w1', type: 'task', description: 'HP-125 (#HP125-002) yig\'ishda ishtirok etdi', amount: 200000, date: '2026-03-07' },
    { id: 'wh6', workerId: 'w1', type: 'task', description: 'HP-200 (#HP200-001) yig\'ishda ishtirok etdi', amount: 200000, date: '2026-03-08' },
    { id: 'wh7', workerId: 'w1', type: 'bonus', description: '3 ta motoni tez yig\'ish uchun bonus', amount: 500000, date: '2026-03-10' },
    { id: 'wh8', workerId: 'w1', type: 'task', description: 'HP-150 (#HP150-003) yig\'ishda ishtirok etdi', amount: 200000, date: '2026-03-16' },
    { id: 'wh9', workerId: 'w2', type: 'joined', description: 'Ishga qabul qilindi', date: '2024-01-10' },
    { id: 'wh10', workerId: 'w2', type: 'payment', description: 'Avans oldi — mart oyi', amount: 800000, date: '2026-03-06' },
    { id: 'wh11', workerId: 'w3', type: 'joined', description: 'Ishga qabul qilindi', date: '2024-02-20' },
    { id: 'wh12', workerId: 'w3', type: 'payment', description: 'Avans oldi — mart oyi', amount: 600000, date: '2026-03-07' },
    { id: 'wh13', workerId: 'w4', type: 'joined', description: 'Ishga qabul qilindi', date: '2024-04-01' },
    { id: 'wh14', workerId: 'w4', type: 'payment', description: 'Avans oldi — mart oyi', amount: 500000, date: '2026-03-08' },
    { id: 'wh15', workerId: 'w4', type: 'penalty', description: 'Sifatsiz bo\'yash — qayta ishlash', amount: 200000, date: '2026-03-12' },
    { id: 'wh16', workerId: 'w6', type: 'joined', description: 'Ishga qabul qilindi', date: '2023-11-05' },
    { id: 'wh17', workerId: 'w6', type: 'payment', description: 'Avans oldi — mart oyi', amount: 1200000, date: '2026-03-05' },
    { id: 'wh18', workerId: 'w6', type: 'bonus', description: 'HP-200 murakkab mexanik ish uchun', amount: 300000, date: '2026-03-15' },
    { id: 'wh19', workerId: 'w8', type: 'joined', description: 'Ishga qabul qilindi', date: '2024-01-01' },
    { id: 'wh20', workerId: 'w8', type: 'payment', description: 'Mart oyi to\'liq oylik', amount: 3000000, date: '2026-03-10' },
    { id: 'wh21', workerId: 'w10', type: 'joined', description: 'Ishga qabul qilindi', date: '2023-09-01' },
    { id: 'wh22', workerId: 'w10', type: 'payment', description: 'Mart oyi to\'liq oylik', amount: 3500000, date: '2026-03-10' },
    { id: 'wh23', workerId: 'w9', type: 'status_change', description: 'Ishdan bo\'shagan', date: '2025-12-01' },
];

export const mockCustomers: Customer[] = [
    { id: 'c1', name: 'Sultanov Anvar', phone: '+998901111111', address: 'Toshkent, Chilonzor', createdAt: '2026-02-15' },
    { id: 'c2', name: 'Hasanov Bobur', phone: '+998901111112', address: 'Samarqand', createdAt: '2026-02-20' },
    { id: 'c3', name: 'Yusupov Kamol', phone: '+998901111113', address: 'Buxoro', createdAt: '2026-03-01' },
    { id: 'c4', name: 'Olimov Doniyor', phone: '+998901111114', address: 'Andijon', createdAt: '2026-03-05' },
    { id: 'c5', name: 'Teshaboyev Rustam', phone: '+998901111115', address: "Farg'ona", createdAt: '2026-03-08' },
    { id: 'c6', name: 'Qurbonov Mahmud', phone: '+998901111116', address: 'Namangan', createdAt: '2026-03-10' },
    { id: 'c7', name: 'Po\'latov Laziz', phone: '+998901111117', address: 'Toshkent, Sergeli', createdAt: '2026-03-12' },
    { id: 'c8', name: 'Murodov Shuhrat', phone: '+998901111118', address: 'Jizzax', createdAt: '2026-03-14' },
    { id: 'c9', name: 'Xalilov Sanjar', phone: '+998901111119', address: 'Navoiy', createdAt: '2026-03-16' },
    { id: 'c10', name: 'Tursunov Aziz', phone: '+998901111120', address: 'Qashqadaryo', createdAt: '2026-03-18' },
];

export const mockOrders: Order[] = [
    { id: 'o1', customerId: 'c1', motoId: 'm1', price: 12500000, paymentStatus: 'paid', paidAmount: 12500000, date: '2026-03-10', shopId: 'sh1' },
    { id: 'o2', customerId: 'c2', motoId: 'm2', price: 10800000, paymentStatus: 'paid', paidAmount: 10800000, date: '2026-03-12', shopId: 'sh2' },
    { id: 'o3', customerId: 'c3', motoId: 'm3', price: 14200000, paymentStatus: 'partial', paidAmount: 10000000, date: '2026-03-15', shopId: 'sh1' },
    { id: 'o4', customerId: 'c4', motoId: 'm15', price: 9800000, paymentStatus: 'paid', paidAmount: 9800000, date: '2026-03-05', shopId: 'sh2' },
    { id: 'o5', customerId: 'c5', motoId: 'm16', price: 12500000, paymentStatus: 'paid', paidAmount: 12500000, date: '2026-03-08', shopId: 'sh1' },
    { id: 'o6', customerId: 'c6', motoId: 'm17', price: 16500000, paymentStatus: 'partial', paidAmount: 12000000, date: '2026-03-14', shopId: 'sh3' },
    { id: 'o7', customerId: 'c7', motoId: 'm4', price: 12500000, paymentStatus: 'unpaid', paidAmount: 0, date: '2026-03-20', notes: "Moto tayyor, mijoz kelishi kutilmoqda", shopId: 'sh1' },
    { id: 'o8', customerId: 'c8', motoId: 'm5', price: 10800000, paymentStatus: 'unpaid', paidAmount: 0, date: '2026-03-21', notes: "Moto tayyor, hujjatlar tayyorlanmoqda", shopId: 'sh2' },
];

export const mockTransactions: Transaction[] = [
    // Sotuvlar (kirimlar)
    { id: 't1', type: 'income', category: 'sale', amount: 12500000, description: 'HP-150 sotildi (#HP150-001)', date: '2026-03-10', method: 'transfer', status: 'completed', createdBy: 'Admin', relatedMotoId: 'm1', relatedOrderId: 'o1', note: 'Sultanov Anvarga sotildi' },
    { id: 't2', type: 'income', category: 'sale', amount: 10800000, description: 'HP-125 sotildi (#HP125-001)', date: '2026-03-12', method: 'cash', status: 'completed', createdBy: 'Admin', relatedMotoId: 'm2', relatedOrderId: 'o2', note: 'Hasanov Boburga sotildi' },
    { id: 't3', type: 'income', category: 'sale', amount: 14200000, description: 'HP-150 Sport sotildi (#HP150S-001)', date: '2026-03-15', method: 'transfer', status: 'pending', createdBy: 'Admin', relatedMotoId: 'm3', relatedOrderId: 'o3', note: 'Yusupov Kamol — qisman to\'langan' },
    { id: 't4', type: 'income', category: 'sale', amount: 9800000, description: 'HP-125 Eco sotildi (#HP125E-001)', date: '2026-03-05', method: 'cash', status: 'completed', createdBy: 'Admin', relatedMotoId: 'm15', relatedOrderId: 'o4' },
    { id: 't5', type: 'income', category: 'sale', amount: 12500000, description: 'HP-150 sotildi (#HP150-005)', date: '2026-03-08', method: 'card', status: 'completed', createdBy: 'Admin', relatedMotoId: 'm16', relatedOrderId: 'o5' },
    { id: 't6', type: 'income', category: 'sale', amount: 16500000, description: 'HP-200 sotildi (#HP200-004)', date: '2026-03-14', method: 'transfer', status: 'pending', createdBy: 'Admin', relatedMotoId: 'm17', relatedOrderId: 'o6', note: 'Qurbonov Mahmud — qisman to\'langan' },
    // Chiqimlar: detallar
    { id: 't7', type: 'expense', category: 'parts', amount: 5000000, description: 'Motor (150cc) - 2 dona', date: '2026-03-01', method: 'transfer', status: 'completed', createdBy: 'Mirzayev Otabek', relatedSupplierId: 's1', note: 'Xitoy Motor Group dan xarid' },
    { id: 't8', type: 'expense', category: 'parts', amount: 4400000, description: 'Motor (125cc) - 2 dona', date: '2026-03-01', method: 'transfer', status: 'completed', createdBy: 'Mirzayev Otabek', relatedSupplierId: 's1' },
    { id: 't9', type: 'expense', category: 'parts', amount: 1900000, description: 'Rama (150cc) - 2 dona', date: '2026-03-02', method: 'cash', status: 'completed', createdBy: 'Mirzayev Otabek', relatedSupplierId: 's1' },
    { id: 't10', type: 'expense', category: 'parts', amount: 1600000, description: 'Rama (125cc) - 2 dona', date: '2026-03-02', method: 'cash', status: 'completed', createdBy: 'Mirzayev Otabek', relatedSupplierId: 's1' },
    { id: 't11', type: 'expense', category: 'parts', amount: 2100000, description: 'G\'ildiraklar - 6 dona', date: '2026-03-03', method: 'transfer', status: 'completed', createdBy: 'Mirzayev Otabek', relatedSupplierId: 's2', note: 'Tashparts MChJ' },
    { id: 't12', type: 'expense', category: 'parts', amount: 1360000, description: 'Plastik kuzov - 2 komplekt', date: '2026-03-04', method: 'cash', status: 'completed', createdBy: 'Mirzayev Otabek', relatedSupplierId: 's3' },
    { id: 't13', type: 'expense', category: 'parts', amount: 900000, description: 'Tormoz tizimi - 2 komplekt', date: '2026-03-05', method: 'transfer', status: 'completed', createdBy: 'Mirzayev Otabek', relatedSupplierId: 's2' },
    { id: 't14', type: 'expense', category: 'parts', amount: 760000, description: 'Egzoz trubasi - 2 dona', date: '2026-03-06', method: 'cash', status: 'completed', createdBy: 'Mirzayev Otabek', relatedSupplierId: 's1' },
    // Chiqimlar: ish haqi
    { id: 't15', type: 'expense', category: 'salary', amount: 1000000, description: 'Avans: Abdullayev Jasur', date: '2026-03-05', method: 'cash', status: 'completed', createdBy: 'Admin', relatedWorkerId: 'w1', note: 'Mart oyi avans' },
    { id: 't16', type: 'expense', category: 'salary', amount: 3000000, description: 'Oylik: Ismoilov Jamshid', date: '2026-03-10', method: 'transfer', status: 'completed', createdBy: 'Admin', relatedWorkerId: 'w8', note: 'Mart oyi to\'liq oylik' },
    { id: 't17', type: 'expense', category: 'salary', amount: 3500000, description: 'Oylik: Mirzayev Otabek', date: '2026-03-10', method: 'transfer', status: 'completed', createdBy: 'Admin', relatedWorkerId: 'w10', note: 'Mart oyi to\'liq oylik' },
    // Boshqa chiqimlar
    { id: 't18', type: 'expense', category: 'other', amount: 500000, description: 'Elektr energiyasi', date: '2026-03-01', method: 'transfer', status: 'completed', createdBy: 'Admin', note: 'Oylik elektr to\'lovi' },
    { id: 't19', type: 'expense', category: 'other', amount: 300000, description: 'Transport xarajati', date: '2026-03-05', method: 'cash', status: 'completed', createdBy: 'Mirzayev Otabek', note: 'Detallarni olib kelish' },
    { id: 't20', type: 'expense', category: 'other', amount: 800000, description: 'Uskunalar ta\'miri', date: '2026-03-08', method: 'cash', status: 'completed', createdBy: 'Admin', note: 'Payvandlash apparati ta\'miri' },
    { id: 't21', type: 'expense', category: 'other', amount: 1200000, description: 'Ijara to\'lovi', date: '2026-03-01', method: 'transfer', status: 'completed', createdBy: 'Admin', note: 'Mart oyi sex ijarasi' },
    { id: 't22', type: 'income', category: 'other', amount: 500000, description: 'Eski detallar sotildi', date: '2026-03-07', method: 'cash', status: 'completed', createdBy: 'Mirzayev Otabek', note: 'Ishlatilmagan detallar utilizatsiyasi' },
    // Fevral oyi uchun
    { id: 't23', type: 'expense', category: 'parts', amount: 8500000, description: 'Fevral oylik detallar xaridi', date: '2026-02-15', method: 'transfer', status: 'completed', createdBy: 'Admin', relatedSupplierId: 's1' },
    { id: 't24', type: 'expense', category: 'salary', amount: 5800000, description: 'Fevral oylik ish haqi', date: '2026-02-28', method: 'transfer', status: 'completed', createdBy: 'Admin' },
    { id: 't25', type: 'income', category: 'sale', amount: 10800000, description: 'Fevral sotuv #1', date: '2026-02-20', method: 'cash', status: 'completed', createdBy: 'Admin' },
    { id: 't26', type: 'income', category: 'sale', amount: 12500000, description: 'Fevral sotuv #2', date: '2026-02-25', method: 'transfer', status: 'completed', createdBy: 'Admin' },
    { id: 't27', type: 'expense', category: 'other', amount: 1200000, description: 'Fevral ijara', date: '2026-02-01', method: 'transfer', status: 'completed', createdBy: 'Admin' },
    { id: 't28', type: 'expense', category: 'other', amount: 450000, description: 'Fevral elektr', date: '2026-02-01', method: 'transfer', status: 'completed', createdBy: 'Admin' },
    { id: 't29', type: 'income', category: 'sale', amount: 9800000, description: 'Fevral sotuv #3', date: '2026-02-10', method: 'cash', status: 'completed', createdBy: 'Admin' },
    { id: 't30', type: 'expense', category: 'parts', amount: 6200000, description: 'Fevral detallar xaridi #2', date: '2026-02-20', method: 'transfer', status: 'completed', createdBy: 'Admin', relatedSupplierId: 's2' },
];

export const mockSuppliers: Supplier[] = [
    { id: 's1', name: 'Xitoy Motor Group', phone: '+8613812345678', address: 'Guangzhou, China', debt: 15000000 },
    { id: 's2', name: 'Tashparts MChJ', phone: '+998901222333', address: 'Toshkent, Bektemir', debt: 3500000 },
    { id: 's3', name: 'Moto Aksessuar', phone: '+998901333444', address: "Toshkent, Sergeli", debt: 0 },
    { id: 's4', name: 'ElectroParts', phone: '+998901444555', address: 'Toshkent, Yakkasaroy', debt: 1200000 },
];

export const mockInventoryMovements: InventoryMovement[] = [
    { id: 'im1', partId: 'p1', type: 'incoming', quantity: 10, reason: 'Xarid', date: '2026-03-01', performedBy: 'Mirzayev Otabek' },
    { id: 'im2', partId: 'p17', type: 'incoming', quantity: 5, reason: 'Xarid', date: '2026-03-01', performedBy: 'Mirzayev Otabek' },
    { id: 'im3', partId: 'p1', type: 'outgoing', quantity: 1, reason: "HP-150 yig'ish (#HP150-001)", date: '2026-03-01', performedBy: 'Abdullayev Jasur' },
    { id: 'im4', partId: 'p3', type: 'outgoing', quantity: 1, reason: "HP-150 yig'ish (#HP150-001)", date: '2026-03-01', performedBy: 'Abdullayev Jasur' },
    { id: 'im5', partId: 'p17', type: 'outgoing', quantity: 1, reason: "HP-125 yig'ish (#HP125-001)", date: '2026-03-02', performedBy: 'Karimov Botir' },
    { id: 'im6', partId: 'p2', type: 'outgoing', quantity: 1, reason: "HP-125 yig'ish (#HP125-001)", date: '2026-03-02', performedBy: 'Karimov Botir' },
    { id: 'im7', partId: 'p4', type: 'incoming', quantity: 20, reason: 'Xarid', date: '2026-03-03', performedBy: 'Mirzayev Otabek' },
    { id: 'im8', partId: 'p5', type: 'incoming', quantity: 20, reason: 'Xarid', date: '2026-03-03', performedBy: 'Mirzayev Otabek' },
    { id: 'im9', partId: 'p16', type: 'incoming', quantity: 10, reason: 'Xarid', date: '2026-03-04', performedBy: 'Mirzayev Otabek' },
    { id: 'im10', partId: 'p9', type: 'incoming', quantity: 10, reason: 'Xarid', date: '2026-03-05', performedBy: 'Mirzayev Otabek' },
    { id: 'im11', partId: 'p19', type: 'incoming', quantity: 8, reason: 'Xarid', date: '2026-03-06', performedBy: 'Mirzayev Otabek' },
    { id: 'im12', partId: 'p1', type: 'outgoing', quantity: 1, reason: "HP-150 yig'ish (#HP150-002)", date: '2026-03-06', performedBy: 'Karimov Botir' },
];

export const productionChartData = [
    { name: '1-Mar', ishlab_chiqarish: 2, sotuv: 0 },
    { name: '5-Mar', ishlab_chiqarish: 1, sotuv: 1 },
    { name: '8-Mar', ishlab_chiqarish: 2, sotuv: 1 },
    { name: '10-Mar', ishlab_chiqarish: 1, sotuv: 2 },
    { name: '12-Mar', ishlab_chiqarish: 2, sotuv: 1 },
    { name: '15-Mar', ishlab_chiqarish: 3, sotuv: 2 },
    { name: '18-Mar', ishlab_chiqarish: 2, sotuv: 0 },
    { name: '20-Mar', ishlab_chiqarish: 1, sotuv: 1 },
    { name: '23-Mar', ishlab_chiqarish: 2, sotuv: 1 },
];

export const financeChartData = [
    { name: 'Yanvar', kirim: 28000000, chiqim: 22000000 },
    { name: 'Fevral', kirim: 33100000, chiqim: 22150000 },
    { name: 'Mart', kirim: 76800000, chiqim: 32510000 },
];

export const modelSalesData = [
    { name: 'HP-150', sotilgan: 3, foyda: 12900000 },
    { name: 'HP-125', sotilgan: 2, foyda: 7400000 },
    { name: 'HP-150 Sport', sotilgan: 1, foyda: 4700000 },
    { name: 'HP-200', sotilgan: 1, foyda: 5500000 },
    { name: 'HP-125 Eco', sotilgan: 1, foyda: 3300000 },
];
