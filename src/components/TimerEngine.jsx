import React, { useEffect } from 'react';
import { useAppDispatch } from '../store/hooks';
import { timersTicked } from '../store/timerSlice';

export const TimerEngine = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const interval = setInterval(() => dispatch(timersTicked()), 1000);
    return () => clearInterval(interval);
  }, [dispatch]);

  return null;
};
