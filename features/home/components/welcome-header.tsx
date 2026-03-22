import { ScreenTitle } from "@/components/screen-title";

interface WelcomeHeaderProps {
  name: string;
  subtitle: string;
}

export function WelcomeHeader({ name, subtitle }: WelcomeHeaderProps) {
  return <ScreenTitle title={`Hola, ${name}`} subtitle={subtitle} />;
}
