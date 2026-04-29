import { HeroGeometric } from '../ui/shape-landing-hero';

export default function HeroSection({ onStart }: { onStart: () => void }) {
  return (
    <HeroGeometric
      badge="DES Simulation"
      title1="DES"
      title2="Cryptography"
      onStart={onStart}
    />
  );
}
