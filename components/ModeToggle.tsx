'use client';

import { useTheme } from 'next-themes';
import { Button } from './ui/button';

const ModeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <Button onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}>
      {resolvedTheme === 'dark' ? 'light' : 'dark'}
    </Button>
  );
};

export default ModeToggle;
