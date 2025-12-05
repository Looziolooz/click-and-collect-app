import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // --- CREDENZIALI AMMINISTRATORE ---
    const ADMIN_USER = "vincenzo";
    const ADMIN_PASS = "pesce2024";

    if (username === ADMIN_USER && password === ADMIN_PASS) {
      // Imposta il cookie di sessione
      cookies().set("admin_session", "true", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24, // 24 ore
        path: "/",
        sameSite: "lax"
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Utente o password errati" }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: "Errore interno del server" }, { status: 500 });
  }
}