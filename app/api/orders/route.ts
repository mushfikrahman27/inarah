import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// A simple local file-based database for development before Firebase is completely wired up.
const DB_PATH = path.join(process.cwd(), "data", "orders.json");

function getOrders() {
  if (!fs.existsSync(DB_PATH)) {
    // Make sure data directory exists
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(DB_PATH, JSON.stringify([]), "utf8");
  }
  return JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
}

function saveOrders(orders: any) {
  fs.writeFileSync(DB_PATH, JSON.stringify(orders, null, 2), "utf8");
}

export async function GET() {
  const orders = getOrders();
  return NextResponse.json(orders);
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Generate an Order ID
    const orderId = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
    const newOrder = {
      id: orderId,
      ...data,
      status: "pending",
      createdAt: new Date().toISOString()
    };

    const orders = getOrders();
    orders.push(newOrder);
    saveOrders(orders);

    return NextResponse.json({ success: true, orderId, order: newOrder });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to process order" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { orderId, status } = body;

    const orders = getOrders();
    const orderIndex = orders.findIndex((o: any) => o.id === orderId);

    if (orderIndex === -1) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    const previousStatus = orders[orderIndex].status;
    orders[orderIndex].status = status;
    saveOrders(orders);

    // Auto-restock or deduct stock based on completion
    if (status === "completed" && previousStatus !== "completed") {
      try {
        const prodPath = path.join(process.cwd(), "data", "products.ts");
        let pContent = fs.readFileSync(prodPath, "utf-8");
        const items = orders[orderIndex].items || [];

        // Also update the local json override
        const invPath = path.join(process.cwd(), "data", "inventory.json");
        let inventory: any = {};
        if (fs.existsSync(invPath)) {
          inventory = JSON.parse(fs.readFileSync(invPath, "utf8"));
        }

        items.forEach((item: any) => {
          const pId = item.productId || item.id;
          const qty = item.quantity || 1;
          
          if (!inventory[pId]) inventory[pId] = { stock: 0 };
          
          // Match the block starting with id: pId up to the first stock: assignment, capturing prefix and value
          const regex = new RegExp(`(id:\\s*${pId}\\s*,[\\s\\S]*?stock:\\s*)(\\d+)`, 'g');
          pContent = pContent.replace(regex, (match, prefix, numStr) => {
            const newStock = Math.max(0, parseInt(numStr, 10) - qty);
            inventory[pId].stock = newStock;
            return `${prefix}${newStock}`;
          });
        });

        fs.writeFileSync(prodPath, pContent, "utf-8");
        fs.writeFileSync(invPath, JSON.stringify(inventory, null, 2), "utf8");
      } catch (err) {
        console.error("Failed to update stock in products.ts", err);
      }
    }

    return NextResponse.json({ success: true, order: orders[orderIndex] });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update order status" }, { status: 500 });
  }
}
