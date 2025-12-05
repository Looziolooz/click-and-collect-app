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
      // Imposta il cookie di sessione sicuro
      cookies().set("admin_session", "true", {
        httpOnly: true, // Non accessibile da JavaScript lato client (sicurezza)
        secure: process.env.NODE_ENV === "production", // Solo HTTPS in produzione
        maxAge: 60 * 60 * 24, // Scade tra 24 ore
        path: "/", // Valido per tutto il sito
        sameSite: "strict"
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Utente o password errati" }, { status: 401 });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Errore interno del server" }, { status: 500 });
  }
}