import { NextResponse } from "next/server";
import { getSettings, getDeliveryZones, getPickupLocations } from "@/lib/data";

export async function GET() {
  const [settings, zones, pickupLocations] = await Promise.all([
    getSettings(),
    getDeliveryZones(),
    getPickupLocations(),
  ]);
  return NextResponse.json({ settings, zones, pickupLocations });
}
