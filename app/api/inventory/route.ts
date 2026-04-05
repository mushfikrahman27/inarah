import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const INVENTORY_PATH = path.join(process.cwd(), "data", "inventory.json");

function getInventory() {
  if (!fs.existsSync(INVENTORY_PATH)) {
    const dir = path.dirname(INVENTORY_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(INVENTORY_PATH, JSON.stringify({}), "utf8");
  }
  return JSON.parse(fs.readFileSync(INVENTORY_PATH, "utf8"));
}

function saveInventory(data: any) {
  fs.writeFileSync(INVENTORY_PATH, JSON.stringify(data, null, 2), "utf8");
}

export async function GET() {
  const inventory = getInventory();
  return NextResponse.json(inventory);
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { productId, stock, isHidden } = body;

    if (!productId) {
      return NextResponse.json({ success: false, error: "Missing productId" }, { status: 400 });
    }

    const inventory = getInventory();
    
    if (!inventory[productId]) {
      inventory[productId] = { stock: 0, isHidden: false };
    }

    if (stock !== undefined) {
      inventory[productId].stock = stock;
    }

    if (isHidden !== undefined) {
      inventory[productId].isHidden = isHidden;
    }

    saveInventory(inventory);

    return NextResponse.json({ success: true, inventory: inventory[productId] });
  } catch (error) {
    console.error("Failed to update inventory:", error);
    return NextResponse.json({ success: false, error: "Failed to update inventory" }, { status: 500 });
  }
}
