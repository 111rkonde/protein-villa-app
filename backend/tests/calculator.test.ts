import { describe, it, expect } from 'vitest';
import { CalculatorService } from '../src/services/calculator.service';

describe('CalculatorService', () => {
  it('should calculate accurate daily protein intake for muscle gain', () => {
    const result = CalculatorService.calculateProtein({
      age: 25,
      gender: 'male',
      weight: 75,
      height: 180,
      activityLevel: 'very_active',
      goal: 'muscle_gain',
    });

    expect(result.dailyProteinGoal).toBeGreaterThan(150);
    expect(result.dailyProteinGoal).toBeLessThan(200);
    expect(result.perMealBreakdown.breakfast).toBeGreaterThan(0);
    expect(result.perMealBreakdown.lunch).toBeGreaterThan(0);
    expect(result.perMealBreakdown.postWorkout).toBeGreaterThan(0);
    expect(result.recommendations.length).toBeGreaterThan(0);
  });

  it('should calculate correct BMI, BMR, and TDEE metrics', () => {
    const result = CalculatorService.calculateFitnessMetrics({
      age: 30,
      gender: 'male',
      weight: 80,
      height: 180,
      activityLevel: 'moderate',
      goal: 'muscle_gain',
    });

    expect(result.bmi.value).toBe(24.7);
    expect(result.bmi.category).toBe('Normal Weight');
    expect(result.bmr).toBeGreaterThan(1700);
    expect(result.tdee).toBeGreaterThan(result.bmr);
    expect(result.targetCalories).toBeGreaterThan(result.tdee);
    expect(result.macros.protein.grams).toBeGreaterThan(100);
  });
});
