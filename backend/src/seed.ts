import prisma from './config/db';
import { hashPassword } from './utils/password';

async function main() {
  console.log('🌱 Starting Protein Villa Database Seeding...');

  // Clean existing records in correct relation order
  await prisma.adminActivity.deleteMany();
  await prisma.inventoryLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.proteinLog.deleteMany();
  await prisma.proteinGoal.deleteMany();
  await prisma.review.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.verificationCode.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.address.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.user.deleteMany();

  console.log('🧹 Cleaned existing database records.');

  // 1. Create Demo Users
  const userPasswordHash = await hashPassword('User@12345');
  const adminPasswordHash = await hashPassword('Owner@12345');

  const demoUser = await prisma.user.create({
    data: {
      name: 'Alex Johnson',
      email: 'user@proteinvilla.demo',
      password: userPasswordHash,
      role: 'USER',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      phone: '+91 98765 43210',
      weight: 75,
      height: 178,
      fitnessGoal: 'muscle_gain',
      activityLevel: 'very_active',
      dailyProteinTarget: 160,
      addresses: {
        create: {
          fullName: 'Alex Johnson',
          street: '402, Titanium Heights, MG Road',
          city: 'Bengaluru',
          state: 'Karnataka',
          postalCode: '560001',
          country: 'India',
          phone: '+91 98765 43210',
          isDefault: true,
        },
      },
      proteinGoal: {
        create: {
          weight: 75,
          height: 178,
          age: 26,
          gender: 'male',
          activityLevel: 'very_active',
          goal: 'muscle_gain',
          dailyTargetGrams: 160,
          minRangeGrams: 135,
          maxRangeGrams: 185,
          breakfastGrams: 40,
          lunchGrams: 45,
          dinnerGrams: 45,
          snacksGrams: 30,
        },
      },
    },
  });

  // Secondary user alias for easy login
  await prisma.user.create({
    data: {
      name: 'Alex Johnson (Alias)',
      email: 'user@proteinvilla.com',
      password: await hashPassword('User@123'),
      role: 'USER',
      phone: '+91 98765 43210',
      dailyProteinTarget: 160,
    },
  });

  const demoAdmin = await prisma.user.create({
    data: {
      name: 'Marcus Vance (Store Owner)',
      email: 'owner@proteinvilla.demo',
      password: adminPasswordHash,
      role: 'ADMIN',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      phone: '+91 91234 56789',
      weight: 82,
      height: 184,
      fitnessGoal: 'strength',
      activityLevel: 'extra_active',
      dailyProteinTarget: 180,
    },
  });

  // Secondary admin alias for easy login
  await prisma.user.create({
    data: {
      name: 'Marcus Vance (Owner Alias)',
      email: 'owner@proteinvilla.com',
      password: await hashPassword('Owner@123'),
      role: 'ADMIN',
      phone: '+91 91234 56789',
    },
  });

  console.log('👤 Created demo accounts (User & Admin).');

  // 2. Categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Whey Protein',
        slug: 'whey-protein',
        description: 'Ultra-pure whey isolate, concentrate, and hydrolyzed blends for maximum muscle recovery.',
        icon: 'Dumbbell',
        image: 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=600&auto=format&fit=crop&q=80',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Mass Gainers',
        slug: 'mass-gainers',
        description: 'Calorically dense, complex carbohydrate and protein formulas for massive size & strength.',
        icon: 'TrendingUp',
        image: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=600&auto=format&fit=crop&q=80',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Creatine & Pre-Workout',
        slug: 'creatine-pre-workout',
        description: 'Explosive energy, skin-splitting pumps, razor focus, and cellular ATP regeneration.',
        icon: 'Zap',
        image: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=600&auto=format&fit=crop&q=80',
      },
    }),
    prisma.category.create({
      data: {
        name: 'BCAA & Aminos',
        slug: 'bcaa-aminos',
        description: 'Essential amino acids and branched-chain aminos for intra-workout endurance & hydration.',
        icon: 'Activity',
        image: 'https://images.unsplash.com/photo-1546483875-ad9014c88eba?w=600&auto=format&fit=crop&q=80',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Health & Vitamins',
        slug: 'health-vitamins',
        description: 'High potency multivitamins, Omega-3 Fish Oil, joint care, and metabolic essentials.',
        icon: 'Heart',
        image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Protein Foods & Snacks',
        slug: 'protein-foods-snacks',
        description: 'High-protein peanut butter, crispy protein bars, cookies, and delicious fitness snacks.',
        icon: 'ShoppingBag',
        image: 'https://images.unsplash.com/photo-1622484216809-5d27d716cf97?w=600&auto=format&fit=crop&q=80',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Fitness Accessories',
        slug: 'fitness-accessories',
        description: 'Stainless steel leakproof shakers, heavy-duty wrist wraps, and lifting accessories.',
        icon: 'Package',
        image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80',
      },
    }),
  ]);

  const [catWhey, catMass, catCreatine, catBcaa, catHealth, catFood, catAccessory] = categories;
  console.log(`📦 Created ${categories.length} product categories.`);

  // 3. Brands
  const brands = await Promise.all([
    prisma.brand.create({
      data: {
        name: 'Protein Villa Elite',
        slug: 'protein-villa-elite',
        logo: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=100&auto=format&fit=crop&q=80',
        description: 'Our flagship in-house lab-tested ultra-pure gold standard supplement range.',
      },
    }),
    prisma.brand.create({
      data: {
        name: 'Optimum Nutrition (ON)',
        slug: 'optimum-nutrition',
        logo: 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=100&auto=format&fit=crop&q=80',
        description: 'World #1 Selling Whey Protein and award-winning sports nutrition.',
      },
    }),
    prisma.brand.create({
      data: {
        name: 'MuscleBlaze',
        slug: 'muscleblaze',
        logo: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=100&auto=format&fit=crop&q=80',
        description: 'Pioneering Informed-Choice certified performance supplements in India.',
      },
    }),
    prisma.brand.create({
      data: {
        name: 'Dymatize',
        slug: 'dymatize',
        logo: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=100&auto=format&fit=crop&q=80',
        description: 'Scientifically proven 100% hydrolyzed whey isolate formulations.',
      },
    }),
    prisma.brand.create({
      data: {
        name: 'MuscleTech',
        slug: 'muscletech',
        logo: 'https://images.unsplash.com/photo-1546483875-ad9014c88eba?w=100&auto=format&fit=crop&q=80',
        description: 'Advanced research-backed NitroTech formulas for extreme muscle growth.',
      },
    }),
    prisma.brand.create({
      data: {
        name: 'Cellucor',
        slug: 'cellucor',
        logo: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=100&auto=format&fit=crop&q=80',
        description: 'Creators of the iconic C4 explosive pre-workout series.',
      },
    }),
  ]);

  const [brandPV, brandON, brandMB, brandDymatize, brandTech, brandCellucor] = brands;
  console.log(`🏷️ Created ${brands.length} supplement brands.`);

  // 4. Products (25+ items)
  const productsData = [
    {
      name: 'PV Elite ISO-Gold 100% Pure Whey Isolate',
      slug: 'pv-elite-iso-gold-whey-isolate',
      brandId: brandPV.id,
      categoryId: catWhey.id,
      description: 'PV Elite ISO-Gold is our flagship cross-flow microfiltered 100% whey isolate. Delivering 28g of pure native protein per scoop with zero added sugars, less than 1g fat, and 6.5g BCAAs for lightning-fast post-workout recovery.',
      shortDescription: '28g Pure Isolate Protein | 6.5g BCAAs | Ultra Fast Absorption',
      price: 4299,
      discountPercent: 15,
      stockQuantity: 85,
      lowStockThreshold: 12,
      isFeatured: true,
      isBestSeller: true,
      rating: 4.9,
      reviewCount: 142,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&auto=format&fit=crop&q=80',
      ]),
      nutritionInfo: JSON.stringify({
        protein: 28,
        calories: 120,
        carbs: 1.2,
        fat: 0.5,
        servingSize: '31g (1 Scoop)',
        servingsPerContainer: 65,
        bcaa: '6.5g',
      }),
      goalTags: JSON.stringify(['Muscle Gain', 'Lean Muscle', 'Weight Loss']),
      flavorOptions: JSON.stringify(['Belgian Dark Chocolate', 'Gourmet Vanilla', 'Mocha Cappuccino', 'Almond Kulfi']),
      sizeOptions: JSON.stringify(['1 kg / 2.2 lbs', '2 kg / 4.4 lbs', '4 kg / 8.8 lbs']),
      model3dType: 'standard_jar',
      model3dColor: '#10b981',
      model3dLabel: 'ISO-GOLD WHEY',
      verificationCode: 'PV-AUTH-9921-WHEY',
    },
    {
      name: 'Optimum Nutrition Gold Standard 100% Whey',
      slug: 'on-gold-standard-100-whey',
      brandId: brandON.id,
      categoryId: catWhey.id,
      description: 'The worlds undisputed #1 selling whey protein. Packed with 24g of whey protein isolate and concentrate blend, 5.5g naturally occurring BCAAs, and 4g glutamine per serving. Easy instantized mixing.',
      shortDescription: '24g Protein | 5.5g BCAAs | 4g Glutamine | World #1',
      price: 3899,
      discountPercent: 10,
      stockQuantity: 120,
      lowStockThreshold: 15,
      isFeatured: true,
      isBestSeller: true,
      rating: 4.8,
      reviewCount: 310,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=800&auto=format&fit=crop&q=80',
      ]),
      nutritionInfo: JSON.stringify({
        protein: 24,
        calories: 120,
        carbs: 3,
        fat: 1.5,
        servingSize: '30.4g (1 Scoop)',
        servingsPerContainer: 74,
        bcaa: '5.5g',
      }),
      goalTags: JSON.stringify(['Muscle Gain', 'Maintenance', 'Strength']),
      flavorOptions: JSON.stringify(['Double Rich Chocolate', 'Delicious Strawberry', 'Vanilla Ice Cream', 'Chocolate Peanut Butter']),
      sizeOptions: JSON.stringify(['2 lbs (907g)', '5 lbs (2.27kg)', '10 lbs (4.54kg)']),
      model3dType: 'standard_jar',
      model3dColor: '#ef4444',
      model3dLabel: 'ON GOLD WHEY',
      verificationCode: 'PV-AUTH-8842-ISO',
    },
    {
      name: 'Dymatize ISO 100 Hydrolyzed 100% Whey Isolate',
      slug: 'dymatize-iso-100-hydrolyzed',
      brandId: brandDymatize.id,
      categoryId: catWhey.id,
      description: 'Dymatize ISO 100 is formulated using cross-flow microfiltration, multi-step purification and hydrolysis process that preserves important muscle-building protein fractions while removing excess carbs, fat, lactose, and cholesterol.',
      shortDescription: '25g Hydrolyzed Isolate | 5.5g BCAAs | <1g Sugar | Ultra Pure',
      price: 6999,
      discountPercent: 12,
      stockQuantity: 42,
      lowStockThreshold: 8,
      isFeatured: true,
      isBestSeller: false,
      rating: 4.9,
      reviewCount: 98,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&auto=format&fit=crop&q=80',
      ]),
      nutritionInfo: JSON.stringify({
        protein: 25,
        calories: 110,
        carbs: 1,
        fat: 0.5,
        servingSize: '30g (1 Scoop)',
        servingsPerContainer: 76,
        bcaa: '5.5g',
      }),
      goalTags: JSON.stringify(['Lean Muscle', 'Weight Loss', 'Athlete']),
      flavorOptions: JSON.stringify(['Gourmet Chocolate', 'Fudge Brownie', 'Birthday Cake', 'Smooth Banana']),
      sizeOptions: JSON.stringify(['5 lbs (2.3kg)']),
      model3dType: 'standard_jar',
      model3dColor: '#3b82f6',
      model3dLabel: 'DYMATIZE ISO100',
      verificationCode: 'PV-AUTH-7731-DYM',
    },
    {
      name: 'MuscleBlaze Biozyme Performance Whey',
      slug: 'muscleblaze-biozyme-performance-whey',
      brandId: brandMB.id,
      categoryId: catWhey.id,
      description: 'Clinically tested Enhanced Absorption Formula (EAF) ensuring 50% higher protein absorption and 33% higher BCAA absorption. Clinically tested on Indian bodies for zero protein bloat.',
      shortDescription: '25g Biozyme Protein | 50% Higher Absorption | Clinically Tested',
      price: 2999,
      discountPercent: 18,
      stockQuantity: 95,
      lowStockThreshold: 15,
      isFeatured: false,
      isBestSeller: true,
      rating: 4.7,
      reviewCount: 220,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1546483875-ad9014c88eba?w=800&auto=format&fit=crop&q=80',
      ]),
      nutritionInfo: JSON.stringify({
        protein: 25,
        calories: 130,
        carbs: 3.5,
        fat: 1.8,
        servingSize: '36g (1 Scoop)',
        servingsPerContainer: 55,
        bcaa: '5.51g',
      }),
      goalTags: JSON.stringify(['Muscle Gain', 'Strength']),
      flavorOptions: JSON.stringify(['Rich Chocolate', 'Magical Mango', 'Kesar Kulfi', 'Cafe Mocha']),
      sizeOptions: JSON.stringify(['1 kg / 2.2 lbs', '2 kg / 4.4 lbs', '4 kg / 8.8 lbs']),
      model3dType: 'standard_jar',
      model3dColor: '#f97316',
      model3dLabel: 'MB BIOZYME',
      verificationCode: 'PV-AUTH-6612-MBW',
    },
    {
      name: 'MuscleTech NitroTech Ripped Lean Whey Matrix',
      slug: 'muscletech-nitrotech-ripped',
      brandId: brandTech.id,
      categoryId: catWhey.id,
      description: 'NitroTech Ripped is a one-of-a-kind formula delivering ultra-pure 30g whey peptides & isolate combined with scientifically tested weight loss ingredients: L-Carnitine L-Tartrate, CLA, and Green Tea Extract.',
      shortDescription: '30g Whey Peptides + CLA & L-Carnitine | Lean Muscle & Shredding',
      price: 4999,
      discountPercent: 20,
      stockQuantity: 38,
      lowStockThreshold: 10,
      isFeatured: false,
      isBestSeller: false,
      rating: 4.6,
      reviewCount: 76,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=800&auto=format&fit=crop&q=80',
      ]),
      nutritionInfo: JSON.stringify({
        protein: 30,
        calories: 170,
        carbs: 4,
        fat: 2.5,
        servingSize: '43g (1 Scoop)',
        servingsPerContainer: 42,
        bcaa: '6.8g',
      }),
      goalTags: JSON.stringify(['Weight Loss', 'Lean Muscle']),
      flavorOptions: JSON.stringify(['French Vanilla Swirl', 'Chocolate Fudge Brownie']),
      sizeOptions: JSON.stringify(['4 lbs (1.81kg)']),
      model3dType: 'standard_jar',
      model3dColor: '#a855f7',
      model3dLabel: 'NITROTECH RIPPED',
      verificationCode: 'PV-AUTH-5521-NTR',
    },
    // Mass Gainers
    {
      name: 'PV Monster Mass Caloric Density Gainer',
      slug: 'pv-monster-mass-gainer',
      brandId: brandPV.id,
      categoryId: catMass.id,
      description: 'Formulated for hardgainers struggling to pack on raw size. Delivers 1,250 clean calories, 52g multi-stage timed-release protein matrix, 250g complex energizing carbohydrates, and 3g creatine per serving.',
      shortDescription: '1250 Calories | 52g Protein | 250g Complex Carbs | 3g Creatine',
      price: 3499,
      discountPercent: 25,
      stockQuantity: 60,
      lowStockThreshold: 10,
      isFeatured: true,
      isBestSeller: true,
      rating: 4.8,
      reviewCount: 110,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&auto=format&fit=crop&q=80',
      ]),
      nutritionInfo: JSON.stringify({
        protein: 52,
        calories: 1250,
        carbs: 252,
        fat: 4.5,
        servingSize: '334g (2 Scoops)',
        servingsPerContainer: 16,
        bcaa: '11.5g',
      }),
      goalTags: JSON.stringify(['Weight Gain', 'Bulking', 'Strength']),
      flavorOptions: JSON.stringify(['Chocolate Brownie', 'Banana Cream', 'Cookies & Cream']),
      sizeOptions: JSON.stringify(['3 kg / 6.6 lbs', '5 kg / 11 lbs']),
      model3dType: 'standard_jar',
      model3dColor: '#eab308',
      model3dLabel: 'MONSTER MASS',
      verificationCode: 'PV-AUTH-4419-MASS',
    },
    {
      name: 'Optimum Nutrition Serious Mass High Protein Gainer',
      slug: 'on-serious-mass-gainer',
      brandId: brandON.id,
      categoryId: catMass.id,
      description: 'The classic weight gain powerhouse. 1,250 calories per serving with 50 grams of muscle-building protein, 250+ grams of carbohydrates with no added sugar, and 25 vitamins and essential minerals.',
      shortDescription: '1250 Calories | 50g Protein | 25 Vitamins & Minerals',
      price: 3999,
      discountPercent: 15,
      stockQuantity: 45,
      lowStockThreshold: 8,
      isFeatured: false,
      isBestSeller: true,
      rating: 4.7,
      reviewCount: 185,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=800&auto=format&fit=crop&q=80',
      ]),
      nutritionInfo: JSON.stringify({
        protein: 50,
        calories: 1250,
        carbs: 254,
        fat: 4,
        servingSize: '336g (2 Scoops)',
        servingsPerContainer: 16,
        bcaa: '10.8g',
      }),
      goalTags: JSON.stringify(['Weight Gain', 'Bulking']),
      flavorOptions: JSON.stringify(['Chocolate', 'Vanilla', 'Strawberry']),
      sizeOptions: JSON.stringify(['6 lbs (2.72kg)', '12 lbs (5.44kg)']),
      model3dType: 'standard_jar',
      model3dColor: '#ef4444',
      model3dLabel: 'SERIOUS MASS',
      verificationCode: 'PV-AUTH-3312-ONSM',
    },
    // Creatine & Pre-Workout
    {
      name: 'PV Creapure Micronized Creatine Monohydrate',
      slug: 'pv-creapure-micronized-creatine',
      brandId: brandPV.id,
      categoryId: catCreatine.id,
      description: '100% German Creapure pharmaceutical-grade micronized creatine monohydrate. Rapidly increases intramuscular phosphocreatine stores for explosive anaerobic power, hypertrophy, and brain cognitive energy.',
      shortDescription: '3g 100% Creapure | Zero Additives | 83 Servings | Pure Power',
      price: 1199,
      discountPercent: 20,
      stockQuantity: 140,
      lowStockThreshold: 20,
      isFeatured: true,
      isBestSeller: true,
      rating: 4.9,
      reviewCount: 260,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80',
      ]),
      nutritionInfo: JSON.stringify({
        protein: 0,
        calories: 0,
        carbs: 0,
        fat: 0,
        servingSize: '3g (1 Scoop)',
        servingsPerContainer: 83,
        bcaa: '0g',
      }),
      goalTags: JSON.stringify(['Muscle Gain', 'Strength', 'Athlete']),
      flavorOptions: JSON.stringify(['Unflavored Pure']),
      sizeOptions: JSON.stringify(['250g (83 Servings)', '500g (166 Servings)']),
      model3dType: 'standard_jar',
      model3dColor: '#06b6d4',
      model3dLabel: 'CREATINE MONO',
      verificationCode: 'PV-AUTH-2210-CREA',
    },
    {
      name: 'Cellucor C4 Original Explosive Pre-Workout',
      slug: 'cellucor-c4-original-pre-workout',
      brandId: brandCellucor.id,
      categoryId: catCreatine.id,
      description: 'America #1 pre-workout brand. Powered by 150mg Caffeine Anhydrous, 1.6g CarnoSyn Beta-Alanine, 1g Creatine Nitrate, and Arginine AKG for razor-sharp focus and laser muscular endurance.',
      shortDescription: '150mg Caffeine | 1.6g CarnoSyn Beta-Alanine | Explosive Energy & Pump',
      price: 2199,
      discountPercent: 15,
      stockQuantity: 70,
      lowStockThreshold: 12,
      isFeatured: true,
      isBestSeller: true,
      rating: 4.8,
      reviewCount: 195,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=800&auto=format&fit=crop&q=80',
      ]),
      nutritionInfo: JSON.stringify({
        protein: 0,
        calories: 5,
        carbs: 1,
        fat: 0,
        servingSize: '6.5g (1 Scoop)',
        servingsPerContainer: 30,
      }),
      goalTags: JSON.stringify(['Energy', 'Athlete', 'Strength']),
      flavorOptions: JSON.stringify(['Icy Blue Razz', 'Fruit Punch', 'Watermelon', 'Orange Burst']),
      sizeOptions: JSON.stringify(['30 Servings (195g)', '60 Servings (390g)']),
      model3dType: 'standard_jar',
      model3dColor: '#eab308',
      model3dLabel: 'C4 PRE-WORKOUT',
      verificationCode: 'PV-AUTH-1109-C4PW',
    },
    {
      name: 'PV Volt-X Hyperdrive High-Stim Pre-Workout',
      slug: 'pv-volt-x-hyperdrive-pre-workout',
      brandId: brandPV.id,
      categoryId: catCreatine.id,
      description: 'Formulated for advanced athletes seeking extreme tunnel-vision focus and insane nitric oxide vasodilation. 300mg Caffeine, 6000mg L-Citrulline Malate (2:1), 3200mg Beta-Alanine, and 1000mg L-Tyrosine.',
      shortDescription: '6g Pure L-Citrulline | 300mg Caffeine | 3.2g Beta-Alanine | Insane Pump',
      price: 2499,
      discountPercent: 22,
      stockQuantity: 55,
      lowStockThreshold: 10,
      isFeatured: false,
      isBestSeller: false,
      rating: 4.9,
      reviewCount: 88,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1546483875-ad9014c88eba?w=800&auto=format&fit=crop&q=80',
      ]),
      nutritionInfo: JSON.stringify({
        protein: 0,
        calories: 10,
        carbs: 2,
        fat: 0,
        servingSize: '15g (1 Scoop)',
        servingsPerContainer: 30,
      }),
      goalTags: JSON.stringify(['Energy', 'Strength', 'Athlete']),
      flavorOptions: JSON.stringify(['Electric Green Apple', 'Sour Blue Lemonade', 'Mango Tango']),
      sizeOptions: JSON.stringify(['450g (30 Servings)']),
      model3dType: 'standard_jar',
      model3dColor: '#10b981',
      model3dLabel: 'VOLT-X STIM',
      verificationCode: 'PV-AUTH-0992-VOLT',
    },
    // BCAA & Aminos
    {
      name: 'PV Matrix 9-EAA Complete Essential Amino Acids',
      slug: 'pv-matrix-9-eaa-aminos',
      brandId: brandPV.id,
      categoryId: catBcaa.id,
      description: 'Complete full-spectrum formula of all 9 Essential Amino Acids including 7g BCAAs in 2:1:1 ratio, supplemented with coconut water electrolytes for intra-workout muscle hydration and zero cramping.',
      shortDescription: '7g BCAAs + Full Spectrum 9 EAAs | Coconut Water Electrolytes',
      price: 1899,
      discountPercent: 15,
      stockQuantity: 80,
      lowStockThreshold: 15,
      isFeatured: false,
      isBestSeller: true,
      rating: 4.8,
      reviewCount: 94,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80',
      ]),
      nutritionInfo: JSON.stringify({
        protein: 8,
        calories: 30,
        carbs: 0.5,
        fat: 0,
        servingSize: '11g (1 Scoop)',
        servingsPerContainer: 35,
        bcaa: '7.0g',
      }),
      goalTags: JSON.stringify(['Maintenance', 'Athlete', 'Weight Loss']),
      flavorOptions: JSON.stringify(['Watermelon Splash', 'Lemon Mint Ice', 'Wild Berry Cooler']),
      sizeOptions: JSON.stringify(['385g (35 Servings)']),
      model3dType: 'standard_jar',
      model3dColor: '#06b6d4',
      model3dLabel: 'MATRIX 9-EAA',
      verificationCode: 'PV-AUTH-9021-EAA',
    },
    // Health & Vitamins
    {
      name: 'PV Ultra Gold Omega-3 Triple Strength Fish Oil',
      slug: 'pv-ultra-gold-omega-3-fish-oil',
      brandId: brandPV.id,
      categoryId: catHealth.id,
      description: 'Triple strength molecularly distilled wild deep-sea fish oil providing 1000mg EPA and 500mg DHA per enteric-coated softgel. Zero fishy burps, non-GMO, mercury and heavy metal tested.',
      shortDescription: '1000mg EPA + 500mg DHA | Molecularly Distilled | Heart & Joint Health',
      price: 899,
      discountPercent: 10,
      stockQuantity: 110,
      lowStockThreshold: 20,
      isFeatured: true,
      isBestSeller: true,
      rating: 4.9,
      reviewCount: 165,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80',
      ]),
      nutritionInfo: JSON.stringify({
        protein: 0.5,
        calories: 18,
        carbs: 0,
        fat: 2,
        servingSize: '2 Softgels',
        servingsPerContainer: 60,
      }),
      goalTags: JSON.stringify(['Maintenance', 'Health', 'Athlete']),
      flavorOptions: JSON.stringify(['Enteric Coated Softgels']),
      sizeOptions: JSON.stringify(['120 Softgels (60 Servings)']),
      model3dType: 'standard_jar',
      model3dColor: '#f59e0b',
      model3dLabel: 'OMEGA-3 GOLD',
      verificationCode: 'PV-AUTH-8812-OMG3',
    },
    {
      name: 'Optimum Nutrition Opti-Men Daily Multivitamin',
      slug: 'on-opti-men-daily-multivitamin',
      brandId: brandON.id,
      categoryId: catHealth.id,
      description: '75+ active ingredients in 4 performance blends designed specifically to support the nutrient needs of active men. Contains free-form amino acids, antioxidant vitamins, essential minerals, and botanical extracts.',
      shortDescription: '75+ Active Ingredients | 4 Specialized Performance Blends',
      price: 1699,
      discountPercent: 12,
      stockQuantity: 65,
      lowStockThreshold: 12,
      isFeatured: false,
      isBestSeller: false,
      rating: 4.7,
      reviewCount: 82,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80',
      ]),
      nutritionInfo: JSON.stringify({
        protein: 1,
        calories: 10,
        carbs: 1,
        fat: 0,
        servingSize: '3 Tablets',
        servingsPerContainer: 50,
      }),
      goalTags: JSON.stringify(['Health', 'Maintenance']),
      flavorOptions: JSON.stringify(['Tablets']),
      sizeOptions: JSON.stringify(['150 Tablets']),
      model3dType: 'standard_jar',
      model3dColor: '#10b981',
      model3dLabel: 'OPTI-MEN VITA',
      verificationCode: 'PV-AUTH-7719-OPTI',
    },
    // Protein Foods & Snacks
    {
      name: 'PV Pure Whey High Protein Dark Chocolate Peanut Butter',
      slug: 'pv-high-protein-peanut-butter-chocolate',
      brandId: brandPV.id,
      categoryId: catFood.id,
      description: 'Slow-roasted premium Gujarat peanuts blended with 100% whey protein isolate and rich Belgian cocoa. 32g protein per 100g, zero added palm oil, zero trans fats, and zero artificial preservatives.',
      shortDescription: '32g Protein/100g | Whey Isolate Enriched | Zero Palm Oil | Dark Cocoa',
      price: 549,
      discountPercent: 15,
      stockQuantity: 150,
      lowStockThreshold: 25,
      isFeatured: true,
      isBestSeller: true,
      rating: 4.9,
      reviewCount: 310,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1622484216809-5d27d716cf97?w=800&auto=format&fit=crop&q=80',
      ]),
      nutritionInfo: JSON.stringify({
        protein: 10,
        calories: 195,
        carbs: 6,
        fat: 14,
        servingSize: '32g (2 Tablespoons)',
        servingsPerContainer: 31,
      }),
      goalTags: JSON.stringify(['Muscle Gain', 'Weight Gain', 'Health']),
      flavorOptions: JSON.stringify(['Dark Chocolate Crunchy', 'Creamy Dark Chocolate', 'Classic Salted Caramel']),
      sizeOptions: JSON.stringify(['1 kg Jar']),
      model3dType: 'standard_jar',
      model3dColor: '#78350f',
      model3dLabel: 'PROTEIN PB',
      verificationCode: 'PV-AUTH-6632-PEAN',
    },
    {
      name: 'PV Crunch Elite 20g High Protein Crispy Bar Box',
      slug: 'pv-crunch-elite-protein-bar-box',
      brandId: brandPV.id,
      categoryId: catFood.id,
      description: 'Triple-layer baked chocolate protein bar delivering 20g whey protein isolate, 10g prebiotic dietary fiber, and only 2g sugar. Soft chewy center with crispy protein nuggets coated in dark chocolate.',
      shortDescription: '20g Protein | 2g Sugar | 10g Fiber | Pack of 6 Bars',
      price: 799,
      discountPercent: 10,
      stockQuantity: 90,
      lowStockThreshold: 15,
      isFeatured: false,
      isBestSeller: true,
      rating: 4.8,
      reviewCount: 145,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1622484216809-5d27d716cf97?w=800&auto=format&fit=crop&q=80',
      ]),
      nutritionInfo: JSON.stringify({
        protein: 20,
        calories: 210,
        carbs: 18,
        fat: 7,
        servingSize: '1 Bar (60g)',
        servingsPerContainer: 6,
      }),
      goalTags: JSON.stringify(['Snacks', 'Muscle Gain', 'Weight Loss']),
      flavorOptions: JSON.stringify(['Choco Fudge Crunch', 'Cookies & Cream Crunch', 'Caramel Nut Blast']),
      sizeOptions: JSON.stringify(['Box of 6 Bars (360g)']),
      model3dType: 'standard_jar',
      model3dColor: '#451a03',
      model3dLabel: 'CRUNCH BAR',
      verificationCode: 'PV-AUTH-5541-BARS',
    },
    // Accessories
    {
      name: 'PV Stealth Stainless Steel Insulated Gym Shaker (750ml)',
      slug: 'pv-stealth-stainless-steel-shaker',
      brandId: brandPV.id,
      categoryId: catAccessory.id,
      description: 'Double-wall vacuum insulated kitchen-grade 304 stainless steel shaker bottle. Keeps pre-workout ice cold for 24+ hours. 100% leakproof silicone seal lid with built-in silent silent-mesh blender grid.',
      shortDescription: '750ml 304 Stainless Steel | 24Hr Cold | 100% Leakproof | Odor Resistant',
      price: 999,
      discountPercent: 20,
      stockQuantity: 130,
      lowStockThreshold: 20,
      isFeatured: true,
      isBestSeller: true,
      rating: 4.9,
      reviewCount: 180,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80',
      ]),
      nutritionInfo: JSON.stringify({
        protein: 0,
        calories: 0,
        carbs: 0,
        fat: 0,
        servingSize: '750ml Bottle',
        servingsPerContainer: 1,
      }),
      goalTags: JSON.stringify(['Accessories', 'Athlete']),
      flavorOptions: JSON.stringify(['Matte Stealth Black', 'Gunmetal Grey', 'Neon Emerald']),
      sizeOptions: JSON.stringify(['750ml']),
      model3dType: 'standard_jar',
      model3dColor: '#1e293b',
      model3dLabel: 'STEALTH SHAKER',
      verificationCode: 'PV-AUTH-4411-SHAK',
    },
  ];

  for (const item of productsData) {
    const p = await prisma.product.create({
      data: item,
    });

    // Create verification code record
    if (item.verificationCode) {
      await prisma.verificationCode.create({
        data: {
          code: item.verificationCode,
          productId: p.id,
          productName: item.name,
          batchNumber: `PV-BATCH-${Math.floor(202600 + Math.random() * 900)}`,
          manufactureDate: '2026-02-10',
          expiryDate: '2028-02-10',
          isAuthentic: true,
          verificationCount: 1,
        },
      });
    }
  }

  console.log(`💪 Seeded ${productsData.length} premium supplement products & authenticity codes.`);

  // 5. Create Coupons
  await prisma.coupon.createMany({
    data: [
      {
        code: 'WELCOME10',
        discountPercent: 10,
        maxDiscount: 500,
        minSpend: 999,
        isActive: true,
      },
      {
        code: 'PROTEIN20',
        discountPercent: 20,
        maxDiscount: 1000,
        minSpend: 2499,
        isActive: true,
      },
      {
        code: 'VILLA15',
        discountPercent: 15,
        maxDiscount: 750,
        minSpend: 1499,
        isActive: true,
      },
      {
        code: 'FITNESS100',
        discountPercent: 5,
        maxDiscount: 100,
        minSpend: 500,
        isActive: true,
      },
    ],
  });

  console.log('🎟️ Seeded promo discount coupons.');

  // 6. Create Demo Orders for User
  const allProducts = await prisma.product.findMany({ take: 3 });

  if (allProducts.length >= 2) {
    const order1 = await prisma.order.create({
      data: {
        orderNumber: 'PV-2026-98124',
        userId: demoUser.id,
        subtotal: 4299,
        discount: 429,
        couponCode: 'WELCOME10',
        shippingFee: 0,
        tax: 193,
        total: 4063,
        status: 'DELIVERED',
        paymentMethod: 'CARD',
        paymentStatus: 'PAID',
        trackingNumber: 'TRK-88991245',
        shippingAddress: JSON.stringify({
          fullName: 'Alex Johnson',
          street: '402, Titanium Heights, MG Road',
          city: 'Bengaluru',
          state: 'Karnataka',
          postalCode: '560001',
          phone: '+91 98765 43210',
        }),
        createdAt: new Date(Date.now() - 7 * 86400000),
        items: {
          create: [
            {
              productId: allProducts[0].id,
              productName: allProducts[0].name,
              productImage: JSON.parse(allProducts[0].images)[0],
              size: '2 kg / 4.4 lbs',
              flavor: 'Belgian Dark Chocolate',
              unitPrice: 4299,
              quantity: 1,
              totalPrice: 4299,
            },
          ],
        },
      },
    });

    const order2 = await prisma.order.create({
      data: {
        orderNumber: 'PV-2026-99381',
        userId: demoUser.id,
        subtotal: 2098,
        discount: 0,
        shippingFee: 0,
        tax: 104,
        total: 2202,
        status: 'SHIPPED',
        paymentMethod: 'UPI',
        paymentStatus: 'PAID',
        trackingNumber: 'TRK-99238120',
        shippingAddress: JSON.stringify({
          fullName: 'Alex Johnson',
          street: '402, Titanium Heights, MG Road',
          city: 'Bengaluru',
          state: 'Karnataka',
          postalCode: '560001',
          phone: '+91 98765 43210',
        }),
        createdAt: new Date(Date.now() - 2 * 86400000),
        items: {
          create: [
            {
              productId: allProducts[1].id,
              productName: allProducts[1].name,
              productImage: JSON.parse(allProducts[1].images)[0],
              size: '250g (83 Servings)',
              flavor: 'Unflavored Pure',
              unitPrice: 1199,
              quantity: 1,
              totalPrice: 1199,
            },
            {
              productId: allProducts[2].id,
              productName: allProducts[2].name,
              productImage: JSON.parse(allProducts[2].images)[0],
              size: '120 Softgels (60 Servings)',
              flavor: 'Softgels',
              unitPrice: 899,
              quantity: 1,
              totalPrice: 899,
            },
          ],
        },
      },
    });

    // Create Reviews
    await prisma.review.create({
      data: {
        productId: allProducts[0].id,
        userId: demoUser.id,
        userName: 'Alex Johnson',
        rating: 5,
        title: 'Best Whey Isolate I have ever used in 6 years!',
        comment: 'Mixes instantly with cold water, zero foaming, and the Belgian Chocolate taste is out of this world. Genuinely zero bloating or digestive distress.',
        isVerifiedPurchase: true,
      },
    });
  }

  // 7. Seed Daily Protein Logs for Today & Past 3 Days
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  const twoDaysAgo = new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0];

  await prisma.proteinLog.createMany({
    data: [
      {
        userId: demoUser.id,
        date: today,
        mealType: 'Breakfast',
        foodName: 'Oatmeal with 1 Scoop PV ISO-Gold & Almonds',
        proteinGrams: 36,
        calories: 380,
      },
      {
        userId: demoUser.id,
        date: today,
        mealType: 'Lunch',
        foodName: 'Grilled Chicken Breast, Brown Rice & Broccoli',
        proteinGrams: 48,
        calories: 520,
      },
      {
        userId: demoUser.id,
        date: today,
        mealType: 'Post-Workout',
        foodName: 'PV ISO-Gold Shake with 1 Banana',
        proteinGrams: 30,
        calories: 220,
      },
      {
        userId: demoUser.id,
        date: yesterday,
        mealType: 'Breakfast',
        foodName: 'Eggs & Toast + Whey Shake',
        proteinGrams: 42,
        calories: 450,
      },
      {
        userId: demoUser.id,
        date: yesterday,
        mealType: 'Lunch',
        foodName: 'Paneer Rice Bowl with Chickpeas',
        proteinGrams: 38,
        calories: 510,
      },
      {
        userId: demoUser.id,
        date: yesterday,
        mealType: 'Dinner',
        foodName: 'Salmon Fillet & Sweet Potato',
        proteinGrams: 45,
        calories: 490,
      },
      {
        userId: demoUser.id,
        date: yesterday,
        mealType: 'Post-Workout',
        foodName: 'PV ISO-Gold Shake',
        proteinGrams: 28,
        calories: 120,
      },
      {
        userId: demoUser.id,
        date: twoDaysAgo,
        mealType: 'Breakfast',
        foodName: 'Protein Smoothie Bowl',
        proteinGrams: 35,
        calories: 390,
      },
      {
        userId: demoUser.id,
        date: twoDaysAgo,
        mealType: 'Lunch',
        foodName: 'Chicken Salad with Quinoa',
        proteinGrams: 44,
        calories: 460,
      },
      {
        userId: demoUser.id,
        date: twoDaysAgo,
        mealType: 'Dinner',
        foodName: 'Egg White Omelette with Cheese',
        proteinGrams: 40,
        calories: 410,
      },
      {
        userId: demoUser.id,
        date: twoDaysAgo,
        mealType: 'Snack',
        foodName: 'PV Crunch Elite Protein Bar',
        proteinGrams: 20,
        calories: 210,
      },
    ],
  });

  console.log('📊 Seeded demo user protein logs & streak history.');
  console.log('✨ Database seeding complete successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
