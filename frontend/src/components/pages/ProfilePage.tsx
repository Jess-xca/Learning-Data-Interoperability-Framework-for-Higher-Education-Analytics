import { useState } from "react";
import { MainContent, Card, TextInput, Button, Alert, Badge, Footer } from "..";
import { useAppSelector, useAppDispatch } from "../../hooks/useRedux";
import { setUser } from "../../store/slices/authSlice";

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [mfaEnabled, setMfaEnabled] = useState(user?.mfaEnabled ?? false);
  const [showMfaSetup, setShowMfaSetup] = useState(false);
  const [mfaCode, setMfaCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSave = () => {
    if (!name || !email) {
      setError("Name and email are required");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      dispatch(setUser({ ...user!, name, email }));
      setLoading(false);
      setEditing(false);
      setSuccess("Profile updated successfully");
      setTimeout(() => setSuccess(""), 3000);
    }, 1000);
  };

  const handleMfaToggle = () => {
    if (!mfaEnabled) {
      setShowMfaSetup(true);
    } else {
      setLoading(true);
      setTimeout(() => {
        setMfaEnabled(false);
        dispatch(setUser({ ...user!, mfaEnabled: false }));
        setLoading(false);
        setSuccess("MFA disabled");
        setTimeout(() => setSuccess(""), 3000);
      }, 1000);
    }
  };

  const handleMfaSetup = () => {
    if (!mfaCode || mfaCode.length !== 6) {
      setError("Please enter the 6-digit code");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setMfaEnabled(true);
      dispatch(setUser({ ...user!, mfaEnabled: true }));
      setShowMfaSetup(false);
      setMfaCode("");
      setLoading(false);
      setSuccess("MFA enabled successfully");
      setTimeout(() => setSuccess(""), 3000);
    }, 1000);
  };

  const roleLabels: Record<string, string> = {
    admin: "Academic Administrator",
    qa: "Quality Assurance Officer",
    analyst: "Data Analyst",
    hod: "Department Head",
    lecturer: "Lecturer",
    student: "Student",
  };

  return (
    <>
    <MainContent>
      <div className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-[2.75rem] font-black text-primary leading-tight tracking-tight">Profile Settings</h1>
          <p className="text-on-surface-variant font-medium mt-2">Manage your account information and security settings.</p>
        </div>
      </div>

      {success && <div className="mb-6"><Alert variant="success">{success}</Alert></div>}
      {error && <div className="mb-6"><Alert variant="error">{error}</Alert></div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-primary">Personal Information</h2>
              {!editing && (
                <Button variant="secondary" size="sm" onClick={() => setEditing(true)}>
                  <span className="material-symbols-outlined">edit</span>
                  Edit
                </Button>
              )}
            </div>

            <div className="space-y-5">
              <TextInput label="Full Name" value={name} onChange={e => setName(e.target.value)} disabled={!editing} icon="person" />
              <TextInput label="Email Address" value={email} onChange={e => setEmail(e.target.value)} disabled={!editing} icon="mail" type="email" />
              
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider">Role</label>
                <div className="flex items-center gap-3 p-4 bg-surface-container-low rounded-lg">
                  <span className="material-symbols-outlined text-primary">badge</span>
                  <span className="font-semibold">{roleLabels[user?.role ?? "admin"]}</span>
                  <Badge variant="primary" className="ml-auto">{user?.role?.toUpperCase()}</Badge>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider">Institution</label>
                <div className="flex items-center gap-3 p-4 bg-surface-container-low rounded-lg">
                  <span className="material-symbols-outlined text-primary">school</span>
                  <span className="font-semibold">{user?.institution}</span>
                </div>
              </div>

              {editing && (
                <div className="flex gap-3 pt-4">
                  <Button variant="primary" onClick={handleSave} isLoading={loading}>
                    <span className="material-symbols-outlined">save</span>
                    Save Changes
                  </Button>
                  <Button variant="secondary" onClick={() => { setEditing(false); setName(user?.name ?? ""); setEmail(user?.email ?? ""); }}>
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </Card>

          {/* Security Settings */}
          <Card className="p-8">
            <h2 className="text-xl font-bold text-primary mb-6">Security Settings</h2>
            
            <div className="space-y-5">
              <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">lock</span>
                  <div>
                    <p className="font-bold text-on-surface">Password</p>
                    <p className="text-xs text-on-surface-variant">Last changed 30 days ago</p>
                  </div>
                </div>
                <Button variant="secondary" size="sm">
                  Change
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">verified_user</span>
                  <div>
                    <p className="font-bold text-on-surface">Multi-Factor Authentication</p>
                    <p className="text-xs text-on-surface-variant">
                      {mfaEnabled ? "Enabled - Extra layer of security" : "Disabled - Recommended to enable"}
                    </p>
                  </div>
                </div>
                <Button variant={mfaEnabled ? "danger" : "primary"} size="sm" onClick={handleMfaToggle} isLoading={loading}>
                  {mfaEnabled ? "Disable" : "Enable"}
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="p-6 text-center">
            <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-on-primary text-4xl font-black">{user?.name?.charAt(0) ?? "A"}</span>
            </div>
            <h3 className="font-bold text-primary text-lg">{user?.name}</h3>
            <p className="text-sm text-on-surface-variant">{user?.email}</p>
            <Badge variant="success" className="mt-3">Active</Badge>
          </Card>

          <Card className="p-6">
            <h3 className="font-bold text-primary mb-4">Account Activity</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Last Login</span>
                <span className="font-bold">Today, 9:42 AM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Account Created</span>
                <span className="font-bold">Jan 15, 2025</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Sessions</span>
                <span className="font-bold">2 active</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* MFA Setup Modal */}
      {showMfaSetup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-primary">Enable MFA</h3>
              <button onClick={() => setShowMfaSetup(false)} className="text-on-surface-variant hover:text-primary">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <Alert variant="info" icon="info" className="mb-6">
              Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
            </Alert>

            <div className="bg-surface-container-low p-6 rounded-lg mb-6 flex items-center justify-center">
              <div className="w-48 h-48 bg-white rounded-lg flex items-center justify-center">
                <span className="text-xs text-on-surface-variant">QR Code Placeholder</span>
              </div>
            </div>

            <div className="space-y-4">
              <TextInput label="Enter 6-digit code" placeholder="000000" value={mfaCode} onChange={e => setMfaCode(e.target.value.slice(0, 6))} maxLength={6} />
              <Button variant="primary" onClick={handleMfaSetup} isLoading={loading} className="w-full">
                <span className="material-symbols-outlined">verified_user</span>
                Enable MFA
              </Button>
            </div>
          </Card>
        </div>
      )}
    </MainContent>
    <Footer variant="minimal" />
    </>
  );
}
