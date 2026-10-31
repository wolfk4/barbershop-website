"use client";
 
import { useEffect, useState } from "react";
 
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
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Account Settings</h1>
 
      <label className="block text-sm text-gray-500 mb-1">Email</label>
      <p className="mb-6 text-lg">{email || "Loading..."}</p>
 
      <button
        onClick={() => setShowForm(true)}
        className="bg-black text-white px-4 py-2 rounded"
      >
        Update
      </button>
 
      {/* update popup */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white text-black rounded-lg p-6 w-full max-w-sm">
            <h2 className="text-xl font-semibold mb-4">Update Account</h2>
 
            <input
              type="email"
              placeholder="New email (leave blank to keep)"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="w-full border rounded px-3 py-2 mb-3"
            />
            <input
              type="password"
              placeholder="New password (leave blank to keep)"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border rounded px-3 py-2 mb-3"
            />
            <input
              type="password"
              placeholder="Current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full border rounded px-3 py-2 mb-4"
            />
 
            <div className="flex justify-end gap-2">
              <button onClick={closeForm} className="px-4 py-2 rounded border">
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                disabled={saving || !currentPassword}
                className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
              >
                {saving ? "Updating..." : "Update"}
              </button>
            </div>
          </div>
        </div>
      )}
 
      {/* success / error popup */}
      {message && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white text-black rounded-lg p-6 w-full max-w-sm text-center">
            <p className="mb-4">{message}</p>
            <button
              onClick={() => setMessage(null)}
              className="bg-black text-white px-4 py-2 rounded"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
 