import React, { useState } from 'react';
import { Button, TextInput, SelectInput, Alert } from '../components';
import { Card } from '../components';

interface LoginPageProps {
  onLoginSuccess?: () => void;
}

export default function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [step, setStep] = useState<'institution' | 'credentials' | 'mfa'>('institution');
  const [institution, setInstitution] = useState('');
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mfaCode, setMfaCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const institutions = [
    { value: 'univ-kigali', label: 'Université de Kigali' },
    { value: 'kigali-institute', label: 'Kigali Institute of Science & Technology' },
    { value: 'aub', label: 'African University of Business' },
    { value: 'demo', label: 'Demo Institution (Testing)' },
  ];

  const roles = [
    { value: 'admin', label: 'Academic Administrator' },
    { value: 'qa', label: 'Quality Assurance Officer' },
    { value: 'analyst', label: 'Data Analyst' },
    { value: 'hod', label: 'Department Head' },
    { value: 'lecturer', label: 'Lecturer' },
  ];

  const handleInstitutionSelect = () => {
    if (institution && role) {
      setStep('credentials');
    } else {
      setError('Please select both institution and role');
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }

    setLoading(true);
    setError('');

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setStep('mfa');
    }, 1000);
  };

  const handleMFAVerify = async () => {
    if (!mfaCode) {
      setError('Please enter MFA code');
      return;
    }

    setLoading(true);
    setError('');

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess?.();
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-primary-container flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="space-y-6">
          {/* Logo */}
          <div className="text-center">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-on-primary text-2xl">school</span>
            </div>
            <h1 className="text-3xl font-bold text-primary">Academic Curator</h1>
            <p className="text-sm text-on-surface-variant mt-2">Higher Education Data Interoperability</p>
          </div>

          {error && <Alert variant="error">{error}</Alert>}

          {step === 'institution' && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-primary">Select Your Institution</h2>
              <SelectInput
                label="Institution"
                placeholder="Choose your institution..."
                options={institutions}
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
              />
              <SelectInput
                label="Role"
                placeholder="Select your role..."
                options={roles}
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
              <Button
                variant="primary"
                size="lg"
                onClick={handleInstitutionSelect}
                className="w-full"
              >
                Continue
                <span className="material-symbols-outlined">arrow_forward</span>
              </Button>
            </div>
          )}

          {step === 'credentials' && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-primary">Sign In</h2>
              <p className="text-sm text-on-surface-variant">
                {institutions.find(i => i.value === institution)?.label}
              </p>
              <TextInput
                label="Email"
                placeholder="your@institution.edu"
                type="email"
                icon="mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextInput
                label="Password"
                placeholder="Enter your password"
                type="password"
                icon="lock"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                variant="primary"
                size="lg"
                onClick={handleLogin}
                isLoading={loading}
                className="w-full"
              >
                Sign In
              </Button>
              <Button
                variant="secondary"
                size="md"
                onClick={() => setStep('institution')}
                className="w-full"
              >
                Back
              </Button>
            </div>
          )}

          {step === 'mfa' && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-primary">Multi-Factor Authentication</h2>
              <Alert variant="info" icon="security">
                A verification code has been sent to your registered email and authenticator app.
              </Alert>
              <TextInput
                label="MFA Code"
                placeholder="000000"
                type="text"
                icon="verified_user"
                value={mfaCode}
                onChange={(e) => setMfaCode(e.target.value.slice(0, 6))}
                maxLength={6}
              />
              <Button
                variant="primary"
                size="lg"
                onClick={handleMFAVerify}
                isLoading={loading}
                className="w-full"
              >
                Verify & Sign In
              </Button>
              <Button
                variant="secondary"
                size="md"
                onClick={() => setStep('credentials')}
                className="w-full"
              >
                Back
              </Button>
            </div>
          )}

          {/* Footer */}
          <div className="text-center text-xs text-on-surface-variant pt-4 border-t border-outline-variant/20">
            <p>Academic Curator v2.1 | Built for Higher Education Data Interoperability</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
