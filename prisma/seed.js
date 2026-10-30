const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

const defaultExpenseCategories = [
  { name: "Makanan & Minuman", icon: "Utensils", color: "#EF4444", type: "EXPENSE" },
  { name: "Transportasi", icon: "Car", color: "#3B82F6", type: "EXPENSE" },
  { name: "Belanja", icon: "ShoppingBag", color: "#EC4899", type: "EXPENSE" },
  { name: "Hiburan", icon: "Film", color: "#8B5CF6", type: "EXPENSE" },
  { name: "Pendidikan", icon: "GraduationCap", color: "#06B6D4", type: "EXPENSE" },
  { name: "Kesehatan", icon: "HeartPulse", color: "#10B981", type: "EXPENSE" },
  { name: "Tagihan & Utilitas", icon: "Receipt", color: "#F59E0B", type: "EXPENSE" },
  { name: "Kebutuhan Pribadi", icon: "Sparkles", color: "#6366F1", type: "EXPENSE" },
  { name: "Langganan", icon: "Tv", color: "#D946EF", type: "EXPENSE" },
  { name: "Pengeluaran Lainnya", icon: "MoreHorizontal", color: "#64748B", type: "EXPENSE" },
];

const defaultIncomeCategories = [
  { name: "Gaji Pokok", icon: "Briefcase", color: "#10B981", type: "INCOME" },
  { name: "Bisnis / Usaha", icon: "Building", color: "#3B82F6", type: "INCOME" },
  { name: "Freelance / Proyek", icon: "Laptop", color: "#8B5CF6", type: "INCOME" },
  { name: "Uang Saku / Tunjangan", icon: "Wallet", color: "#F59E0B", type: "INCOME" },
  { name: "Hasil Investasi", icon: "TrendingUp", color: "#06B6D4", type: "INCOME" },
  { name: "Pemasukan Lainnya", icon: "PlusCircle", color: "#64748B", type: "INCOME" },
];

