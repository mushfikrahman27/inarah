import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const SETTINGS_PATH = path.join(process.cwd(), "data", "settings.json");

function getSettings() {
  if (!fs.existsSync(SETTINGS_PATH)) {
    const dir = path.dirname(SETTINGS_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(SETTINGS_PATH, JSON.stringify({ revenueAdjustment: 0 }), "utf8");
  }
  return JSON.parse(fs.readFileSync(SETTINGS_PATH, "utf8"));
}

function saveSettings(data: any) {
  fs.writeFileSync(SETTINGS_PATH, JSON.stringify(data, null, 2), "utf8");
}

export async function GET() {
  const settings = getSettings();
  return NextResponse.json(settings);
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const settings = getSettings();
    
    if (body.revenueAdjustment !== undefined) {
      settings.revenueAdjustment = body.revenueAdjustment;
    }

    saveSettings(settings);
    return NextResponse.json({ success: true, settings });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update settings" }, { status: 500 });
  }
}
