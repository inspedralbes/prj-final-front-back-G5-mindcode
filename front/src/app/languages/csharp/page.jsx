// app/languages/css/page.jsx
"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function CSSPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-200 to-blue-500 text-white">
      <Image src="/images/css.png" alt="CSS" width={120} height={120} />
      <h1 className="text-4xl font-bold mt-6">Bienvenido a CSS</h1>
      <Link href="/StPage">
        <button className="mt-10 px-6 py-2 bg-white text-blue-600 rounded-lg shadow hover:bg-blue-100">
          ⬅️ Volver a la ruleta
        </button>
      </Link>
    </div>
  );
}
