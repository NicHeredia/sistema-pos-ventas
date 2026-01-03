import { useState, useEffect } from "react";
import { projectId, publicAnonKey } from "../../../utils/supabase/info";
import { Product } from "../components/ProductsManager";
import { Sale } from "../components/PointOfSale";
import { Expense } from "../components/ExpenseManager";

const API_BASE = `https://${projectId}.supabase.co/functions/v1/api`;

interface UseSupabaseDataReturn {
  products: Product[];
  sales: Sale[];
  expenses: Expense[];
  isLoading: boolean;
  error: string | null;
  addProduct: (product: Omit<Product, "id">) => Promise<void>;
  editProduct: (id: string, product: Omit<Product, "id">) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addSale: (sale: Omit<Sale, "id">) => Promise<void>;
  deleteSale: (id: string) => Promise<void>;
  addExpense: (expense: Omit<Expense, "id">) => Promise<void>;
  editExpense: (id: string, expense: Omit<Expense, "id">) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  refetch: () => Promise<void>;
}

export function useSupabaseData(): UseSupabaseDataReturn {
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    console.log("Starting fetchData...");
    setIsLoading(true);
    setError(null);

    try {
      // Fetch products
      console.log("Fetching products...");
      const productsResponse = await fetch(`${API_BASE}/products`, {
        headers: {
          Authorization: `Bearer ${publicAnonKey}`,
        },
      });

      console.log("Products response status:", productsResponse.status);
      if (!productsResponse.ok) {
        throw new Error(`Failed to fetch products: ${productsResponse.status} ${productsResponse.statusText}`);
      }

      const productsData = await productsResponse.json();
      console.log("Products data received");
      setProducts(productsData.products || []);

      // Fetch sales
      console.log("Fetching sales...");
      const salesResponse = await fetch(`${API_BASE}/sales`, {
        headers: {
          Authorization: `Bearer ${publicAnonKey}`,
        },
      });

      console.log("Sales response status:", salesResponse.status);
      if (!salesResponse.ok) {
        throw new Error(`Failed to fetch sales: ${salesResponse.status} ${salesResponse.statusText}`);
      }

      const salesData = await salesResponse.json();
      console.log("Sales data received");
      
      // Convert date strings back to Date objects - REMOVED, now date is string
      setSales(salesData.sales || []);

      // Fetch expenses (optional - don't fail if this fails)
      console.log("Fetching expenses...");
      try {
        const expensesResponse = await fetch(`${API_BASE}/expenses`, {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        });

        console.log("Expenses response status:", expensesResponse.status);
        if (expensesResponse.ok) {
          const expensesData = await expensesResponse.json();
          console.log("Expenses data received");
          
          // Convert date strings back to Date objects - REMOVED, now date is string
          setExpenses(expensesData.expenses || []);
        } else {
          console.warn("Failed to fetch expenses, setting empty array:", expensesResponse.status, expensesResponse.statusText);
          setExpenses([]);
        }
      } catch (expenseError) {
        console.warn("Error fetching expenses, setting empty array:", expenseError);
        setExpenses([]);
      }

      console.log("fetchData completed successfully");

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      console.error("Error fetching data:", errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
      console.log("fetchData finished, isLoading set to false");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addProduct = async (product: Omit<Product, "id">) => {
    try {
      const response = await fetch(`${API_BASE}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify(product),
      });

      if (!response.ok) {
        throw new Error(`Failed to create product: ${response.statusText}`);
      }

      const data = await response.json();
      setProducts((prev) => [...prev, data.product]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      console.error("Error creating product:", errorMessage);
      throw err;
    }
  };

  const editProduct = async (id: string, product: Omit<Product, "id">) => {
    try {
      const response = await fetch(`${API_BASE}/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify(product),
      });

      if (!response.ok) {
        throw new Error(`Failed to update product: ${response.statusText}`);
      }

      const data = await response.json();
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? data.product : p))
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      console.error("Error updating product:", errorMessage);
      throw err;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE}/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${publicAnonKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete product: ${response.statusText}`);
      }

      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      console.error("Error deleting product:", errorMessage);
      throw err;
    }
  };

  const addSale = async (sale: Omit<Sale, "id">) => {
    try {
      const response = await fetch(`${API_BASE}/sales`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify(sale),
      });

      if (!response.ok) {
        throw new Error(`Failed to create sale: ${response.statusText}`);
      }

      const data = await response.json();
      const saleWithDate = {
        ...data.sale,
      };
      setSales((prev) => [...prev, saleWithDate]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      console.error("Error creating sale:", errorMessage);
      throw err;
    }
  };

  const deleteSale = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE}/sales/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${publicAnonKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete sale: ${response.statusText}`);
      }

      setSales((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      console.error("Error deleting sale:", errorMessage);
      throw err;
    }
  };

  const addExpense = async (expense: Omit<Expense, "id">) => {
    try {
      const response = await fetch(`${API_BASE}/expenses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify(expense),
      });

      if (!response.ok) {
        throw new Error(`Failed to create expense: ${response.statusText}`);
      }

      const data = await response.json();
      const expenseWithDate = {
        ...data.expense,
      };
      setExpenses((prev) => [...prev, expenseWithDate]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      console.error("Error creating expense:", errorMessage);
      throw err;
    }
  };

  const editExpense = async (id: string, expense: Omit<Expense, "id">) => {
    try {
      const response = await fetch(`${API_BASE}/expenses/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify(expense),
      });

      if (!response.ok) {
        throw new Error(`Failed to update expense: ${response.statusText}`);
      }

      const data = await response.json();
      setExpenses((prev) =>
        prev.map((e) => (e.id === id ? { ...data.expense } : e))
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      console.error("Error updating expense:", errorMessage);
      throw err;
    }
  };

  const deleteExpense = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE}/expenses/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${publicAnonKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete expense: ${response.statusText}`);
      }

      setExpenses((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      console.error("Error deleting expense:", errorMessage);
      throw err;
    }
  };

  return {
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
    refetch: fetchData,
  };
}
