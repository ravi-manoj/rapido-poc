// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { SupabaseClient, createClient } from "@supabase/supabase-js";
interface User {
  id?: string;
  name: string;
  num: string;
  mail: string;
  aadhar: string;
  pos: string[];
}

async function createUser(supabaseClient: SupabaseClient, data: User) {
  const { error } = await supabaseClient.from("user").insert(data);
  if (error) throw error;
  return data;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const supabaseClient = createClient(
      "https://aifpcjrukyklkjunvhsy.supabase.co",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpZnBjanJ1a3lrbGtqdW52aHN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODYxMjU1NDcsImV4cCI6MjAwMTcwMTU0N30.cY-mE_hTRz7Aaq-IdxUOCIhZAmyyJFZjh1vc1zQFeZk"
    );
    const data = await createUser(supabaseClient, req.body);
    res.status(200).json({ status: " data inserted ", data });
  } catch (error) {
    res.status(400).json({ status: " data not inserted ", error });
  }
}
