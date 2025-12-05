import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // QUI DEFINISCI LE CREDENZIALI (lato server, quindi sicure)
    // In futuro potrai spostarle in variabili d'ambiente (.env)
    const ADMIN_USER = "vincenzo";
    const ADMIN_PASS = "pesce2024";

    if (username === ADMIN_USER && password === ADMIN_PASS) {
      // Se corretto, crea un cookie sicuro
      cookies().set("admin_session", "true", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24, // 24 ore
        path: "/",
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Credenziali non valide" }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: "Errore server" }, { status: 500 });
  }
}