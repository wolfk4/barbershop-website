"use client";
 
import { useEffect, useState } from "react";
 
type Profile = {
  fullName: string;
  bio: string;
  phone: string;
  booksyUrl: string;
};
 
type Errors = Partial<Record<keyof Profile, string>>;
 
type Status = { type: "success" | "error"; text: string } | null;
 
const PROFILE_URL = "/api/employee/profile";
 
// Barbers can paste the whole <script> tag from Booksy because this pulls out just the URL
function extractBooksySrc(value: string): string {
  const match = value.match(/src=["']([^"']+)["']/i);
  return match ? match[1] : value;
}
 
function isBooksyUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      (url.hostname === "booksy.com" || url.hostname.endsWith(".booksy.com"))
    );
  } catch {
    return false;
  }
}
 
function validate(form: Profile): Errors {
  const errors: Errors = {};
 
  if (!form.fullName.trim()) {
    errors.fullName = "Full name is required.";
  }
 
  if (!form.phone.trim()) {
    errors.phone = "Phone number is required.";
  } else if (form.phone.replace(/\D/g, "").length < 10) {
    errors.phone = "Enter a valid 10-digit phone number.";
  }
 
  // if they fill it in it has to be a real Booksy link
  if (form.booksyUrl.trim() && !isBooksyUrl(form.booksyUrl.trim())) {
    errors.booksyUrl = "That doesn't look like a Booksy link. Paste the code from your Booksy settings.";
  }
 
  return errors;
}
 
export default function EmployeeProfileForm() {
  const [form, setForm] = useState<Profile>({ fullName: "", bio: "", phone: "", booksyUrl: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<Status>(null);
 
  // Load the employees current info when the page loads
  useEffect(() => {
    let cancelled = false;
 
    async function loadProfile() {
      try {
        const res = await fetch(PROFILE_URL);
        if (!res.ok) throw new Error("Failed to load profile");
        const data = await res.json();
 
        if (!cancelled) {
          setForm({
            fullName: data.fullName ?? "",
            bio: data.bio ?? "",
            phone: data.phone ?? "",
            booksyUrl: data.booksyUrl ?? "",
          });
        }
      } catch {
        if (!cancelled) {
          setStatus({ type: "error", text: "Couldn't load your profile. Try refreshing." });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
 
    loadProfile();
    return () => {
      cancelled = true;
    };
  }, []);
 
  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name } = e.target;
    const value = name === "booksyUrl" ? extractBooksySrc(e.target.value) : e.target.value;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear the error for this field once they start fixing it
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setStatus(null);
  }
 
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
 
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length > 0) return; // block submit
 
    setSaving(true);
    setStatus(null);
 
    try {
      const res = await fetch(PROFILE_URL, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.fullName.trim(),
          bio: form.bio.trim(),
          phone: form.phone.trim(),
          booksyUrl: form.booksyUrl.trim(),
        }),
      });
      if (!res.ok) throw new Error("Failed to save profile");
      setStatus({ type: "success", text: "Profile updated." });
    } catch {
      setStatus({ type: "error", text: "Couldn't save your changes. Try again." });
    } finally {
      setSaving(false);
    }
  }
 
  if (loading) {
    return <p className="text-sm text-gray-500">Loading your profile...</p>;
  }
 
  const inputBase =
    "w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black";
  const inputClass = (hasError: boolean) =>
    `${inputBase} ${hasError ? "border-red-500" : "border-gray-300"}`;
 
  return (
    <form onSubmit={handleSubmit} noValidate className="max-w-lg space-y-5">
      <h2 className="text-xl font-semibold">Personal Information</h2>
 
      <div>
        <label htmlFor="fullName" className="mb-1 block text-sm font-medium">
          Full name <span className="text-red-600">*</span>
        </label>
        <input
          id="fullName"
          name="fullName"
          type="text"
          autoComplete="name"
          value={form.fullName}
          onChange={handleChange}
          aria-invalid={!!errors.fullName}
          aria-describedby={errors.fullName ? "fullName-error" : undefined}
          className={inputClass(!!errors.fullName)}
        />
        {errors.fullName && (
          <p id="fullName-error" className="mt-1 text-sm text-red-600">
            {errors.fullName}
          </p>
        )}
      </div>
 
      <div>
        <label htmlFor="phone" className="mb-1 block text-sm font-medium">
          Phone number <span className="text-red-600">*</span>
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          placeholder="(916) 555-1234"
          value={form.phone}
          onChange={handleChange}
          aria-invalid={!!errors.phone}
          aria-describedby={errors.phone ? "phone-error" : undefined}
          className={inputClass(!!errors.phone)}
        />
        {errors.phone && (
          <p id="phone-error" className="mt-1 text-sm text-red-600">
            {errors.phone}
          </p>
        )}
      </div>
 
      <div>
        <label htmlFor="bio" className="mb-1 block text-sm font-medium">
          Bio
        </label>
        <textarea
          id="bio"
          name="bio"
          rows={5}
          value={form.bio}
          onChange={handleChange}
          className={inputClass(false)}
        />
      </div>
 
      <div>
        <label htmlFor="booksyUrl" className="mb-1 block text-sm font-medium">
          Booksy widget link
        </label>
        <input
          id="booksyUrl"
          name="booksyUrl"
          type="text"
          placeholder="Paste the code from your Booksy settings"
          value={form.booksyUrl}
          onChange={handleChange}
          aria-invalid={!!errors.booksyUrl}
          aria-describedby={errors.booksyUrl ? "booksyUrl-error" : undefined}
          className={inputClass(!!errors.booksyUrl)}
        />
        {errors.booksyUrl && (
          <p id="booksyUrl-error" className="mt-1 text-sm text-red-600">
            {errors.booksyUrl}
          </p>
        )}
      </div>
 
      {status && (
        <p
          role="status"
          className={`text-sm ${status.type === "success" ? "text-green-700" : "text-red-600"}`}
        >
          {status.text}
        </p>
      )}
 
      <button
        type="submit"
        disabled={saving}
        className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save changes"}
      </button>
    </form>
  );
}
 