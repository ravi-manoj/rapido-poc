// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { SupabaseClient, createClient } from "@supabase/supabase-js";

async function getVehicle(supabaseClient: SupabaseClient, id: string) {
  const { data, error } = await supabaseClient
    .from("vehicle")
    .select("*")
    .eq("id", id);
  if (error) throw error;
  return data;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { id } = req.query;
     if (id === null || id === undefined) throw new Error("Invalid Id");
    const supabaseClient = createClient(
      "https://aifpcjrukyklkjunvhsy.supabase.co",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpZnBjanJ1a3lrbGtqdW52aHN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODYxMjU1NDcsImV4cCI6MjAwMTcwMTU0N30.cY-mE_hTRz7Aaq-IdxUOCIhZAmyyJFZjh1vc1zQFeZk"
    );
    const data = await getVehicle(supabaseClient, id as string);
    res.status(200).json({
      status: "200",
      result: Object.keys(data).length === 0 ? 0 : 1,
      data,
    });
  } catch (error) {
    res.status(400).json({ res: 0, status: " data not found ", error });
  }
}
