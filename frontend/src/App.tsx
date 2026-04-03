import { useState } from 'react';
import { Sidebar, Header, MainContent, Button, TextInput, SelectInput, MetricCard, Alert } from './components';
import './App.css';

function App() {
  const [activeNav, setActiveNav] = useState('dashboard');

  return (
    <div className="min-h-screen bg-surface">
      <Sidebar activeNav={activeNav} onNavClick={setActiveNav} />
      <Header title="Dashboard" />
      
      <MainContent>
        {/* Hero Section */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-primary mb-2">Welcome to Academic Curator</h1>
          <p className="text-lg text-on-surface-variant">
            Higher Education Data Interoperability Framework v2.1
          </p>
        </div>

        {/* Alert */}
        <Alert variant="info" icon="info" className="mb-8">
          Multi-factor authentication (MFA) will be enabled for your account.
        </Alert>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <MetricCard
            label="Total Students"
            value="1,250"
            trend={{ value: 5.2, direction: 'up' }}
            icon="people"
          />
          <MetricCard
            label="Graduation Rate"
            value="84.2%"
            trend={{ value: 2.1, direction: 'up' }}
            icon="school"
          />
          <MetricCard
            label="Faculty-to-Student"
            value="1:18"
            trend={{ value: 1.5, direction: 'down' }}
            icon="group"
          />
          <MetricCard
            label="Programs Active"
            value="42"
            trend={{ value: 8.3, direction: 'up' }}
            icon="menu_book"
          />
        </div>

        {/* Sample Form Section */}
        <div className="bg-surface-container-lowest p-8 rounded-lg border border-outline-variant/30 mb-12">
          <h2 className="text-2xl font-bold text-primary mb-6">Sample Form</h2>
          <div className="space-y-6 max-w-2xl">
            <TextInput
              label="Full Name"
              placeholder="Jean Umucyo"
              type="text"
              icon="person"
            />
            <TextInput
              label="Email Address"
              placeholder="jean@institution.edu"
              type="email"
              icon="mail"
            />
            <SelectInput
              label="Role"
              placeholder="Select role..."
              options={[
                { value: 'admin', label: 'Academic Administrator' },
                { value: 'qa', label: 'Quality Assurance Officer' },
                { value: 'analyst', label: 'Data Analyst' },
                { value: 'hod', label: 'Department Head' },
              ]}
            />
            <div className="flex gap-3">
              <Button variant="primary" size="lg">
                Save Changes
              </Button>
              <Button variant="secondary" size="lg">
                Cancel
              </Button>
            </div>
          </div>
        </div>

        {/* System Info */}
        <div className="text-sm text-on-surface-variant text-center py-8 border-t border-outline-variant/20">
          <p className="font-medium">Academic Curator v2.1 • Built with React + Tailwind CSS</p>
          <p>Design System: Material Design 3 • Color Tokens: 20+ semantic colors</p>
        </div>
      </MainContent>
    </div>
  );
}

export default App;

            <li>
              <a href="https://vite.dev/" target="_blank">
                <img className="logo" src={viteLogo} alt="" />
                Explore Vite
              </a>
            </li>
            <li>
              <a href="https://react.dev/" target="_blank">
                <img className="button-icon" src={reactLogo} alt="" />
                Learn more
              </a>
            </li>
          </ul>
        </div>
        <div id="social">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#social-icon"></use>
          </svg>
          <h2>Connect with us</h2>
          <p>Join the Vite community</p>
          <ul>
            <li>
              <a href="https://github.com/vitejs/vite" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#github-icon"></use>
                </svg>
                GitHub
              </a>
            </li>
            <li>
              <a href="https://chat.vite.dev/" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#discord-icon"></use>
                </svg>
                Discord
              </a>
            </li>
            <li>
              <a href="https://x.com/vite_js" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#x-icon"></use>
                </svg>
                X.com
              </a>
            </li>
            <li>
              <a href="https://bsky.app/profile/vite.dev" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#bluesky-icon"></use>
                </svg>
                Bluesky
              </a>
            </li>
          </ul>
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default App
