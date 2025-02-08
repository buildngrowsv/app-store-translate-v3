/*
* File: App.tsx
* Description: Main application component
* Details: Provides routing and global providers for the application
* - Wraps the app with ThemeProvider for dark mode support
* - Includes all route definitions
* - Provides the main layout structure
* Date: 2024-03-20
*/

import React from 'react';
import { Routes, Route } from 'react-router-dom';
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
import { ProtectedRoute } from './components/ProtectedRoute';
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <Header />
        <main className="pt-16">
          <Routes>
            <Route path="/" element={<Home lang="english" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/about" element={<About />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/project/new"
              element={
                <ProtectedRoute>
                  <ProjectWizard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/project/:id/results"
              element={
                <ProtectedRoute>
                  <ProjectResults />
                </ProtectedRoute>
              }
            />
            {/* Language routes */}
            {Object.keys(languageMap).map((lang) => (
              <Route
                key={lang}
                path={`/${lang === 'english' ? '' : lang}`}
                element={<Home lang={lang as Language} />}
              />
            ))}
          </Routes>
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;