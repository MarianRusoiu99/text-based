import { useCallback } from 'react';
import { toast } from 'sonner';

export const useToast = () => {
  const showSuccess = useCallback((message: string, description?: string) => {
    toast.success(message, {
      description,
    });
  }, []);

  const showError = useCallback((message: string, description?: string) => {
    toast.error(message, {
      description,
    });
  }, []);

  const showInfo = useCallback((message: string, description?: string) => {
    toast.info(message, {
      description,
    });
  }, []);

  const showWarning = useCallback((message: string, description?: string) => {
    toast.warning(message, {
      description,
    });
  }, []);

  return {
    showSuccess,
    showError,
    showInfo,
    showWarning,
  };
};