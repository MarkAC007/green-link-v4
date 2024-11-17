import React, { useState } from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import { Menu, X, Leaf } from 'lucide-react';
import { Hero } from './components/Hero';
import { HowItWorks } from './components/HowItWorks';
import { Benefits } from './components/Benefits';
import { Testimonials } from './components/Testimonials';
import { TrustIndicators } from './components/TrustIndicators';
import { RegisterForm } from './components/auth/RegisterForm';
import { LoginForm } from './components/auth/LoginForm';
import { ProfileView } from './components/profile/ProfileView';
import { ProfileEdit } from './components/profile/ProfileEdit';
import { CandidateProfileView } from './components/profile/CandidateProfileView';
import { CandidateProfileForm } from './components/profile/CandidateProfileForm';
import { FacilityProfileView } from './components/profile/FacilityProfileView';
import { FacilityProfileForm } from './components/profile/FacilityProfileForm';
import { CourseList } from './components/courses/CourseList';
import { CourseForm } from './components/courses/CourseForm';
import { CourseEdit } from './components/courses/CourseEdit';
import { JobList } from './components/jobs/JobList';
import { JobForm } from './components/jobs/JobForm';
import { JobEdit } from './components/jobs/JobEdit';
import { JobApplicationsManager } from './components/jobs/JobApplicationsManager';
import { SkillsManagement } from './components/admin/SkillsManagement';
import { useAuth } from './contexts/AuthContext';

function HomePage() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <Benefits />
      <Testimonials />
      <TrustIndicators />
    </>
  );
}

function App() {
  const { currentUser, userProfile, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      window.location.reload();
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const navigationItems = currentUser ? (
    userProfile?.role === 'facility' ? [
      { to: '/courses', label: 'Courses' },
      { to: '/jobs', label: 'Manage Jobs' },
      { to: '/applications', label: 'Applications' }
    ] : [
      { to: '/jobs', label: 'Find Jobs' },
      { to: '/applications', label: 'My Applications' }
    ]
  ) : [];

  const ProfileComponent = userProfile?.role === 'facility' ? FacilityProfileView : CandidateProfileView;
  const ProfileFormComponent = userProfile?.role === 'facility' ? FacilityProfileForm : CandidateProfileForm;

  return (
    <div className="min-h-screen bg-white">
      <header className="fixed w-full bg-white/90 backdrop-blur-sm z-50 border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Link to="/" className="flex items-center gap-2">
                <Leaf className="h-8 w-8 text-green-600" />
                <span className="text-2xl font-bold text-green-600">GreenLink</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navigationItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="text-green-800 hover:text-green-600"
                >
                  {item.label}
                </Link>
              ))}
              {userProfile?.role === 'admin' && (
                <Link
                  to="/admin/skills"
                  className="text-green-800 hover:text-green-600"
                >
                  Skills Management
                </Link>
              )}
            </nav>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center gap-4">
              {currentUser ? (
                <>
                  <Link to="/profile" className="text-green-600 hover:text-green-700">
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-green-600 hover:text-green-700"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-green-600 hover:text-green-700">
                    Login
                  </Link>
                  <Link 
                    to="/register"
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-600 hover:text-gray-900"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-100">
              <div className="flex flex-col space-y-4">
                {navigationItems.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="text-green-800 hover:text-green-600"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                {userProfile?.role === 'admin' && (
                  <Link
                    to="/admin/skills"
                    className="text-green-800 hover:text-green-600"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Skills Management
                  </Link>
                )}
                {currentUser ? (
                  <>
                    <Link
                      to="/profile"
                      className="text-green-600 hover:text-green-700"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="text-green-600 hover:text-green-700 text-left"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="text-green-600 hover:text-green-700"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition inline-block text-center"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="pt-16">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/profile" element={<ProfileComponent />} />
          <Route path="/profile/edit" element={<ProfileFormComponent />} />
          <Route path="/courses" element={<CourseList />} />
          <Route path="/courses/new" element={<CourseForm />} />
          <Route path="/courses/:id/edit" element={<CourseEdit />} />
          <Route path="/jobs" element={<JobList />} />
          <Route path="/jobs/new" element={<JobForm />} />
          <Route path="/jobs/:id/edit" element={<JobEdit />} />
          <Route path="/applications" element={<JobApplicationsManager />} />
          <Route 
            path="/admin/skills" 
            element={
              userProfile?.role === 'admin' ? <SkillsManagement /> : <Navigate to="/" />
            }
          />
        </Routes>
      </main>

      <footer className="bg-green-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">GreenLink</h3>
              <p className="text-green-100">Connecting turf specialists with premier facilities.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Specialists</h4>
              <ul className="space-y-2 text-green-100">
                <li>Create Profile</li>
                <li>Find Jobs</li>
                <li>Resources</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Facilities</h4>
              <ul className="space-y-2 text-green-100">
                <li>Post Jobs</li>
                <li>Browse Specialists</li>
                <li>Pricing</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-green-100">
                <li>Support</li>
                <li>Terms of Service</li>
                <li>Privacy Policy</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-green-800 text-center text-green-100">
            <p>&copy; {new Date().getFullYear()} GreenLink. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;