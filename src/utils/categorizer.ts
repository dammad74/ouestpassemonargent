import { TransactionCategory, CategorySummary } from '../types';

export const CATEGORY_DEFINITIONS: Record<
  TransactionCategory,
  {
    label: string;
    color: string; // Hex or Tailwind color
    bgLight: string;
    icon: string;
  }
> = {
  courses: {
    label: 'Courses',
    color: '#10B981', // Emerald
    bgLight: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    icon: 'ShoppingCart',
  },
  restaurants: {
    label: 'Restaurants',
    color: '#F59E0B', // Amber
    bgLight: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    icon: 'Utensils',
  },
  fast_food: {
    label: 'Fast-food',
    color: '#EF4444', // Red
    bgLight: 'bg-red-500/10 text-red-400 border-red-500/20',
    icon: 'Pizza',
  },
  essence: {
    label: 'Essence',
    color: '#6366F1', // Indigo
    bgLight: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    icon: 'Fuel',
  },
  transport: {
    label: 'Transport',
    color: '#06B6D4', // Cyan
    bgLight: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    icon: 'Train',
  },
  shopping: {
    label: 'Shopping',
    color: '#EC4899', // Pink
    bgLight: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
    icon: 'ShoppingBag',
  },
  amazon: {
    label: 'Amazon',
    color: '#F97316', // Orange
    bgLight: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    icon: 'Package',
  },
  sante: {
    label: 'Santé',
    color: '#14B8A6', // Teal
    bgLight: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
    icon: 'HeartPulse',
  },
  logement: {
    label: 'Logement',
    color: '#8B5CF6', // Purple
    bgLight: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    icon: 'Home',
  },
  loisirs: {
    label: 'Loisirs',
    color: '#3B82F6', // Blue
    bgLight: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    icon: 'Film',
  },
  abonnements: {
    label: 'Abonnements',
    color: '#84CC16', // Lime
    bgLight: 'bg-lime-500/10 text-lime-400 border-lime-500/20',
    icon: 'Repeat',
  },
  voyages: {
    label: 'Voyages',
    color: '#0EA5E9', // Sky
    bgLight: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    icon: 'Plane',
  },
  autre: {
    label: 'Autre',
    color: '#64748B', // Slate
    bgLight: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    icon: 'MoreHorizontal',
  },
};

