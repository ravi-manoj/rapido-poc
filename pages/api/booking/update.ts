// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { SupabaseClient, createClient } from "@supabase/supabase-js";

async function updateBooking(
  supabaseClient: SupabaseClient,
  bookingId: string,
  status: string
) {
  const { data, error } = await supabaseClient
    .from("booking")
    .update({ status })
    .eq("id", bookingId)
    .select();

  if (error) throw error;
  return data;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { bookingId, status } = req.query;
    if (!bookingId) throw new Error("Invalid bookingId");
    const supabaseClient = createClient(
      "https://aifpcjrukyklkjunvhsy.supabase.co",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpZnBjanJ1a3lrbGtqdW52aHN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODYxMjU1NDcsImV4cCI6MjAwMTcwMTU0N30.cY-mE_hTRz7Aaq-IdxUOCIhZAmyyJFZjh1vc1zQFeZk"
    );
    const data = await updateBooking(
      supabaseClient,
      bookingId as string,
      status as string
    );
    res.status(200).json({ status: " data updated ", data });
  } catch (error) {
    res.status(400).json({ res: 0, status: " data not found ", error });
  }
}