async function main() {
  console.log("🌱 Starting database seeding...");

  // Seed global default categories (userId: null)
  for (const cat of [...defaultExpenseCategories, ...defaultIncomeCategories]) {
    const existing = await prisma.category.findFirst({
      where: { name: cat.name, userId: null },
    });
    if (!existing) {
      await prisma.category.create({
        data: {
          name: cat.name,
          icon: cat.icon,
          color: cat.color,
          type: cat.type,
          isDefault: true,
          userId: null,
        },
      });
    }
  }

  // Create demo user
  const demoEmail = "demo@aturduitlu.com";
  let demoUser = await prisma.user.findUnique({
    where: { email: demoEmail },
  });

  const hashedPassword = await bcrypt.hash("password123", 10);

  if (!demoUser) {
    demoUser = await prisma.user.create({
      data: {
        name: "Alex Pratama",
        email: demoEmail,
        password: hashedPassword,
        settings: {
          create: {
            startingBalance: 5000000,
            currency: "IDR",
            timezone: "Asia/Jakarta",
            theme: "light",
            notifyBudgetAlert: true,
            notifyGoalMilestone: true,
            notifyDailyReminder: true,
          },
        },
      },
    });
    console.log(`👤 Created demo user: ${demoEmail} (Password: password123)`);
  }

  // Ensure demo user has user-specific categories linked or can use global ones
  const categories = await prisma.category.findMany({
    where: { OR: [{ userId: null }, { userId: demoUser.id }] },
  });

  const foodCat = categories.find((c) => c.name === "Makanan & Minuman");
  const transportCat = categories.find((c) => c.name === "Transportasi");
  const shoppingCat = categories.find((c) => c.name === "Belanja");
  const billsCat = categories.find((c) => c.name === "Tagihan & Utilitas");
  const entertainmentCat = categories.find((c) => c.name === "Hiburan");
  const salaryCat = categories.find((c) => c.name === "Gaji Pokok");
  const freelanceCat = categories.find((c) => c.name === "Freelance / Proyek");
  const investmentCat = categories.find((c) => c.name === "Hasil Investasi");

  // Seed sample transactions for demo user if none exist
  const txCount = await prisma.transaction.count({
    where: { userId: demoUser.id },
  });

  if (txCount === 0) {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    const sampleTransactions = [
      // Income
      {
        name: "Gaji Bulanan Oktober",
        amount: 8500000,
        type: "INCOME",
        categoryId: salaryCat.id,
        transactionDate: new Date(currentYear, currentMonth, 1, 9, 0),
        paymentMethod: "Bank Transfer",
        notes: "Gaji bulan berjalan dari PT Teknologi Cemerlang",
      },
      {
        name: "Honor Desain Landing Page",
        amount: 2500000,
        type: "INCOME",
        categoryId: freelanceCat.id,
        transactionDate: new Date(currentYear, currentMonth, 12, 14, 30),
        paymentMethod: "Bank Transfer",
        notes: "Proyek freelance UI/UX",
      },
      {
        name: "Dividen Saham BBCA",
        amount: 650000,
        type: "INCOME",
        categoryId: investmentCat.id,
        transactionDate: new Date(currentYear, currentMonth, 18, 10, 15),
        paymentMethod: "Bank Transfer",
        notes: "Hasil dividen kuartal 3",
      },
      // Expenses
      {
        name: "Makan Siang Resto Padang",
        amount: 35000,
        type: "EXPENSE",
        categoryId: foodCat.id,
        transactionDate: new Date(currentYear, currentMonth, now.getDate(), 12, 30),
        paymentMethod: "Cash",
        notes: "Nasi rendang + es teh",
      },
      {
        name: "Kopi & Snack Cafe",
        amount: 45000,
        type: "EXPENSE",
        categoryId: foodCat.id,
        transactionDate: new Date(currentYear, currentMonth, now.getDate() - 1, 16, 0),
        paymentMethod: "E-Wallet",
        notes: "Latte di Kopi Kenangan via QRIS",
      },
      {
        name: "Isi Bensin Pertamax",
        amount: 150000,
        type: "EXPENSE",
        categoryId: transportCat.id,
        transactionDate: new Date(currentYear, currentMonth, now.getDate() - 2, 8, 15),
        paymentMethod: "E-Wallet",
        notes: "Full tank motor & mobil",
      },
      {
        name: "Belanja Bulanan Supermarket",
        amount: 780000,
        type: "EXPENSE",
        categoryId: shoppingCat.id,
        transactionDate: new Date(currentYear, currentMonth, 5, 19, 0),
        paymentMethod: "Credit Card",
        notes: "Kebutuhan pokok beras minyak sayur",
      },
      {
        name: "Tagihan Listrik PLN & Air PDAM",
        amount: 420000,
        type: "EXPENSE",
        categoryId: billsCat.id,
        transactionDate: new Date(currentYear, currentMonth, 7, 10, 0),
        paymentMethod: "Bank Transfer",
        notes: "Pembayaran utilitas rumah",
      },
      {
        name: "Internet Indihome Fiber",
        amount: 350000,
        type: "EXPENSE",
        categoryId: billsCat.id,
        transactionDate: new Date(currentYear, currentMonth, 10, 11, 0),
        paymentMethod: "Bank Transfer",
        notes: "Langganan internet 50 Mbps",
      },
      {
        name: "Nonton Bioskop XXI & Popcorn",
        amount: 140000,
        type: "EXPENSE",
        categoryId: entertainmentCat.id,
        transactionDate: new Date(currentYear, currentMonth, 15, 20, 0),
        paymentMethod: "E-Wallet",
        notes: "Weekend movie",
      },
      {
        name: "Makan Malam Bersama Keluarga",
        amount: 380000,
        type: "EXPENSE",
        categoryId: foodCat.id,
        transactionDate: new Date(currentYear, currentMonth, 22, 19, 30),
        paymentMethod: "E-Wallet",
        notes: "Seafood dinner",
      },
      {
        name: "Beli Kemeja & Celana Kerja",
        amount: 450000,
        type: "EXPENSE",
        categoryId: shoppingCat.id,
        transactionDate: new Date(currentYear, currentMonth, 24, 15, 0),
        paymentMethod: "Credit Card",
        notes: "Diskon Uniqlo",
      },
    ];

    for (const tx of sampleTransactions) {
      await prisma.transaction.create({
        data: {
          ...tx,
          userId: demoUser.id,
        },
      });
    }
    console.log(`💳 Created ${sampleTransactions.length} sample transactions.`);
  }

  // Seed sample Budgets
  const budgetCount = await prisma.budget.count({
    where: { userId: demoUser.id },
  });
  if (budgetCount === 0) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    await prisma.budget.create({
      data: {
        userId: demoUser.id,
        categoryId: null, // Overall monthly budget
        amount: 3500000,
        periodType: "MONTHLY",
        startDate: startOfMonth,
        endDate: endOfMonth,
      },
    });

    if (foodCat) {
      await prisma.budget.create({
        data: {
          userId: demoUser.id,
          categoryId: foodCat.id,
          amount: 1500000,
          periodType: "MONTHLY",
          startDate: startOfMonth,
          endDate: endOfMonth,
        },
      });
    }

    if (shoppingCat) {
      await prisma.budget.create({
        data: {
          userId: demoUser.id,
          categoryId: shoppingCat.id,
          amount: 1000000,
          periodType: "MONTHLY",
          startDate: startOfMonth,
          endDate: endOfMonth,
        },
      });
    }
    console.log("📊 Created sample budgets.");
  }

  // Seed sample Savings Goals (matches Monex reference: New Bike, iPhone 15 Pro, Rumah Impian)
  const goalCount = await prisma.savingsGoal.count({
    where: { userId: demoUser.id },
  });
  if (goalCount === 0) {
    const bikeGoal = await prisma.savingsGoal.create({
      data: {
        userId: demoUser.id,
        name: "Sepeda Roadbike Polygon",
        targetAmount: 6000000,
        currentAmount: 3500000,
        contributionType: "MONTHLY",
        deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 3 months
        icon: "Bike",
        color: "#1E5BF6",
        contributions: {
          create: [
            {
              userId: demoUser.id,
              amount: 2000000,
              contributionDate: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000),
              notes: "Tabungan awal",
            },
            {
              userId: demoUser.id,
              amount: 1500000,
              contributionDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
              notes: "Setoran rutin bulan ini",
            },
          ],
        },
      },
    });

    await prisma.savingsGoal.create({
      data: {
        userId: demoUser.id,
        name: "iPhone 16 Pro Max",
        targetAmount: 22000000,
        currentAmount: 16500000,
        contributionType: "MONTHLY",
        deadline: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000),
        icon: "Smartphone",
        color: "#8B5CF6",
        contributions: {
          create: [
            {
              userId: demoUser.id,
              amount: 10000000,
              contributionDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
              notes: "Alokasi THR",
            },
            {
              userId: demoUser.id,
              amount: 6500000,
              contributionDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
              notes: "Bonus proyek freelance",
            },
          ],
        },
      },
    });

    await prisma.savingsGoal.create({
      data: {
        userId: demoUser.id,
        name: "Dana Darurat 6 Bulan",
        targetAmount: 30000000,
        currentAmount: 15000000,
        contributionType: "MONTHLY",
        deadline: new Date(Date.now() + 300 * 24 * 60 * 60 * 1000),
        icon: "ShieldCheck",
        color: "#10B981",
        contributions: {
          create: [
            {
              userId: demoUser.id,
              amount: 15000000,
              contributionDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
              notes: "Pindahan deposito",
            },
          ],
        },
      },
    });
    console.log("🎯 Created sample savings goals & contributions.");
  }

  // Seed sample Notifications
  const notifCount = await prisma.notification.count({
    where: { userId: demoUser.id },
  });
  if (notifCount === 0) {
    await prisma.notification.createMany({
      data: [
        {
          userId: demoUser.id,
          title: "Peringatan Anggaran Makanan",
          message: "Pengeluaran Makanan & Minuman sudah mencapai 68% dari batas anggaran bulan ini.",
          type: "BUDGET_WARNING",
          isRead: false,
          createdAt: new Date(),
        },
        {
          userId: demoUser.id,
          title: "Target Tabungan Tercapai 75%",
          message: "Selamat! Tabungan iPhone 16 Pro Max kamu sudah mencapai Rp 16.500.000 (75%).",
          type: "GOAL_MILESTONE",
          isRead: false,
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
        {
          userId: demoUser.id,
          title: "Pengingat Catat Transaksi",
          message: "Jangan lupa mencatat pengeluaran harianmu untuk menjaga akurasi anggaran.",
          type: "REMINDER",
          isRead: true,
          createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
        },
      ],
    });
    console.log("🔔 Created sample notifications.");
  }

  console.log("✅ Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
