import React, { useState, useEffect } from "react";
import axios from "axios";
import { Users, Trash2, Shield, ShieldCheck, Mail, Calendar, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await axios.get("/users");
      setUsers(res.data);
    } catch (err) {
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await axios.patch(`/users/${userId}/role`, { role: newRole });
      fetchUsers();
    } catch (err) {
      alert("Failed to update role");
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`/users/${userId}`);
      fetchUsers();
    } catch (err) {
      alert("Failed to delete user");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Users className="text-primary" />
          Manage Users
        </h2>
        <span className="text-muted small">Total: {users.length}</span>
      </div>

      {error && <div className="p-4 bg-red-500/10 text-error rounded-lg mb-4">{error}</div>}

      <div className="glass overflow-hidden">
        <table className="w-full text-left" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr className="border-b border-white/10 text-muted small uppercase">
              <th className="p-4">User</th>
              <th className="p-4">Role</th>
              <th className="p-4">Status</th>
              <th className="p-4">Joined</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-muted small">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    {user.role === "admin" ? (
                      <ShieldCheck size={16} className="text-primary" />
                    ) : (
                      <Shield size={16} className="text-muted" />
                    )}
                    <span className={`small capitalize ${user.role === 'admin' ? 'text-primary' : 'text-muted'}`}>
                      {user.role}
                    </span>
                  </div>
                </td>
                <td className="p-4">
                  <span className="small px-2 py-1 bg-green-500/10 text-success rounded-full">
                    {user.status || 'Active'}
                  </span>
                </td>
                <td className="p-4 text-muted small">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => handleRoleChange(user._id, user.role === 'admin' ? 'staff' : 'admin')}
                      className="p-2 hover:bg-white/10 rounded-lg text-muted hover:text-primary transition-all"
                      title="Change Role"
                    >
                      <Shield size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(user._id)}
                      className="p-2 hover:bg-white/10 rounded-lg text-muted hover:text-error transition-all"
                      title="Delete User"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default AdminUsers;
