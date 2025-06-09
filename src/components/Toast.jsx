import React, { useEffect, useState } from 'react';

function Toast({ message, type, duration = 3000 }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [message, duration]);

  if (!visible) return null;

  const toastClasses = `
    fixed bottom-5 right-5 p-4 rounded-lg shadow-lg text-white
    transition-opacity duration-300
    ${type === 'success' ? 'bg-green-500' : 'bg-red-500'}
  `;

  return (
    <div className={toastClasses}>
      {message}
    </div>
  );
}

export default Toast; 