import React from 'react';
import { useAppSelector } from '../store/hooks';
import { selectToasts } from '../store/selectors';
import { CheckCircle, AlertTriangle, Info } from 'lucide-react';

export const ToastContainer = () => {
  const toasts = useAppSelector(selectToasts);

  return (
    <div className="toast-container-auracook">
      {toasts.map(toast => {
        let IconComponent = Info;
        if (toast.type === 'success') IconComponent = CheckCircle;
        if (toast.type === 'warning') IconComponent = AlertTriangle;

        return (
          <div key={toast.id} className={`auracook-toast toast-${toast.type}`}>
            <IconComponent size={20} />
            <span>{toast.message}</span>
          </div>
        );
      })}
    </div>
  );
};
