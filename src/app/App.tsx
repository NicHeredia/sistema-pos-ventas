import { useState, useEffect } from "react";
import { Package, ShoppingCart, History, ChartBar, DollarSign } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { ProductsManager, Product } from "./components/ProductsManager";
import { PointOfSale, Sale } from "./components/PointOfSale";
import { SalesHistory } from "./components/SalesHistory";
import { Reports } from "./components/Reports";
import { ExpenseManager, Expense } from "./components/ExpenseManager";
import { toast } from "sonner";
import { Toaster } from "./components/ui/sonner";
import { useSupabaseData } from "./hooks/useSupabaseData";

function App() {
  const {
    products,
    sales,
    expenses,
    isLoading,
    error,
    addProduct,
    editProduct,
    deleteProduct,
    addSale,
    deleteSale,
    addExpense,
    editExpense,
    deleteExpense,
  } = useSupabaseData();
  
  const [activeTab, setActiveTab] = useState("pos");

  // Show error notification if there's an error loading data
  useEffect(() => {
    if (error && !isLoading) {
      console.warn("Data loading error:", error);
      toast.error(`Error al cargar algunos datos: ${error}`);
    }
  }, [error, isLoading]);

  // If there's an error loading data, show error but allow access to basic functionality
  if (error && !isLoading) {
    console.warn("Data loading error:", error);
    // Don't show error screen, just log it and continue with empty data
  }

  const handleAddProduct = async (product: Omit<Product, "id">) => {
    try {
      await addProduct(product);
      toast.success("Producto creado exitosamente");
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Error al crear el producto");
    }
  };

  const handleEditProduct = async (id: string, updatedProduct: Omit<Product, "id">) => {
    try {
      await editProduct(id, updatedProduct);
      toast.success("Producto actualizado exitosamente");
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Error al actualizar el producto");
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await deleteProduct(id);
      toast.success("Producto eliminado exitosamente");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Error al eliminar el producto");
    }
  };

  const handleCompleteSale = async (sale: Omit<Sale, "id">) => {
    try {
      await addSale(sale);
      toast.success("Venta completada exitosamente");
    } catch (error) {
      console.error("Error completing sale:", error);
      toast.error("Error al completar la venta");
    }
  };

  const handleDeleteSale = async (id: string) => {
    try {
      await deleteSale(id);
      toast.success("Venta eliminada exitosamente");
    } catch (error) {
      console.error("Error deleting sale:", error);
      toast.error("Error al eliminar la venta");
    }
  };

  const handleAddExpense = async (expense: Omit<Expense, "id">) => {
    try {
      await addExpense(expense);
      toast.success("Gasto agregado exitosamente");
    } catch (error) {
      console.error("Error adding expense:", error);
      toast.error("Error al agregar el gasto");
    }
  };

  const handleEditExpense = async (id: string, updatedExpense: Omit<Expense, "id">) => {
    try {
      await editExpense(id, updatedExpense);
      toast.success("Gasto actualizado exitosamente");
    } catch (error) {
      console.error("Error updating expense:", error);
      toast.error("Error al actualizar el gasto");
    }
  };

  const handleDeleteExpense = async (id: string) => {
    try {
      await deleteExpense(id);
      toast.success("Gasto eliminado exitosamente");
    } catch (error) {
      console.error("Error deleting expense:", error);
      toast.error("Error al eliminar el gasto");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite] mb-4"></div>
          <p className="text-muted-foreground">Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Toaster />
      
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
              <ShoppingCart className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1>Sistema POS</h1>
              <p className="text-sm text-muted-foreground">
                Punto de Venta para Pequeños Negocios
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="pos" className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              <span className="hidden sm:inline">Ventas</span>
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              <span className="hidden sm:inline">Productos</span>
            </TabsTrigger>
            <TabsTrigger value="expenses" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              <span className="hidden sm:inline">Gastos</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              <span className="hidden sm:inline">Historial</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <ChartBar className="h-4 w-4" />
              <span className="hidden sm:inline">Reportes</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pos">
            <PointOfSale
              products={products}
              onCompleteSale={handleCompleteSale}
            />
          </TabsContent>

          <TabsContent value="products">
            <ProductsManager
              products={products}
              onAddProduct={handleAddProduct}
              onEditProduct={handleEditProduct}
              onDeleteProduct={handleDeleteProduct}
            />
          </TabsContent>

          <TabsContent value="expenses">
            <ExpenseManager
              expenses={expenses}
              onAddExpense={handleAddExpense}
              onEditExpense={handleEditExpense}
              onDeleteExpense={handleDeleteExpense}
            />
          </TabsContent>

          <TabsContent value="history">
            <SalesHistory sales={sales} onDeleteSale={handleDeleteSale} />
          </TabsContent>

          <TabsContent value="reports">
            <Reports sales={sales} expenses={expenses} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

export default App;