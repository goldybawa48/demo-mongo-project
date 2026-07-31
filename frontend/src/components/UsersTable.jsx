import { useState } from 'react';

export default function UsersTable({ users, onRefresh, onDelete, error }) {
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await onDelete(id);
    } catch (err) {
      // surfaced globally via logs / health polling
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="card glass users-card">
      <div className="card-header">
        <h2>Users</h2>
        <button className="btn-secondary" onClick={onRefresh}>
          Refresh
        </button>
      </div>

      {error && <p className="form-hint error-hint">{error}</p>}

      <div className="table-wrapper">
        <table className="users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Created Time</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} className="muted">
                  No users yet.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user._id}>
                  <td className="mono">{user._id.slice(-8)}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{new Date(user.createdAt).toLocaleString()}</td>
                  <td>
                    <button
                      className="btn-danger"
                      onClick={() => handleDelete(user._id)}
                      disabled={deletingId === user._id}
                    >
                      {deletingId === user._id ? 'Deleting...' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
