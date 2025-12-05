import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  // Cancella il cookie di sessione
  cookies().delete("admin_session");

  return NextResponse.json({ success: true });
}