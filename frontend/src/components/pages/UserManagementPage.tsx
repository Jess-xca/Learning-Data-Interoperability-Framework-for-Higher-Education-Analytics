import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../hooks/useRedux";
import {
  setUsers,
  updateUserSuccess,
  deleteUserSuccess,
} from "../../store/slices/usersSlice";
import type { SystemUser } from "../../store/slices/usersSlice";
import type { User } from "../../store/slices/authSlice";
import { MainContent, Footer } from "..";
import Card from "../common/Card";
import Badge from "../common/Badge";
import Alert from "../common/Alert";
import { UserPlus, Edit, Trash2 } from "lucide-react";

const roleOptions: { value: User["role"]; label: string; color: string }[] = [
  { value: "admin", label: "Administrator", color: "error" },
  { value: "qa", label: "QA Officer", color: "warning" },
  { value: "analyst", label: "Data Analyst", color: "primary" },
  { value: "hod", label: "Department Head", color: "secondary" },
  { value: "lecturer", label: "Lecturer", color: "tertiary" },
];

const statusOptions = ["active", "inactive", "pending"] as const;

export default function UserManagementPage() {
  const dispatch = useAppDispatch();
  const allUsers = useAppSelector((state) =>
    Array.isArray(state.users.allUsers) ? state.users.allUsers : [],
  );
  const currentUser = useAppSelector((state) => state.auth.user);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState<User["role"] | "">("");
  const [filterStatus, setFilterStatus] = useState<string>("");

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "lecturer" as User["role"],
    institution: "",
    department: "",
    phone: "",
    status: "active" as SystemUser["status"],
  });

  // Load mock users on mount
  useEffect(() => {
    // Only load mock data if no users exist
    if (allUsers.length === 0) {
      const mockUsers: SystemUser[] = [
        {
          id: "user_1",
          name: "Alice Johnson",
          email: "alice.johnson@univ-kigali.ac.rw",
          role: "admin",
          institution: "Université de Kigali",
          department: "Academic Affairs",
          phone: "+250 78 123 4567",
          mfaEnabled: true,
          status: "active",
          createdAt: "2024-01-15T10:30:00Z",
          updatedAt: "2024-03-28T15:45:00Z",
        },
        {
          id: "user_2",
          name: "Bob Smith",
          email: "bob.smith@kigali-institute.ac.rw",
          role: "analyst",
          institution: "Kigali Institute of Science & Technology",
          department: "Data Science",
          phone: "+250 78 234 5678",
          mfaEnabled: false,
          status: "active",
          createdAt: "2024-02-20T09:00:00Z",
          updatedAt: "2024-03-20T12:30:00Z",
        },
        {
          id: "user_3",
          name: "Carol Davis",
          email: "carol.davis@aub.ac.rw",
          role: "hod",
          institution: "African University of Business",
          department: "Business Administration",
          phone: "+250 78 345 6789",
          mfaEnabled: true,
          status: "active",
          createdAt: "2024-03-01T11:15:00Z",
          updatedAt: "2024-03-25T14:00:00Z",
        },
      ];
      dispatch(setUsers(mockUsers));
    }
  }, [allUsers.length, dispatch]);

  const filteredUsers = allUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = !filterRole || user.role === filterRole;
    const matchesStatus = !filterStatus || user.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleAddUser = () => {
    setEditingId(null);
    setFormData({
      name: "",
      email: "",
      role: "lecturer",
      institution: "",
      department: "",
      phone: "",
      status: "active",
    });
    setShowForm(true);
  };

  const handleEditUser = (user: SystemUser) => {
    setEditingId(user.id);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      institution: user.institution,
      department: user.department || "",
      phone: user.phone || "",
      status: user.status,
    });
    setShowForm(true);
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.email || !formData.institution) {
      return;
    }

    if (editingId) {
      const updated: SystemUser = {
        id: editingId,
        ...formData,
        mfaEnabled:
          allUsers.find((u) => u.id === editingId)?.mfaEnabled || false,
        createdAt:
          allUsers.find((u) => u.id === editingId)?.createdAt ||
          new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      dispatch(updateUserSuccess(updated));
    } else {
      const newUser: SystemUser = {
        id: `user_${Date.now()}`,
        ...formData,
        mfaEnabled: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      // This should use an action to add, but for now we'll just update the list
      const updated = [...allUsers, newUser];
      dispatch(setUsers(updated));
    }

    setShowForm(false);
  };

  const handleDeleteUser = (userId: string) => {
    if (userId === currentUser?.id) {
      alert("Cannot delete your own account.");
      return;
    }
    if (confirm("Are you sure you want to delete this user?")) {
      dispatch(deleteUserSuccess(userId));
    }
  };

  const getRoleBadgeColor = (role: User["role"]) => {
    switch (role) {
      case "admin":
        return "error" as const;
      case "qa":
        return "warning" as const;
      case "analyst":
        return "primary" as const;
      case "hod":
        return "secondary" as const;
      case "lecturer":
        return "success" as const;
      case "student":
        return "primary" as const;
      default:
        return "primary" as const;
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "active":
        return "success" as const;
      case "inactive":
        return "error" as const;
      case "pending":
        return "warning" as const;
      default:
        return "primary" as const;
    }
  };

  return (
    <>
      <MainContent>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="h-page text-primary">User Management</h1>
              <p className="text-on-surface-variant mt-1">
                Manage system users and permissions
              </p>
            </div>
            {!showForm && (
              <button
                onClick={handleAddUser}
                className="flex items-center gap-2 px-6 py-3 bg-primary text-on-primary rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                <UserPlus className="w-5 h-5" strokeWidth={2} />
                Add New User
              </button>
            )}
          </div>

          {/* Form */}
          {showForm && (
            <Card>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-primary mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full h-10 px-3 border border-outline rounded-lg focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-primary mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full h-10 px-3 border border-outline rounded-lg focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-primary mb-2">
                    Institution *
                  </label>
                  <input
                    type="text"
                    value={formData.institution}
                    onChange={(e) =>
                      setFormData({ ...formData, institution: e.target.value })
                    }
                    className="w-full h-10 px-3 border border-outline rounded-lg focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-primary mb-2">
                    Role
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        role: e.target.value as User["role"],
                      })
                    }
                    className="w-full h-10 px-3 border border-outline rounded-lg focus:outline-none focus:border-primary"
                  >
                    {roleOptions.map((r) => (
                      <option key={r.value} value={r.value}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-primary mb-2">
                    Department
                  </label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) =>
                      setFormData({ ...formData, department: e.target.value })
                    }
                    className="w-full h-10 px-3 border border-outline rounded-lg focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-primary mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full h-10 px-3 border border-outline rounded-lg focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-primary mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as SystemUser["status"],
                      })
                    }
                    className="w-full h-10 px-3 border border-outline rounded-lg focus:outline-none focus:border-primary"
                  >
                    {statusOptions.map((s) => (
                      <option key={s} value={s}>
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleSubmit}
                  className="flex-1 h-10 bg-primary text-on-primary rounded-lg font-semibold hover:opacity-90 transition-opacity"
                >
                  {editingId ? "Update User" : "Create User"}
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className="flex-1 h-10 bg-surface-container text-on-surface rounded-lg font-semibold hover:opacity-90 transition-opacity"
                >
                  Cancel
                </button>
              </div>
            </Card>
          )}

          {/* Filters */}
          {!showForm && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 px-4 border border-outline rounded-lg focus:outline-none focus:border-primary"
              />
              <select
                value={filterRole}
                onChange={(e) =>
                  setFilterRole(e.target.value as User["role"] | "")
                }
                className="h-10 px-4 border border-outline rounded-lg focus:outline-none focus:border-primary"
              >
                <option value="">All Roles</option>
                {roleOptions.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="h-10 px-4 border border-outline rounded-lg focus:outline-none focus:border-primary"
              >
                <option value="">All Status</option>
                {statusOptions.map((s) => (
                  <option key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Users Table */}
          {!showForm && (
            <>
              {filteredUsers.length === 0 ? (
                <Alert variant="info">
                  {allUsers.length === 0
                    ? "No users yet. Click 'Add New User' to create one."
                    : "No users match your filters."}
                </Alert>
              ) : (
                <div className="overflow-x-auto rounded-lg border border-outline">
                  <table className="w-full">
                    <thead className="bg-surface-container border-b border-outline">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-on-surface">
                          Name
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-on-surface">
                          Email
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-on-surface">
                          Institution
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-on-surface">
                          Role
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-on-surface">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-on-surface">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline">
                      {filteredUsers.map((user) => (
                        <tr
                          key={user.id}
                          className="hover:bg-surface-container-low transition-colors"
                        >
                          <td className="px-4 py-3 text-sm font-medium text-on-surface">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                                {user.name.charAt(0).toUpperCase()}
                              </div>
                              {user.name}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-on-surface-variant">
                            {user.email}
                          </td>
                          <td className="px-4 py-3 text-sm text-on-surface-variant">
                            {user.institution}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <Badge variant={getRoleBadgeColor(user.role)}>
                              {roleOptions.find((r) => r.value === user.role)
                                ?.label || user.role}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <Badge variant={getStatusBadgeColor(user.status)}>
                              {user.status.charAt(0).toUpperCase() +
                                user.status.slice(1)}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-sm flex gap-2">
                            <button
                              onClick={() => handleEditUser(user)}
                              className="p-2 hover:bg-surface-container rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit
                                className="w-5 h-5 text-primary"
                                strokeWidth={2}
                              />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="p-2 hover:bg-error-container rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2
                                className="w-5 h-5 text-error"
                                strokeWidth={2}
                              />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Summary */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">
                      {allUsers.length}
                    </div>
                    <div className="text-sm text-on-surface-variant">
                      Total Users
                    </div>
                  </div>
                </Card>
                <Card>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-secondary">
                      {allUsers.filter((u) => u.status === "active").length}
                    </div>
                    <div className="text-sm text-on-surface-variant">
                      Active
                    </div>
                  </div>
                </Card>
                <Card>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-warning">
                      {allUsers.filter((u) => u.mfaEnabled).length}
                    </div>
                    <div className="text-sm text-on-surface-variant">
                      MFA Enabled
                    </div>
                  </div>
                </Card>
                <Card>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">
                      {roleOptions.length}
                    </div>
                    <div className="text-sm text-on-surface-variant">
                      Role Types
                    </div>
                  </div>
                </Card>
              </div>
            </>
          )}
        </div>
      </MainContent>
      <Footer variant="minimal" />
    </>
  );
}