export function detectCategory(
  merchant: string,
  description: string = '',
  mcc?: string
): TransactionCategory {
  const text = `${merchant} ${description}`.toLowerCase();

  // 1. Amazon specific
  if (text.includes('amazon') || text.includes('amzn') || text.includes('audible')) {
    return 'amazon';
  }

  // 2. Abonnements (Subscriptions)
  if (
    text.includes('netflix') ||
    text.includes('spotify') ||
    text.includes('disney+') ||
    text.includes('disney plus') ||
    text.includes('prime video') ||
    text.includes('microsoft') ||
    text.includes('adobe') ||
    text.includes('apple.com/bill') ||
    text.includes('apple music') ||
    text.includes('icloud') ||
    text.includes('google storage') ||
    text.includes('google play') ||
    text.includes('youtube premium') ||
    text.includes('deezer') ||
    text.includes('canal+') ||
    text.includes('openai') ||
    text.includes('chatgpt')
  ) {
    return 'abonnements';
  }

  // 3. Fast-food
  if (
    text.includes("mcdonald's") ||
    text.includes('mcdo') ||
    text.includes('burger king') ||
    text.includes('kfc') ||
    text.includes('five guys') ||
    text.includes('subway') ||
    text.includes('otacos') ||
    text.includes('o tacos') ||
    text.includes('popeyes') ||
    text.includes('quick') ||
    text.includes('domino')
  ) {
    return 'fast_food';
  }

  // 4. Restaurants
  if (
    text.includes('restaurant') ||
    text.includes('brasserie') ||
    text.includes('bistrot') ||
    text.includes('bistro') ||
    text.includes('trattoria') ||
    text.includes('pizzeria') ||
    text.includes('sushi') ||
    text.includes('chez ') ||
    text.includes('comptoir') ||
    text.includes('bar ') ||
    text.includes('café') ||
    text.includes('cafe') ||
    text.includes('big mamma') ||
    text.includes('terrasse')
  ) {
    return 'restaurants';
  }

  // 5. Essence (Fuel)
  if (
    text.includes('totalenergies') ||
    text.includes('total ') ||
    text.includes('shell') ||
    text.includes('bp ') ||
    text.includes('esso') ||
    text.includes('avia') ||
    text.includes('station service') ||
    text.includes('carburant') ||
    text.includes('relais total')
  ) {
    return 'essence';
  }

  // 6. Courses (Groceries)
  if (
    text.includes('carrefour') ||
    text.includes('monoprix') ||
    text.includes('leclerc') ||
    text.includes('lidl') ||
    text.includes('auchan') ||
    text.includes('intermarche') ||
    text.includes('intermarché') ||
    text.includes('picard') ||
    text.includes('biocoop') ||
    text.includes('franprix') ||
    text.includes('aldi') ||
    text.includes('casino super') ||
    text.includes('supermarché') ||
    text.includes('boulangerie') ||
    text.includes('primeur')
  ) {
    return 'courses';
  }

  // 7. Transport
  if (
    text.includes('sncf') ||
    text.includes('ratp') ||
    text.includes('uber') ||
    text.includes('bolt') ||
    text.includes('lime') ||
    text.includes('dott') ||
    text.includes('cityscoot') ||
    text.includes('navigo') ||
    text.includes('blablacar') ||
    text.includes('taxi') ||
    text.includes('trainline') ||
    text.includes('ter ') ||
    text.includes('metro') ||
    text.includes('velib')
  ) {
    return 'transport';
  }

  // 8. Shopping
  if (
    text.includes('zara') ||
    text.includes('fnac') ||
    text.includes('decathlon') ||
    text.includes('sephora') ||
    text.includes('h&m') ||
    text.includes('uniqlo') ||
    text.includes('mango') ||
    text.includes('apple store') ||
    text.includes('darty') ||
    text.includes('boulanger') ||
    text.includes('galeries lafayette') ||
    text.includes('printemps') ||
    text.includes('nike') ||
    text.includes('adidas')
  ) {
    return 'shopping';
  }

  // 9. Santé (Health)
  if (
    text.includes('pharmacie') ||
    text.includes('doctolib') ||
    text.includes('mutuelle') ||
    text.includes('dentiste') ||
    text.includes('laboratoire') ||
    text.includes('opticien') ||
    text.includes('alain afflelou') ||
    text.includes('medecin') ||
    text.includes('kine') ||
    text.includes('hopital')
  ) {
    return 'sante';
  }

  // 10. Logement (Housing / Utilities)
  if (
    text.includes('loyer') ||
    text.includes('edf') ||
    text.includes('engie') ||
    text.includes('eau de paris') ||
    text.includes('veolia') ||
    text.includes('assurance habitation') ||
    text.includes('bouygues telecom') ||
    text.includes('orange') ||
    text.includes('free mobile') ||
    text.includes('free telecom') ||
    text.includes('sfr') ||
    text.includes('syndic')
  ) {
    return 'logement';
  }

  // 11. Loisirs (Leisure / Entertainment)
  if (
    text.includes('ugc') ||
    text.includes('pathe') ||
    text.includes('pathé') ||
    text.includes('gaumont') ||
    text.includes('cinema') ||
    text.includes('cinéma') ||
    text.includes('musee') ||
    text.includes('musée') ||
    text.includes('theatre') ||
    text.includes('théâtre') ||
    text.includes('spectacle') ||
    text.includes('bowling') ||
    text.includes('escape game') ||
    text.includes('disneyland') ||
    text.includes('parc asterix') ||
    text.includes('concert')
  ) {
    return 'loisirs';
  }

  // 12. Voyages (Travel)
  if (
    text.includes('air france') ||
    text.includes('easyjet') ||
    text.includes('ryanair') ||
    text.includes('booking.com') ||
    text.includes('booking') ||
    text.includes('airbnb') ||
    text.includes('hotel') ||
    text.includes('hôtel') ||
    text.includes('expedia') ||
    text.includes('transavia') ||
    text.includes('vueling') ||
    text.includes('lufthansa')
  ) {
    return 'voyages';
  }

  return 'autre';
}
