import { LucideIcon, Home, Send, Code, ChevronRight } from 'lucide-react-native';
import { OpaqueColorValue } from 'react-native';

type IconSymbolName = 'house.fill' | 'paperplane.fill' | 'chevron.left.forwardslash.chevron.right' | 'chevron.right';

const MAPPING: Record<IconSymbolName, LucideIcon> = {
  'house.fill': Home,
  'paperplane.fill': Send,
  'chevron.left.forwardslash.chevron.right': Code,
  'chevron.right': ChevronRight,
};

export function IconSymbol({
  name,
  size = 24,
  color,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
}) {
  const Icon = MAPPING[name];
  return <Icon size={size} color={color as string} />;
}
