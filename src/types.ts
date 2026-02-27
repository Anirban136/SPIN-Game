export enum Mode {
  FLIRTY = 'FLIRTY',
  HOT = 'HOT',
  NAUGHTY = 'NAUGHTY',
  HEAVENLY = 'HEAVENLY'
}

export interface Task {
  id: string;
  text: string;
  visual?: string;
  image?: string;
}

export interface ModeConfig {
  id: Mode;
  name: string;
  icon: string;
  description: string;
  color: string;
  tasks: Task[];
  requiresConsent: boolean;
  isPremium: boolean;
}
