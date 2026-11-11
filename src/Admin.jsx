import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

const emptyForm = {
  id: null,
  dog_name: "",
  groomed_on: "",
  amount_charged: "",
  notes: "",
};

function LoginForm({ onSignedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (signInError) {
      setError(signInError.message);
      return;
    }
    onSignedIn();
  }

  return (
    <div className="admin-shell">
      <form className="card admin-login" onSubmit={handleSubmit}>
        <h1>Admin Login</h1>
        <label>
          Email
          <input
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {error && <p className="admin-error">{error}</p>}
        <button className="book-btn" type="submit" disabled={loading}>
          {loading ? "Signing in…" : "Log In"}
        </button>
      </form>
    </div>
  );
}

function RecordForm({ form, setForm, onSave, onCancel, saving }) {
  return (
    <form className="card admin-record-form" onSubmit={onSave}>
      <h2>{form.id ? "Edit Record" : "New Record"}</h2>

      <label>
        Dog Name
        <input
          type="text"
          value={form.dog_name}
          onChange={(e) => setForm({ ...form, dog_name: e.target.value })}
          required
        />
      </label>

      <label>
        Date Groomed
        <input
          type="date"
          value={form.groomed_on}
          onChange={(e) => setForm({ ...form, groomed_on: e.target.value })}
          required
        />
      </label>

      <label>
        Amount Charged
        <input
          type="number"
          step="0.01"
          min="0"
          value={form.amount_charged}
          onChange={(e) =>
            setForm({ ...form, amount_charged: e.target.value })
          }
        />
      </label>

      <label>
        Notes
        <textarea
          rows="3"
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
        />
      </label>

      <div className="admin-form-actions">
        <button className="book-btn" type="submit" disabled={saving}>
          {saving ? "Saving…" : "Save"}
        </button>
        <button
          type="button"
          className="admin-btn-secondary"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function Dashboard({ onSignedOut }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  async function loadRecords() {
    setLoading(true);
    setLoadError("");
    const { data, error } = await supabase
      .from("grooming_records")
      .select("*")
      .order("groomed_on", { ascending: false });
    setLoading(false);
    if (error) {
      setLoadError(error.message);
      return;
    }
    setRecords(data || []);
  }

  useEffect(() => {
    loadRecords();
  }, []);

  async function handleSignOut() {
    await supabase.auth.signOut();
    onSignedOut();
  }

  function startNew() {
    setForm(emptyForm);
    setShowForm(true);
  }

  function startEdit(record) {
    setForm({
      id: record.id,
      dog_name: record.dog_name,
      groomed_on: record.groomed_on,
      amount_charged: record.amount_charged ?? "",
      notes: record.notes ?? "",
    });
    setShowForm(true);
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    const payload = {
      dog_name: form.dog_name,
      groomed_on: form.groomed_on,
      amount_charged: form.amount_charged === "" ? null : form.amount_charged,
      notes: form.notes === "" ? null : form.notes,
    };

    const { error } = form.id
      ? await supabase
          .from("grooming_records")
          .update(payload)
          .eq("id", form.id)
      : await supabase.from("grooming_records").insert(payload);

    setSaving(false);
    if (error) {
      alert(error.message);
      return;
    }
    setShowForm(false);
    setForm(emptyForm);
    loadRecords();
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this record? This can't be undone.")) return;
    const { error } = await supabase
      .from("grooming_records")
      .delete()
      .eq("id", id);
    if (error) {
      alert(error.message);
      return;
    }
    loadRecords();
  }

  return (
    <div className="admin-shell">
      <div className="admin-header">
        <h1>Grooming Records</h1>
        <button className="admin-btn-secondary" onClick={handleSignOut}>
          Log Out
        </button>
      </div>

      {!showForm && (
        <button className="book-btn admin-new-btn" onClick={startNew}>
          + Add Record
        </button>
      )}

      {showForm && (
        <RecordForm
          form={form}
          setForm={setForm}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setForm(emptyForm);
          }}
          saving={saving}
        />
      )}

      {loading && <p>Loading…</p>}
      {loadError && <p className="admin-error">{loadError}</p>}

      {!loading && !loadError && records.length === 0 && (
        <p className="admin-empty">No records yet.</p>
      )}

      {!loading && records.length > 0 && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Dog</th>
                <th>Date</th>
                <th>Charged</th>
                <th>Notes</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {records.map((r) => (
                <tr key={r.id}>
                  <td>{r.dog_name}</td>
                  <td>{r.groomed_on}</td>
                  <td>
                    {r.amount_charged != null ? `$${r.amount_charged}` : "—"}
                  </td>
                  <td className="admin-notes-cell">{r.notes || "—"}</td>
                  <td className="admin-row-actions">
                    <button
                      className="admin-link-btn"
                      onClick={() => startEdit(r)}
                    >
                      Edit
                    </button>
                    <button
                      className="admin-link-btn admin-link-danger"
                      onClick={() => handleDelete(r.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function Admin() {
  const [session, setSession] = useState(undefined); // undefined = checking

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
      }
    );
    return () => listener.subscription.unsubscribe();
  }, []);

  if (session === undefined) {
    return (
      <div className="admin-shell">
        <p>Loading…</p>
      </div>
    );
  }

  if (!session) {
    return <LoginForm onSignedIn={() => {}} />;
  }

  return <Dashboard onSignedOut={() => {}} />;
}
