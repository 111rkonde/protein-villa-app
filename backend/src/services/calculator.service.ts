export class CalculatorService {
  /**
   * Calculate recommended daily protein intake and meal breakdowns
   */
  static calculateProtein(data: {
    age: number;
    gender: 'male' | 'female' | 'other';
    weight: number; // in kg
    height: number; // in cm
    activityLevel: 'sedentary' | 'light' | 'moderate' | 'very_active' | 'extra_active';
    goal: 'muscle_gain' | 'weight_loss' | 'weight_gain' | 'maintenance' | 'athlete';
  }) {
    const { weight, goal, activityLevel } = data;

    // Multipliers (g protein per kg of bodyweight) based on ISSN & ACSM guidelines
    const goalMultipliers: Record<string, { min: number; rec: number; max: number }> = {
      muscle_gain: { min: 1.8, rec: 2.2, max: 2.6 },
      weight_loss: { min: 1.6, rec: 2.0, max: 2.4 },
      weight_gain: { min: 1.5, rec: 1.8, max: 2.2 },
      maintenance: { min: 1.2, rec: 1.5, max: 1.8 },
      athlete: { min: 2.0, rec: 2.4, max: 2.8 },
    };

    // Activity bump
    const activityBump: Record<string, number> = {
      sedentary: 0.95,
      light: 1.0,
      moderate: 1.05,
      very_active: 1.1,
      extra_active: 1.15,
    };

    const multiplier = goalMultipliers[goal] || goalMultipliers.maintenance;
    const factor = activityBump[activityLevel] || 1.0;

    const minProtein = Math.round(weight * multiplier.min * factor);
    const recommendedProtein = Math.round(weight * multiplier.rec * factor);
    const maxProtein = Math.round(weight * multiplier.max * factor);

    // Suggested per-meal distribution (g)
    const breakfast = Math.round(recommendedProtein * 0.25);
    const lunch = Math.round(recommendedProtein * 0.28);
    const postWorkout = Math.round(recommendedProtein * 0.22);
    const dinner = Math.round(recommendedProtein * 0.20);
    const snack = Math.max(10, recommendedProtein - (breakfast + lunch + postWorkout + dinner));

    // Recommend targeted supplements
    const recommendations = this.getRecommendedSupplementsForGoal(goal);

    return {
      dailyProteinGoal: recommendedProtein,
      minRequirement: minProtein,
      maxRecommendedRange: maxProtein,
      perMealBreakdown: {
        breakfast,
        lunch,
        postWorkout,
        dinner,
        snack,
      },
      proteinPerKg: Number((recommendedProtein / weight).toFixed(2)),
      recommendations,
      disclaimer: 'This estimation is based on sports nutrition guidelines (ISSN/ACSM) and is intended for fitness optimization, not medical diagnosis.',
    };
  }

  /**
   * Complete Body Metric Calculator: BMI, BMR, TDEE, Calorie Targets & Macro Breakdown
   */
  static calculateFitnessMetrics(data: {
    age: number;
    gender: 'male' | 'female' | 'other';
    weight: number; // in kg
    height: number; // in cm
    activityLevel: 'sedentary' | 'light' | 'moderate' | 'very_active' | 'extra_active';
    goal?: 'muscle_gain' | 'weight_loss' | 'weight_gain' | 'maintenance' | 'athlete';
  }) {
    const { age, gender, weight, height, activityLevel, goal = 'muscle_gain' } = data;

    // 1. BMI Calculation: kg / (m)^2
    const heightInMeters = height / 100;
    const bmi = Number((weight / (heightInMeters * heightInMeters)).toFixed(1));

    let bmiCategory = 'Normal Weight';
    let bmiColor = '#10b981';
    if (bmi < 18.5) {
      bmiCategory = 'Underweight';
      bmiColor = '#3b82f6';
    } else if (bmi >= 25 && bmi < 29.9) {
      bmiCategory = 'Overweight';
      bmiColor = '#f59e0b';
    } else if (bmi >= 30) {
      bmiCategory = 'Obese';
      bmiColor = '#ef4444';
    }

    const healthyMinWeight = Number((18.5 * heightInMeters * heightInMeters).toFixed(1));
    const healthyMaxWeight = Number((24.9 * heightInMeters * heightInMeters).toFixed(1));

    // 2. BMR Calculation (Mifflin-St Jeor Formula)
    // Men: (10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) + 5
    // Women: (10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) - 161
    let bmr = 10 * weight + 6.25 * height - 5 * age;
    if (gender === 'male') {
      bmr += 5;
    } else {
      bmr -= 161;
    }
    bmr = Math.round(bmr);

    // 3. TDEE Multipliers
    const activityMultipliers: Record<string, number> = {
      sedentary: 1.2, // Little or no exercise
      light: 1.375, // Exercise 1-3 times/week
      moderate: 1.55, // Exercise 3-5 times/week
      very_active: 1.725, // Hard exercise 6-7 times/week
      extra_active: 1.9, // Very intense training or physical job
    };

    const tdee = Math.round(bmr * (activityMultipliers[activityLevel] || 1.2));

    // 4. Target Calorie Adjustment based on Goal
    let targetCalories = tdee;
    if (goal === 'weight_loss') targetCalories = Math.round(tdee - 500); // 500 kcal deficit
    if (goal === 'muscle_gain') targetCalories = Math.round(tdee + 350); // Lean surplus
    if (goal === 'weight_gain') targetCalories = Math.round(tdee + 600); // Bulk surplus
    if (goal === 'athlete') targetCalories = Math.round(tdee + 250);

    // 5. Macro Distribution (Protein 4 kcal/g, Carbs 4 kcal/g, Fat 9 kcal/g)
    const proteinResult = this.calculateProtein({
      age,
      gender,
      weight,
      height,
      activityLevel,
      goal,
    });

    const proteinGrams = proteinResult.dailyProteinGoal;
    const proteinCalories = proteinGrams * 4;

    // Fat: 25-30% of total calories
    const fatCalories = Math.round(targetCalories * 0.25);
    const fatGrams = Math.round(fatCalories / 9);

    // Carbs: Remainder calories
    const carbCalories = Math.max(0, targetCalories - (proteinCalories + fatCalories));
    const carbGrams = Math.round(carbCalories / 4);

    return {
      bmi: {
        value: bmi,
        category: bmiCategory,
        color: bmiColor,
        healthyWeightRange: `${healthyMinWeight} kg - ${healthyMaxWeight} kg`,
      },
      bmr,
      tdee,
      targetCalories,
      macros: {
        protein: { grams: proteinGrams, calories: proteinCalories, percent: Math.round((proteinCalories / targetCalories) * 100) },
        carbs: { grams: carbGrams, calories: carbCalories, percent: Math.round((carbCalories / targetCalories) * 100) },
        fat: { grams: fatGrams, calories: fatCalories, percent: Math.round((fatCalories / targetCalories) * 100) },
      },
      proteinBreakdown: proteinResult,
    };
  }

  private static getRecommendedSupplementsForGoal(goal: string) {
    switch (goal) {
      case 'muscle_gain':
        return [
          { name: '100% Whey Isolate Protein', reason: 'Fast absorption for post-workout muscle protein synthesis.' },
          { name: 'Creatine Monohydrate', reason: 'Increases ATP cellular energy for explosive power and hypertrophy.' },
          { name: 'High-Calorie Peanut Butter', reason: 'Clean calorie density packed with natural healthy fats & protein.' },
        ];
      case 'weight_loss':
        return [
          { name: 'Hydrolyzed Whey Isolate', reason: 'Ultra-low carb and zero fat to preserve lean muscle during deficit.' },
          { name: 'BCAA & Electrolytes', reason: 'Prevents muscle catabolism during fasted or intense cardio sessions.' },
          { name: 'High Potency Omega-3 Fish Oil', reason: 'Supports metabolic efficiency, joint recovery & inflammation control.' },
        ];
      case 'weight_gain':
        return [
          { name: 'Super Mass Gainer Matrix', reason: 'Dense complex carbs & 50g+ protein per serving for caloric surplus.' },
          { name: 'Creatine Monohydrate', reason: 'Volumizes muscle cells and accelerates strength gains.' },
          { name: 'High Protein Peanut Butter', reason: 'Nutrient-rich healthy calories between meals.' },
        ];
      case 'athlete':
        return [
          { name: 'Explosive Pre-Workout', reason: 'Enhanced blood flow, nitric oxide pump and peak neurological focus.' },
          { name: 'EAA Essential Aminos', reason: 'Intra-workout hydration and rapid muscle fatigue recovery.' },
          { name: 'Daily Performance Multivitamin', reason: 'Replenishes essential micronutrients lost during heavy training.' },
        ];
      default:
        return [
          { name: 'Standard Whey Protein', reason: 'Daily nutritional support for general wellness and tone.' },
          { name: 'Multivitamins & Minerals', reason: 'Comprehensive daily micronutrient baseline.' },
          { name: 'Omega-3 Fish Oil', reason: 'Cardiovascular and joint health optimization.' },
        ];
    }
  }
}
