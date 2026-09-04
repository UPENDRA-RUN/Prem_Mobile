import React from 'react';
import { useLocation } from 'react-router-dom';
import WelcomeLogin from './WelcomeLogin';

export default function Login() {
  const location = useLocation();

  let defaultMode = 'customer_login';
  if (location.pathname === '/signup') {
    defaultMode = 'customer_signup';
  } else if (location.pathname === '/welcome') {
    defaultMode = 'welcome';
  }

  return <WelcomeLogin defaultMode={defaultMode} />;
}
