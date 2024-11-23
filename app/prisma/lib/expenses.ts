import prisma from "./prisma";

// Fetch all expenses
export async function getExpenses() {
  return await prisma.expense.findMany();
}

// Create a new expense
export async function createExpense(data: { amount: number; title: string }) {
  return await prisma.expense.create({
    data,
  });
}
