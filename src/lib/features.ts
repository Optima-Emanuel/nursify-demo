// src/lib/features.ts

import { get } from '@vercel/edge-config';

export type FeatureKey = 'lesson' | 'dialog' | 'test' | 'gamification';

const DEFAULT_FEATURES = {
  lesson: false,
  dialog: false,
  test: false,
  gamification: false,
} as const;

// Server-side: Fetch features from Edge Config
export async function getFeatures(): Promise<Record<FeatureKey, boolean>> {
  try {
    const config = await get<Record<FeatureKey, boolean>>('features');
    if (config && typeof config === 'object') {
      return {
        lesson: Boolean(config.lesson ?? DEFAULT_FEATURES.lesson),
        dialog: Boolean(config.dialog ?? DEFAULT_FEATURES.dialog),
        test: Boolean(config.test ?? DEFAULT_FEATURES.test),
        gamification: Boolean(config.gamification ?? DEFAULT_FEATURES.gamification),
      };
    }
  } catch (error) {
    console.warn('Failed to fetch features from Edge Config:', error);
  }
  return DEFAULT_FEATURES;
}

// Server-side: Check if a feature is on
export async function isOn(k: FeatureKey): Promise<boolean> {
  const features = await getFeatures();
  return features[k] ?? false;
}

// Client-side: Use this via API route
export function isOnSync(k: FeatureKey, features: Record<FeatureKey, boolean>): boolean {
  return features[k] ?? false;
}
