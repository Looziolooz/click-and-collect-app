"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User, Key, Loader2, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        // Redirect forzato per aggiornare i cookie nel middleware
        window.location.href = "/admin/dashboard";
      } else {
        const data = await res.json();
        setError(data.error || "Credenziali errate.");
      }
    } catch (err) {
      setError("Errore di connessione. Riprova.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-blue relative overflow-hidden">
      {/* Sfondo decorativo */}
      <div className="absolute inset-0 opacity-20">
         <Image 
            src="/assets/hero-vincenzo.png" 
            alt="Background" 
            fill 
            className="object-cover blur-sm"
            priority
         />
      </div>

      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-2xl z-10 mx-4 border-t-4 border-brand-yellow relative">
        <div className="text-center mb-8">
          <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-brand-blue/10">
            <Lock className="h-8 w-8 text-brand-blue" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-brand-blue-dark">Area Riservata</h1>
          <p className="text-gray-500 text-sm mt-1">Pannello di controllo Fresco&Fresco</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Utente</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                required
                autoFocus
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-all text-gray-800 bg-gray-50 focus:bg-white"
                placeholder="Inserisci username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Password</label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="password"
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-all text-gray-800 bg-gray-50 focus:bg-white"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg text-center font-medium animate-pulse border border-red-100 flex items-center justify-center gap-2">
              <span className="h-2 w-2 rounded-full bg-red-600 inline-block"></span> {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-brand-blue text-white py-3.5 rounded-xl font-bold hover:bg-brand-blue-light transition-all shadow-lg hover:shadow-xl disabled:opacity-70 flex items-center justify-center gap-2 active:scale-95"
          >
            {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : "Accedi al Pannello"}
          </button>
        </form>
        
        <div className="mt-8 text-center pt-6 border-t border-gray-100">
            <Link href="/" className="inline-flex items-center text-sm text-gray-400 hover:text-brand-blue transition-colors font-medium hover:underline">
                <ArrowLeft size={16} className="mr-1"/> Torna al negozio
            </Link>
        </div>
      </div>
    </div>
  );
}