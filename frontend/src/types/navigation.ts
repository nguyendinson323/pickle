import { ComponentType } from 'react';

export interface NavigationItem {
  name: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
  current?: boolean;
  badge?: number | string;
}

export interface RoleConfig {
  title: string;
  color: string;
  navigation: NavigationItem[];
}

export type UserRole = 
  | 'admin'
  | 'state' 
  | 'club'
  | 'partner'
  | 'coach'
  | 'player';