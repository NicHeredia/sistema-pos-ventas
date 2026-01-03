import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.ts";

const app = new Hono();

// Middleware
app.use("*", cors());
app.use("*", logger(console.log));

// Health check
app.get("/health", (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ==================== PRODUCTS ====================

// Get all products
app.get("/products", async (c) => {
  try {
    const products = await kv.getByPrefix("product:");
    return c.json({ products: products || [] });
  } catch (error) {
    console.log("Error fetching products:", error);
    return c.json({ error: "Failed to fetch products" }, 500);
  }
});

// Create product
app.post("/products", async (c) => {
  try {
    const body = await c.req.json();
    const { name, price, category, stock } = body;

    if (!name || price === undefined) {
      return c.json({ error: "Name and price are required" }, 400);
    }

    const id = Date.now().toString();
    const product = {
      id,
      name,
      price: parseFloat(price),
      category: category || undefined,
      stock: stock !== undefined ? parseInt(stock) : undefined,
    };

    await kv.set(`product:${id}`, product);
    return c.json({ product }, 201);
  } catch (error) {
    console.log("Error creating product:", error);
    return c.json({ error: "Failed to create product" }, 500);
  }
});

// Update product
app.put("/products/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    const { name, price, category, stock } = body;

    if (!name || price === undefined) {
      return c.json({ error: "Name and price are required" }, 400);
    }

    const product = {
      id,
      name,
      price: parseFloat(price),
      category: category || undefined,
      stock: stock !== undefined ? parseInt(stock) : undefined,
    };

    await kv.set(`product:${id}`, product);
    return c.json({ product });
  } catch (error) {
    console.log("Error updating product:", error);
    return c.json({ error: "Failed to update product" }, 500);
  }
});

// Delete product
app.delete("/products/:id", async (c) => {
  try {
    const id = c.req.param("id");
    await kv.del(`product:${id}`);
    return c.json({ success: true });
  } catch (error) {
    console.log("Error deleting product:", error);
    return c.json({ error: "Failed to delete product" }, 500);
  }
});

// ==================== SALES ====================

// Get all sales
app.get("/sales", async (c) => {
  try {
    const sales = await kv.getByPrefix("sale:");
    return c.json({ sales: sales || [] });
  } catch (error) {
    console.log("Error fetching sales:", error);
    return c.json({ error: "Failed to fetch sales" }, 500);
  }
});

// Create sale
app.post("/sales", async (c) => {
  try {
    const body = await c.req.json();
    const { items, total, paymentMethod, customerName } = body;

    if (!items || items.length === 0 || total === undefined || !paymentMethod) {
      return c.json(
        { error: "Items, total, and paymentMethod are required" },
        400
      );
    }

    const id = Date.now().toString();
    const sale = {
      id,
      date: new Date().toISOString(),
      items,
      total: parseFloat(total),
      paymentMethod,
      customerName: customerName || undefined,
    };

    await kv.set(`sale:${id}`, sale);
    return c.json({ sale }, 201);
  } catch (error) {
    console.log("Error creating sale:", error);
    return c.json({ error: "Failed to create sale" }, 500);
  }
});

// Delete sale
app.delete("/sales/:id", async (c) => {
  try {
    const id = c.req.param("id");
    console.log("Deleting sale with id:", id);
    await kv.del(`sale:${id}`);
    console.log("Sale deleted successfully");
    return c.json({ success: true });
  } catch (error) {
    console.log("Error deleting sale:", error);
    return c.json({ error: "Failed to delete sale" }, 500);
  }
});

// ==================== EXPENSES ====================

// Get all expenses
app.get("/expenses", async (c) => {
  try {
    const expenses = await kv.getByPrefix("expense:");
    return c.json({ expenses: expenses || [] });
  } catch (error) {
    console.log("Error fetching expenses:", error);
    return c.json({ error: "Failed to fetch expenses" }, 500);
  }
});

// Create expense
app.post("/expenses", async (c) => {
  try {
    const body = await c.req.json();
    const { description, amount, category, date } = body;

    if (!description || amount === undefined || !category || !date) {
      return c.json(
        { error: "Description, amount, category, and date are required" },
        400
      );
    }

    const id = Date.now().toString();
    const expense = {
      id,
      description,
      amount: parseFloat(amount),
      category,
      date,
    };

    await kv.set(`expense:${id}`, expense);
    return c.json({ expense }, 201);
  } catch (error) {
    console.log("Error creating expense:", error);
    return c.json({ error: "Failed to create expense" }, 500);
  }
});

// Update expense
app.put("/expenses/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    const { description, amount, category, date } = body;

    if (!description || amount === undefined || !category || !date) {
      return c.json(
        { error: "Description, amount, category, and date are required" },
        400
      );
    }

    const expense = {
      id,
      description,
      amount: parseFloat(amount),
      category,
      date,
    };

    await kv.set(`expense:${id}`, expense);
    return c.json({ expense });
  } catch (error) {
    console.log("Error updating expense:", error);
    return c.json({ error: "Failed to update expense" }, 500);
  }
});

// Delete expense
app.delete("/expenses/:id", async (c) => {
  try {
    const id = c.req.param("id");
    await kv.del(`expense:${id}`);
    return c.json({ success: true });
  } catch (error) {
    console.log("Error deleting expense:", error);
    return c.json({ error: "Failed to delete expense" }, 500);
  }
});

Deno.serve(app.fetch);
