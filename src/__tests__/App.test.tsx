// src/__tests__/App.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom'; // Use BrowserRouter to handle routing for tests
import App from '../App'; // Adjust the import path as necessary

// Test the routing logic in the App component
describe('App', () => {
  test('renders LoginPage for / route', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    // Check if the LoginPage content is rendered when the route is '/'
    expect(screen.getByText(/login/i)).toBeInTheDocument(); // Adjust this to something specific in LoginPage
  });

  test('renders DashboardPage for /dashboard route', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    // Navigate to /dashboard and check if the DashboardPage is rendered
    window.history.pushState({}, 'Dashboard', '/dashboard');

    expect(screen.getByText(/dashboard/i)).toBeInTheDocument(); // Adjust this to something specific in DashboardPage
  });

  test('redirects to / for invalid routes', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    // Navigate to an invalid route
    window.history.pushState({}, 'Invalid Route', '/invalid-route');

    // Check if it redirects to the login page
    expect(screen.getByText(/login/i)).toBeInTheDocument(); // Adjust this to something specific in LoginPage
  });
});
