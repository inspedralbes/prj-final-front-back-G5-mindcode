"use client "

import React from "react";
import Link from "next/link";


const LinkAtom = ({ href, children }) => (
    <Link
      href={href}
      className="hover:underline"
    >
      {children}
    </Link>
  );

  export default LinkAtom;
