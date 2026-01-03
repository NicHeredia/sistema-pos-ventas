import { useState } from "react";
import { ChartBar, TrendingUp, DollarSign, ShoppingCart, Minus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Sale } from "./PointOfSale";
import { Expense } from "./ExpenseManager";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface ReportsProps {
  sales: Sale[];
  expenses: Expense[];
}

export function Reports({ sales, expenses }: ReportsProps) {
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });

  const getMonthData = () => {
    const [year, month] = selectedMonth.split("-").map(Number);

    const monthSales = sales.filter((sale) => {
      const saleDate = new Date(sale.date);
      return (
        saleDate.getFullYear() === year && saleDate.getMonth() === month - 1
      );
    });

    const monthExpenses = expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      return (
        expenseDate.getFullYear() === year && expenseDate.getMonth() === month - 1
      );
    });

    return { monthSales, monthExpenses };
  };

  const { monthSales, monthExpenses } = getMonthData();

  // Check if expenses are available (not just empty array due to 404)
  const expensesAvailable = expenses.length > 0;

  const totalRevenue = monthSales.reduce((sum, sale) => sum + sale.total, 0);
  const totalExpenses = expensesAvailable ? monthExpenses.reduce((sum, expense) => sum + expense.amount, 0) : 0;
  const netProfit = expensesAvailable ? totalRevenue - totalExpenses : totalRevenue;
  const totalTransactions = monthSales.length;
  const averageTicket =
    totalTransactions > 0 ? totalRevenue / totalTransactions : 0;

  const totalItemsSold = monthSales.reduce(
    (sum, sale) =>
      sum + sale.items.reduce((itemSum, item) => itemSum + item.quantity, 0),
    0
  );

  // Daily sales data
  const getDailySalesData = () => {
    const dailyData: { [key: string]: number } = {};

    monthSales.forEach((sale) => {
      const day = new Date(sale.date).getDate();
      const dayStr = String(day).padStart(2, "0");
      dailyData[dayStr] = (dailyData[dayStr] || 0) + sale.total;
    });

    return Object.entries(dailyData)
      .map(([day, total]) => ({
        day: `Día ${day}`,
        total: parseFloat(total.toFixed(2)),
      }))
      .sort((a, b) => parseInt(a.day.split(" ")[1]) - parseInt(b.day.split(" ")[1]));
  };

  // Top products
  const getTopProducts = () => {
    const productSales: { [key: string]: { name: string; quantity: number; revenue: number } } = {};

    monthSales.forEach((sale) => {
      sale.items.forEach((item) => {
        if (!productSales[item.productId]) {
          productSales[item.productId] = {
            name: item.name,
            quantity: 0,
            revenue: 0,
          };
        }
        productSales[item.productId].quantity += item.quantity;
        productSales[item.productId].revenue += item.price * item.quantity;
      });
    });

    return Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);
  };

  // Payment method distribution
  const getPaymentMethodData = () => {
    const paymentData: { [key: string]: number } = {};

    monthSales.forEach((sale) => {
      paymentData[sale.paymentMethod] =
        (paymentData[sale.paymentMethod] || 0) + 1;
    });

    return Object.entries(paymentData).map(([method, count]) => ({
      method: method.charAt(0).toUpperCase() + method.slice(1),
      count,
    }));
  };

  // Expense categories data
  const getExpenseCategoriesData = () => {
    const categoryData: { [key: string]: number } = {};

    monthExpenses.forEach((expense) => {
      categoryData[expense.category] =
        (categoryData[expense.category] || 0) + expense.amount;
    });

    return Object.entries(categoryData).map(([category, amount]) => ({
      category,
      amount: parseFloat(amount.toFixed(2)),
    }));
  };

  const dailySalesData = getDailySalesData();
  const topProducts = getTopProducts();
  const paymentMethodData = getPaymentMethodData();
  const expenseCategoriesData = getExpenseCategoriesData();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="flex items-center gap-2">
          <ChartBar className="h-6 w-6" />
          Reportes y Estadísticas
        </h2>
        <p className="text-muted-foreground">
          Analiza el rendimiento de tu negocio
        </p>
      </div>

      {/* Month Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Seleccionar Período</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-w-xs">
            <Label htmlFor="month">Mes</Label>
            <Input
              id="month"
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Ingresos</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Ventas del mes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Gastos</CardTitle>
            <Minus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">
              {expensesAvailable ? `$${totalExpenses.toFixed(2)}` : "N/A"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {expensesAvailable ? "Gastos del mes" : "Datos no disponibles"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Ganancia Neta</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl ${expensesAvailable && netProfit >= 0 ? 'text-green-600' : 'text-blue-600'}`}>
              ${netProfit.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {expensesAvailable ? "Ingresos - Gastos" : "Ingresos (gastos no disponibles)"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Transacciones</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{totalTransactions}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Número de ventas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Ticket Promedio</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">${averageTicket.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Por transacción
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Items Vendidos</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{totalItemsSold}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Unidades totales
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      {monthSales.length > 0 || (expensesAvailable && monthExpenses.length > 0) ? (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Ventas Diarias</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dailySalesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip
                    formatter={(value: number) => `$${value.toFixed(2)}`}
                  />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top 10 Productos</CardTitle>
              </CardHeader>
              <CardContent>
                {topProducts.length > 0 ? (
                  <div className="space-y-3">
                    {topProducts.map((product, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div>
                          <p>{product.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {product.quantity} unidades
                          </p>
                        </div>
                        <p>${product.revenue.toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    No hay datos de productos
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Gastos por Categoría</CardTitle>
              </CardHeader>
              <CardContent>
                {expensesAvailable && expenseCategoriesData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={expenseCategoriesData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="amount"
                        label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}
                      >
                        {expenseCategoriesData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={`hsl(${index * 45}, 70%, 50%)`} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    Datos de gastos no disponibles
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Métodos de Pago</CardTitle>
              </CardHeader>
              <CardContent>
                {paymentMethodData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={paymentMethodData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="method" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="hsl(var(--primary))" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    No hay datos de métodos de pago
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ingresos vs Gastos</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={[
                    { name: 'Ingresos', amount: totalRevenue, color: '#10b981' },
                    ...(expensesAvailable ? [
                      { name: 'Gastos', amount: totalExpenses, color: '#ef4444' },
                      { name: 'Ganancia Neta', amount: Math.max(0, netProfit), color: netProfit >= 0 ? '#3b82f6' : '#ef4444' }
                    ] : [])
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                    <Bar dataKey="amount" fill="#8884d8">
                      {[
                        { name: 'Ingresos', amount: totalRevenue, color: '#10b981' },
                        ...(expensesAvailable ? [
                          { name: 'Gastos', amount: totalExpenses, color: '#ef4444' },
                          { name: 'Ganancia Neta', amount: Math.max(0, netProfit), color: netProfit >= 0 ? '#3b82f6' : '#ef4444' }
                        ] : [])
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ChartBar className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              No hay ventas registradas para el mes seleccionado
            </p>
            {!expensesAvailable && (
              <p className="text-sm text-muted-foreground mt-2">
                Los datos de gastos estarán disponibles próximamente
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
