import ModeToggle from '@/components/ModeToggle';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col justify-center items-center">
      <h1 className="text-5xl">ETF Visualizer</h1>
      <Button>Click me !</Button>
      <ModeToggle />
    </main>
  );
}
