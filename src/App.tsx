import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/auth/AuthContext';
import { Header } from './components/Header';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { SignUp } from './pages/SignUp';
import { Dashboard } from './pages/Dashboard';
import { About } from './pages/About';
import { Privacy } from './pages/Privacy';
import { Terms } from './pages/Terms';
import { Settings } from './pages/Settings';
import { ProjectWizard } from './components/wizard/ProjectWizard';
import { ProjectResults } from './pages/ProjectResults';
import { Language, languageMap } from './i18n';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main className="pt-16">
            <Routes>
              <Route path="/" element={<Home lang="english" />} />
              {(Object.keys(languageMap) as Language[]).map((lang) => (
                <Route
                  key={lang}
                  path={`/${lang}`}
                  element={<Home lang={lang} />}
                />
              ))}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/dashboard/new" element={<ProjectWizard />} />
              <Route path="/dashboard/project/:id/results" element={<ProjectResults />} />
              <Route path="/about" element={<About />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;