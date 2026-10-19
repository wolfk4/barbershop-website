"use client";
 
import { useState } from "react";
import { useRouter } from "next/navigation";
 
const SIZES = ["S", "M", "L", "XL", "XXL"];
 
export function CreateProductForm() {
  const router = useRouter();
  const [sizes, setSizes] = useState<string[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
 
  function toggleSize(size: string) {
    setSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size],
    );
  }
 
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const errs: string[] = [];
 
    if (!String(data.get("name") ?? "").trim()) errs.push("Product name is required.");
    if (!String(data.get("description") ?? "").trim()) errs.push("Description is required.");
 
    const priceRaw = String(data.get("price") ?? "").trim();
    const price = Number(priceRaw);
    if (priceRaw === "" || !Number.isFinite(price) || price <= 0) {
      errs.push("Price must be a positive number.");
    }
 
    if (sizes.length === 0) errs.push("Pick at least one size.");
 
    for (const size of sizes) {
      const raw = String(data.get(`stock_${size}`) ?? "").trim();
      const n = Number(raw);
      if (raw === "" || !Number.isInteger(n) || n < 0) {
        errs.push(`Stock for ${size} must be a whole number 0 or more.`);
      }
    }
 
    if (errs.length > 0) {
      setErrors(errs);
      return;
    }
 
    setErrors([]);
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/products", { method: "POST", body: data });
      if (!res.ok) throw new Error();
      alert("Product created successfully.");
      form.reset();
      setSizes([]);
      router.refresh();
    } catch {
      alert("Failed to create product.");
    } finally {
      setSubmitting(false);
    }
  }
 
  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      {errors.length > 0 && (
        <ul className="text-red-600 text-sm list-disc pl-5">
          {errors.map((err) => (
            <li key={err}>{err}</li>
          ))}
        </ul>
      )}
 
      <label className="flex flex-col gap-1">
        Product name
        <input name="name" type="text" required className="border rounded p-2" />
      </label>
 
      <label className="flex flex-col gap-1">
        Description
        <textarea name="description" required className="border rounded p-2" />
      </label>
 
      <label className="flex flex-col gap-1">
        Price ($)
        <input name="price" type="number" min="0" step="0.01" required className="border rounded p-2" />
      </label>
 
      <fieldset className="flex flex-col gap-2">
        <legend>Sizes</legend>
        <div className="flex gap-4">
          {SIZES.map((size) => (
            <label key={size} className="flex items-center gap-1">
              <input
                type="checkbox"
                name="sizes"
                value={size}
                checked={sizes.includes(size)}
                onChange={() => toggleSize(size)}
              />
              {size}
            </label>
          ))}
        </div>
      </fieldset>
 
      {sizes.length > 0 && (
        <fieldset className="flex flex-col gap-2">
          <legend>Stock per size</legend>
          {SIZES.filter((s) => sizes.includes(s)).map((size) => (
            <label key={size} className="flex items-center gap-2">
              <span className="w-10">{size}</span>
              <input
                name={`stock_${size}`}
                type="number"
                min="0"
                step="1"
                required
                className="border rounded p-2 w-24"
              />
            </label>
          ))}
        </fieldset>
      )}
 
      <label className="flex flex-col gap-1">
        Image (optional)
        <input name="image" type="file" accept="image/*" />
      </label>
 
      <button
        type="submit"
        disabled={submitting}
        className="bg-black text-white rounded p-2 disabled:opacity-50"
      >
        {submitting ? "Creating..." : "Create product"}
      </button>
    </form>
  );
}