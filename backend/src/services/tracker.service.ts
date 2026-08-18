import prisma from '../config/db';

export class TrackerService {
  static async saveProteinGoal(userId: string, data: any) {
    const { weight, height, age, gender, activityLevel, goal, dailyTargetGrams, minRangeGrams, maxRangeGrams, perMealBreakdown } = data;

    const existing = await prisma.proteinGoal.findUnique({ where: { userId } });

    if (existing) {
      return prisma.proteinGoal.update({
        where: { userId },
        data: {
          weight: Number(weight),
          height: Number(height),
          age: Number(age),
          gender,
          activityLevel,
          goal,
          dailyTargetGrams: Number(dailyTargetGrams),
          minRangeGrams: Number(minRangeGrams),
          maxRangeGrams: Number(maxRangeGrams),
          breakfastGrams: Number(perMealBreakdown?.breakfast || 30),
          lunchGrams: Number(perMealBreakdown?.lunch || 35),
          dinnerGrams: Number(perMealBreakdown?.dinner || 35),
          snacksGrams: Number(perMealBreakdown?.snack || 20),
        },
      });
    } else {
      return prisma.proteinGoal.create({
        data: {
          userId,
          weight: Number(weight),
          height: Number(height),
          age: Number(age),
          gender,
          activityLevel,
          goal,
          dailyTargetGrams: Number(dailyTargetGrams),
          minRangeGrams: Number(minRangeGrams),
          maxRangeGrams: Number(maxRangeGrams),
          breakfastGrams: Number(perMealBreakdown?.breakfast || 30),
          lunchGrams: Number(perMealBreakdown?.lunch || 35),
          dinnerGrams: Number(perMealBreakdown?.dinner || 35),
          snacksGrams: Number(perMealBreakdown?.snack || 20),
        },
      });
    }
  }

  static async logProtein(userId: string, data: {
    mealType: string;
    foodName: string;
    proteinGrams: number;
    calories?: number;
    date?: string; // YYYY-MM-DD
  }) {
    const today = data.date || new Date().toISOString().split('T')[0];

    const log = await prisma.proteinLog.create({
      data: {
        userId,
        date: today,
        mealType: data.mealType,
        foodName: data.foodName,
        proteinGrams: Number(data.proteinGrams),
        calories: data.calories ? Number(data.calories) : null,
      },
    });

    // Check if goal achieved today to send badge/notification
    const goal = await prisma.proteinGoal.findUnique({ where: { userId } });
    if (goal) {
      const allToday = await prisma.proteinLog.findMany({
        where: { userId, date: today },
      });
      const totalConsumed = allToday.reduce((acc, l) => acc + l.proteinGrams, 0);

      if (totalConsumed >= goal.dailyTargetGrams) {
        await prisma.notification.create({
          data: {
            userId,
            title: '🏆 Protein Goal Reached Today!',
            message: `Awesome job! You hit ${Math.round(totalConsumed)}g of your ${goal.dailyTargetGrams}g daily protein target.`,
            type: 'GOAL',
          },
        });
      }
    }

    return log;
  }

  static async getDailyTracker(userId: string, dateStr?: string) {
    const date = dateStr || new Date().toISOString().split('T')[0];

    const [user, goal, logs] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId }, select: { dailyProteinTarget: true } }),
      prisma.proteinGoal.findUnique({ where: { userId } }),
      prisma.proteinLog.findMany({
        where: { userId, date },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    const targetGrams = goal?.dailyTargetGrams || user?.dailyProteinTarget || 140;
    const totalConsumed = logs.reduce((acc, l) => acc + l.proteinGrams, 0);
    const totalCalories = logs.reduce((acc, l) => acc + (l.calories || 0), 0);
    const remaining = Math.max(0, targetGrams - totalConsumed);
    const percentage = Math.min(100, Math.round((totalConsumed / targetGrams) * 100));

    // Calculate last 7 days history
    const past7DaysLogs = await prisma.proteinLog.findMany({
      where: { userId },
      orderBy: { date: 'asc' },
    });

    // Group past logs by date
    const historyMap: Record<string, number> = {};
    past7DaysLogs.forEach((l) => {
      historyMap[l.date] = (historyMap[l.date] || 0) + l.proteinGrams;
    });

    // Generate last 7 days array
    const weeklyProgress: Array<{ date: string; day: string; consumed: number; target: number; achieved: boolean }> = [];
    let currentStreak = 0;

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dStr = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      const consumed = historyMap[dStr] || 0;
      const achieved = consumed >= targetGrams && targetGrams > 0;

      if (achieved) {
        currentStreak++;
      } else if (i > 0) {
        currentStreak = 0; // Reset streak if previous day missed
      }

      weeklyProgress.push({
        date: dStr,
        day: dayName,
        consumed: Math.round(consumed),
        target: targetGrams,
        achieved,
      });
    }

    // Achievements calculation
    const achievements = [
      {
        id: 'goal_hit',
        title: 'Daily Goal Achieved',
        desc: 'Hit 100% of your daily protein target',
        unlocked: totalConsumed >= targetGrams,
        icon: '🏆',
      },
      {
        id: 'streak_3',
        title: '3-Day Streak',
        desc: 'Met protein goals 3 days in a row',
        unlocked: currentStreak >= 3,
        icon: '🔥',
      },
      {
        id: 'streak_7',
        title: '7-Day Champion',
        desc: 'Unstoppable consistency for a full week',
        unlocked: currentStreak >= 7,
        icon: '👑',
      },
      {
        id: 'century',
        title: 'Century Club',
        desc: 'Logged over 100g of pure protein in a day',
        unlocked: totalConsumed >= 100,
        icon: '💪',
      },
    ];

    return {
      date,
      targetGrams,
      totalConsumed: Math.round(totalConsumed),
      remaining: Math.round(remaining),
      percentage,
      totalCalories,
      logs,
      weeklyProgress,
      currentStreak,
      achievements,
      goalDetails: goal,
    };
  }

  static async deleteLog(userId: string, logId: string) {
    const log = await prisma.proteinLog.findUnique({ where: { id: logId } });
    if (!log || log.userId !== userId) {
      throw new Error('Log not found or unauthorized.');
    }

    return prisma.proteinLog.delete({ where: { id: logId } });
  }
}
