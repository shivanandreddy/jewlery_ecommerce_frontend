import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function useLoginShortcut() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Triggers when pressing Alt + L (or Option + L on Mac)
      if (e.altKey && e.key.toLowerCase() === 'l') {
        e.preventDefault();
        navigate('/login');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);
}