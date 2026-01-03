// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from "jsr:@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
}

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const path = url.pathname

    // ==================== PRODUCTS ====================

    if (req.method === 'GET' && path.endsWith('/products')) {
      // Get all products
      const { data: products, error } = await supabase
        .from('kv_store_8590fbeb')
        .select('value')
        .like('key', 'product:%')

      if (error) throw error

      const formattedProducts = products?.map(item => item.value) || []
      return new Response(JSON.stringify({ products: formattedProducts }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    if (req.method === 'POST' && path.endsWith('/products')) {
      // Create product
      const body = await req.json()
      const { name, price, category, stock } = body

      if (!name || price === undefined) {
        return new Response(JSON.stringify({
          error: "Name and price are required"
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      const id = Date.now().toString()
      const product = {
        id,
        name,
        price: parseFloat(price),
        category: category || undefined,
        stock: stock !== undefined ? parseInt(stock) : undefined,
      }

      const { error } = await supabase
        .from('kv_store_8590fbeb')
        .upsert({ key: `product:${id}`, value: product })

      if (error) throw error

      return new Response(JSON.stringify({ product }), {
        status: 201,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    if (req.method === 'PUT' && path.includes('/products/')) {
      // Update product
      const id = path.split('/products/')[1]
      const body = await req.json()
      const { name, price, category, stock } = body

      if (!name || price === undefined) {
        return new Response(JSON.stringify({
          error: "Name and price are required"
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      const product = {
        id,
        name,
        price: parseFloat(price),
        category: category || undefined,
        stock: stock !== undefined ? parseInt(stock) : undefined,
      }

      const { error } = await supabase
        .from('kv_store_8590fbeb')
        .upsert({ key: `product:${id}`, value: product })

      if (error) throw error

      return new Response(JSON.stringify({ product }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    if (req.method === 'DELETE' && path.includes('/products/')) {
      // Delete product
      const id = path.split('/products/')[1]

      const { error } = await supabase
        .from('kv_store_8590fbeb')
        .delete()
        .eq('key', `product:${id}`)

      if (error) throw error

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // ==================== SALES ====================

    if (req.method === 'GET' && path.endsWith('/sales')) {
      // Get all sales
      const { data: sales, error } = await supabase
        .from('kv_store_8590fbeb')
        .select('value')
        .like('key', 'sale:%')

      if (error) throw error

      const formattedSales = sales?.map(item => item.value) || []
      return new Response(JSON.stringify({ sales: formattedSales }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    if (req.method === 'POST' && path.endsWith('/sales')) {
      // Create sale
      const body = await req.json()
      const { items, total, paymentMethod } = body

      if (!items || !Array.isArray(items) || items.length === 0 || total === undefined) {
        return new Response(JSON.stringify({
          error: "Items and total are required"
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      const id = Date.now().toString()
      const sale = {
        id,
        items,
        total: parseFloat(total),
        paymentMethod: paymentMethod || "cash",
        date: new Date().toISOString(),
      }

      const { error } = await supabase
        .from('kv_store_8590fbeb')
        .upsert({ key: `sale:${id}`, value: sale })

      if (error) throw error

      return new Response(JSON.stringify({ sale }), {
        status: 201,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    if (req.method === 'DELETE' && path.includes('/sales/')) {
      // Delete sale
      const id = path.split('/sales/')[1]

      const { error } = await supabase
        .from('kv_store_8590fbeb')
        .delete()
        .eq('key', `sale:${id}`)

      if (error) throw error

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // ==================== EXPENSES ====================

    if (req.method === 'GET' && path.endsWith('/expenses')) {
      // Get all expenses
      const { data: expenses, error } = await supabase
        .from('kv_store_8590fbeb')
        .select('value')
        .like('key', 'expense:%')

      if (error) throw error

      const formattedExpenses = expenses?.map(item => item.value) || []
      return new Response(JSON.stringify({ expenses: formattedExpenses }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    if (req.method === 'POST' && path.endsWith('/expenses')) {
      // Create expense
      const body = await req.json()
      const { description, amount, category, date } = body

      if (!description || amount === undefined || !category || !date) {
        return new Response(JSON.stringify({
          error: "Description, amount, category, and date are required"
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      const id = Date.now().toString()
      const expense = {
        id,
        description,
        amount: parseFloat(amount),
        category,
        date,
      }

      const { error } = await supabase
        .from('kv_store_8590fbeb')
        .upsert({ key: `expense:${id}`, value: expense })

      if (error) throw error

      return new Response(JSON.stringify({ expense }), {
        status: 201,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    if (req.method === 'PUT' && path.includes('/expenses/')) {
      // Update expense
      const id = path.split('/expenses/')[1]
      const body = await req.json()
      const { description, amount, category, date } = body

      if (!description || amount === undefined || !category || !date) {
        return new Response(JSON.stringify({
          error: "Description, amount, category, and date are required"
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      const expense = {
        id,
        description,
        amount: parseFloat(amount),
        category,
        date,
      }

      const { error } = await supabase
        .from('kv_store_8590fbeb')
        .upsert({ key: `expense:${id}`, value: expense })

      if (error) throw error

      return new Response(JSON.stringify({ expense }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    if (req.method === 'DELETE' && path.includes('/expenses/')) {
      // Delete expense
      const id = path.split('/expenses/')[1]

      const { error } = await supabase
        .from('kv_store_8590fbeb')
        .delete()
        .eq('key', `expense:${id}`)

      if (error) throw error

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    return new Response(JSON.stringify({ error: 'Not found' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Error:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/api' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
