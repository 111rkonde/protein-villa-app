import { z } from 'zod';

export const proteinCalcSchema = z.object({
  age: z.number().int().min(10).max(120),
  gender: z.enum(['male', 'female', 'other']),
  weight: z.number().positive().min(20).max(300), // in kg
  height: z.number().positive().min(50).max(250), // in cm
  activityLevel: z.enum(['sedentary', 'light', 'moderate', 'very_active', 'extra_active']),
  goal: z.enum(['muscle_gain', 'weight_loss', 'weight_gain', 'maintenance', 'athlete']),
});

export const fitnessMetricsSchema = z.object({
  age: z.number().int().min(10).max(120),
  gender: z.enum(['male', 'female', 'other']),
  weight: z.number().positive().min(20).max(300), // in kg
  height: z.number().positive().min(50).max(250), // in cm
  activityLevel: z.enum(['sedentary', 'light', 'moderate', 'very_active', 'extra_active']),
  goal: z.enum(['muscle_gain', 'weight_loss', 'weight_gain', 'maintenance', 'athlete']).optional(),
});
