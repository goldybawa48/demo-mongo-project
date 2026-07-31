import { useState } from 'react';

export default function InsertForm({ onCreate, disabled }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (disabled || submitting) return;

    setSubmitting(true);
    setStatus(null);

    try {
      await onCreate({ name, email });
      setStatus({ type: 'success', message: 'User inserted successfully!' });
      setName('');
      setEmail('');
    } catch (err) {
      const message =
        err.response?.data?.message || 'Something went wrong while saving the user.';
      setStatus({ type: 'error', message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="card glass insert-form-card">
      <h2>Insert Data</h2>

      <form onSubmit={handleSubmit} className="insert-form">
        <label>
          Name
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Jane Doe"
            required
            disabled={disabled}
          />
        </label>

        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="jane@example.com"
            required
            disabled={disabled}
          />
        </label>

        <button type="submit" className="btn-primary" disabled={disabled || submitting}>
          {submitting ? 'Saving...' : 'Submit'}
        </button>

        {disabled && (
          <p className="form-hint error-hint">
            MongoDB is unavailable — submissions are disabled until the connection is restored.
          </p>
        )}

        {status && (
          <p className={status.type === 'success' ? 'form-hint success-hint' : 'form-hint error-hint'}>
            {status.message}
          </p>
        )}
      </form>
    </section>
  );
}
