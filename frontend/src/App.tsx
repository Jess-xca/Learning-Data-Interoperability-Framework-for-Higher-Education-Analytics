import { useState } from 'react';
import { Sidebar, Header, MainContent } from './components';
import { LoginPage, DashboardPage } from './components/pages';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeNav, setActiveNav] = useState('dashboard');

  if (!isLoggedIn) {
    return (
      <LoginPage
        onLoginSuccess={() => setIsLoggedIn(true)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      <Sidebar activeNav={activeNav} onNavClick={setActiveNav} />
      <Header title="Dashboard" />
      
      {activeNav === 'dashboard' && <DashboardPage />}
      
      {activeNav === 'settings' && (
        <MainContent>
          <h1 className="text-4xl font-bold text-primary mb-2">Settings</h1>
          <p className="text-lg text-on-surface-variant mb-10">Settings page coming soon...</p>
        </MainContent>
      )}
      
      {!['dashboard', 'settings'].includes(activeNav) && (
        <MainContent>
          <h1 className="text-4xl font-bold text-primary mb-2 capitalize">{activeNav}</h1>
          <p className="text-lg text-on-surface-variant mb-10">{activeNav} page coming soon...</p>
        </MainContent>
      )}
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
