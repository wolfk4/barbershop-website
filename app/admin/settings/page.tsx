"use client";
 
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
 
export default function AdminAccountSettings() {
  const [email, setEmail] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
 
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [saving, setSaving] = useState(false);
 
  useEffect(() => {
    fetch("/api/admin/account")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => data && setEmail(data.email));
  }, []);
 
  function closeForm() {
    setShowForm(false);
    setNewEmail("");
    setNewPassword("");
    setCurrentPassword("");
  }
 
  async function handleUpdate() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/account", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: newEmail,
          password: newPassword,
          currentPassword,
        }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setEmail(data.email);
      closeForm();
      setMessage("Account information updated.");
    } catch {
      closeForm();
      setMessage("Update failed. Please try again.");
    } finally {
      setSaving(false);
    }
  }
 
  return (
    <div className="flex min-h-screen flex-col bg-white font-sans text-black">
      <Header />
 
      {/* title - same black banner as the other pages */}
      <section className="bg-black px-6 py-14 text-center text-white md:py-16">
        <h1 className="text-4xl font-extrabold uppercase tracking-widest md:text-6xl">Settings</h1>
      </section>
 
      <main className="mx-auto w-full max-w-xl flex-1 px-6 py-12">
        <Link
          href="/admin"
          className="mb-8 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-gray-500 transition hover:text-black"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Admin
        </Link>
 
        <section className="rounded-2xl border p-6 md:p-8">
          <h2 className="mb-6 text-lg font-extrabold uppercase tracking-widest">Account</h2>
 
          <div className="flex items-center gap-4">
            <div className="shrink-0 rounded-full bg-black p-3 text-white">
              <Mail className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Email</p>
              <p className="truncate text-lg font-medium">{email || "Loading..."}</p>
            </div>
          </div>
 
          <button
            onClick={() => setShowForm(true)}
            className="mt-8 w-full rounded-full bg-black px-6 py-3 font-bold uppercase tracking-wide text-white transition hover:bg-gray-800"
          >
            Update email or password
          </button>
        </section>
      </main>
 
      <Footer />
 
      {/* update popup */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-8 text-black shadow-2xl">
            <h2 className="mb-6 text-center text-xl font-extrabold uppercase tracking-widest">Update Account</h2>
 
            <label htmlFor="newEmail" className="mb-2 block text-sm font-semibold text-gray-700">New email</label>
            <input
              id="newEmail"
              type="email"
              placeholder="Leave blank to keep"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="mb-5 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-black focus:ring-1 focus:ring-black"
            />
            <label htmlFor="newPassword" className="mb-2 block text-sm font-semibold text-gray-700">New password</label>
            <input
              id="newPassword"
              type="password"
              placeholder="Leave blank to keep"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mb-5 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-black focus:ring-1 focus:ring-black"
            />
            <label htmlFor="currentPassword" className="mb-2 block text-sm font-semibold text-gray-700">Current password</label>
            <input
              id="currentPassword"
              type="password"
              placeholder="Required to save changes"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="mb-6 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-black focus:ring-1 focus:ring-black"
            />
 
            <div className="flex gap-3">
              <button onClick={closeForm} className="flex-1 rounded-full border border-black px-4 py-3 text-sm font-bold uppercase tracking-wide transition hover:bg-gray-100">
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                disabled={saving || !currentPassword}
                className="flex-1 rounded-full bg-black px-4 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? "Updating..." : "Update"}
              </button>
            </div>
          </div>
        </div>
      )}
 
      {/* success / error popup */}
      {message && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-8 text-center text-black shadow-2xl">
            <p className="mb-6">{message}</p>
            <button
              onClick={() => setMessage(null)}
              className="w-full rounded-full bg-black px-4 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-gray-800"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
