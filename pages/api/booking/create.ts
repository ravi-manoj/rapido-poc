// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { SupabaseClient, createClient } from "@supabase/supabase-js";

const calcDis = (lat1: string, long1: string, lat2: string, long2: string) => {
  const dLat = Number(lat2) - Number(lat1);
  const dLong = Number(long2) - Number(long1);
  const a = Math.pow(dLat, 2) + Math.pow(dLong, 2);
  const c = Math.sqrt(a);
  // console.log({ lat1, lat2, long1, long2, c });
  return c; // output distance, in MILES
};
interface User {
  id?: string;
  name: string;
  num: string;
  mail: string;
  aadhar: string;
  pos: string[];
}
async function getUser(supabaseClient: SupabaseClient, phone: string) {
  const { data, error } = await supabaseClient
    .from("user")
    .select("*")
    .eq("num", phone);
  if (error) throw error;
  return data[0] as User;
}
async function getVehicles(
  supabaseClient: SupabaseClient,
  ids: string[],
  vehicleTypes: string[]
) {
  const { data, error } = await supabaseClient
    .from("vehicle")
    .select("*")
    .in("vendor_id", ids)
    .in("Bike Type", vehicleTypes)
    .eq("available", "TRUE");

  if (error) throw error;
  return data;
}
// deno-lint-ignore no-explicit-any
async function createBooking(supabaseClient: SupabaseClient, info: any) {
  const { data, error } = await supabaseClient
    .from("booking")
    .insert(info)
    .select();
  if (error) throw error;

  return data;
}

async function searchVendors(
  supabaseClient: SupabaseClient,
  lat: string,
  long: string,
  type: string,
  phone: string
) {
  const ids: string[] = [];
  const vehicleTypes: string[] = [];
  const { data, error } = await supabaseClient.from("vendor").select("*");
  if (error) throw error;
  data?.sort(
    (a, b) =>
      calcDis(a.Latitude, a.Longitude, lat, long) -
      calcDis(b.Latitude, b.Longitude, lat, long)
  );

  data.forEach((d) => {
    ids.push(d.id);
  });
  if (type == "1") {
    vehicleTypes.push("Scooter");
  } else if (type == "2") {
    vehicleTypes.push("Bike ");
  } else {
    vehicleTypes.push("Scooter");
    vehicleTypes.push("Bike ");
  }
  const vehicle = await getVehicles(
    supabaseClient,
    ids.length < 5 ? ids : ids.slice(0, 5),
    // ids,
    vehicleTypes
  );
  const customer = await getUser(supabaseClient, phone);
  const vehicleInfo = Promise.all(
    vehicle.map(async (d) => {
      const info = {
        customer_id: customer.id,
        vehicle_id: d.id,
        vendor_id: d.vendor_id,
        status: "pending",
      };
      const booking = await createBooking(supabaseClient, info);
      return { bookig_id: booking[0].id, ...d };
    })
  );
  return vehicleInfo;
}
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { lat, long, type, phone } = req.query;
    if (!lat || !long || !type || !phone)
      throw new Error("Invalid Location or type or phone");
    const supabaseClient = createClient(
      "https://aifpcjrukyklkjunvhsy.supabase.co",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpZnBjanJ1a3lrbGtqdW52aHN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODYxMjU1NDcsImV4cCI6MjAwMTcwMTU0N30.cY-mE_hTRz7Aaq-IdxUOCIhZAmyyJFZjh1vc1zQFeZk"
    );
    const data = await searchVendors(
      supabaseClient,
      lat as string,
      long as string,
      type as string,
      phone as string
    );
    res.status(200).json({ status: " data found ", length: data.length, data });
  } catch (error) {
    res.status(400).json({ res: 0, status: " data not found ", error });
  }
}
