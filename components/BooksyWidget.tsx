"use client";
 
import { useEffect, useRef } from "react";
 
type Props = {
  src: string;
};
 

function isBooksyUrl(src: string): boolean {
  try {
    const url = new URL(src);
    return (
      url.protocol === "https:" &&
      (url.hostname === "booksy.com" || url.hostname.endsWith(".booksy.com"))
    );
  } catch {
    return false;
  }
}
 
export default function BooksyWidget({ src }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
 
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !isBooksyUrl(src)) return;
 
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    container.appendChild(script);
 
    return () => {
      container.innerHTML = "";
    };
  }, [src]);
 
  if (!isBooksyUrl(src)) return null;
 
  return <div ref={containerRef} />;
}
