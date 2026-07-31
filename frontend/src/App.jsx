import { useCallback, useEffect, useState } from 'react';
import usePolling from './hooks/usePolling';
import { getHealth, getEnv, getUsers, createUser, deleteUser, getLogs } from './api/api';

import Navbar from './components/Navbar';
import ConnectionBanner from './components/ConnectionBanner';
import OverviewCard from './components/OverviewCard';
import InsertForm from './components/InsertForm';
import UsersTable from './components/UsersTable';
import HealthCard from './components/HealthCard';
import LogsWindow from './components/LogsWindow';

const HEALTH_POLL_MS = 3000;
const LOGS_POLL_MS = 3000;

export default function App() {
  const [backendConnected, setBackendConnected] = useState(true);
  const [health, setHealth] = useState(null);
  const [env, setEnv] = useState(null);
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [usersError, setUsersError] = useState('');

  const mongoConnected = Boolean(health?.mongoConnected);

  const fetchHealth = useCallback(async () => {
    try {
      const res = await getHealth();
      setHealth(res.data.data);
      setBackendConnected(true);
    } catch (err) {
      setBackendConnected(false);
      setHealth((prev) => (prev ? { ...prev, mongoConnected: false } : prev));
    }
  }, []);

  const fetchLogs = useCallback(async () => {
    try {
      const res = await getLogs();
      setLogs(res.data.data);
    } catch (err) {
      // backend unreachable, keep last known logs
    }
  }, []);

  const fetchEnv = useCallback(async () => {
    try {
      const res = await getEnv();
      setEnv(res.data.data);
    } catch (err) {
      setEnv(null);
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await getUsers();
      setUsers(res.data.data);
      setUsersError('');
    } catch (err) {
      setUsersError(err.response?.data?.message || 'Unable to load users right now.');
    }
  }, []);

  usePolling(fetchHealth, HEALTH_POLL_MS);
  usePolling(fetchLogs, LOGS_POLL_MS);

  useEffect(() => {
    fetchEnv();
    fetchUsers();
  }, [fetchEnv, fetchUsers]);

  const handleCreateUser = async (payload) => {
    const res = await createUser(payload);
    setUsers((prev) => [res.data.data, ...prev]);
  };

  const handleDeleteUser = async (id) => {
    await deleteUser(id);
    setUsers((prev) => prev.filter((u) => u._id !== id));
  };

  return (
    <div className="app-shell">
      <Navbar
        appName={env?.APP_NAME || 'MongoDB DevOps Demo'}
        backendConnected={backendConnected}
        mongoConnected={mongoConnected}
        environment={env?.NODE_ENV}
      />

      {(!backendConnected || !mongoConnected) && (
        <ConnectionBanner backendConnected={backendConnected} mongoConnected={mongoConnected} />
      )}

      <main className="dashboard-grid">
        <OverviewCard
          appName={env?.APP_NAME}
          version={env?.VERSION}
          uptimeSeconds={health?.uptimeSeconds}
        />

        <HealthCard health={health} backendConnected={backendConnected} />

        <InsertForm
          onCreate={handleCreateUser}
          disabled={!backendConnected || !mongoConnected}
        />

        <UsersTable
          users={users}
          onRefresh={fetchUsers}
          onDelete={handleDeleteUser}
          error={usersError}
        />

        <LogsWindow logs={logs} />
      </main>
    </div>
  );
}
