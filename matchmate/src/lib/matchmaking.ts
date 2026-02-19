export const GAMES = [
  "League of Legends", "Valorant", "Fortnite", "Apex Legends",
  "CS2", "Rocket League", "Overwatch 2", "Call of Duty",
  "Minecraft", "Genshin Impact", "FIFA", "It Takes Two",
];

export const LEVELS = ["débutant", "intermédiaire", "avancé", "expert"] as const;
export const STYLES = ["compétitif", "chill", "tryhard", "fun"] as const;
export const AVAILABILITIES = [
  "Matin (8h-12h)", "Après-midi (12h-18h)", "Soirée (18h-23h)", "Nuit (23h-5h)",
  "Week-end", "En semaine",
] as const;

export type Level = typeof LEVELS[number];
export type Style = typeof STYLES[number];

export interface Profile {
  id: string;
  user_id: string;
  username: string;
  avatar_emoji: string;
  bio: string;
  main_game: string;
  games: string[];
  level: Level;
  play_style: Style;
  availability: string[];
  discord_tag: string;
  game_username: string;
  phone_number: string;
  steam_epic_link: string;
  is_online: boolean;
  last_seen: string;
  created_at: string;
  updated_at: string;
}

export function calculateCompatibility(p1: Profile, p2: Profile): number {
  let score = 0;
  let maxScore = 0;

  // Games in common (40 points max)
  maxScore += 40;
  const commonGames = p1.games.filter(g => p2.games.includes(g));
  score += Math.min(commonGames.length * 15, 40);

  // Level compatibility (20 points max)
  maxScore += 20;
  const levelMap: Record<string, number> = { "débutant": 0, "intermédiaire": 1, "avancé": 2, "expert": 3 };
  const levelDiff = Math.abs((levelMap[p1.level] ?? 1) - (levelMap[p2.level] ?? 1));
  score += levelDiff === 0 ? 20 : levelDiff === 1 ? 14 : levelDiff === 2 ? 6 : 0;

  // Style compatibility (20 points max)
  maxScore += 20;
  const styleCompat: Record<string, string[]> = {
    "compétitif": ["compétitif", "tryhard"],
    "chill": ["chill", "fun"],
    "tryhard": ["tryhard", "compétitif"],
    "fun": ["fun", "chill"],
  };
  if (p1.play_style === p2.play_style) score += 20;
  else if (styleCompat[p1.play_style]?.includes(p2.play_style)) score += 14;
  else score += 4;

  // Availability overlap (20 points max)
  maxScore += 20;
  const commonAvail = p1.availability.filter(a => p2.availability.includes(a));
  score += Math.min(commonAvail.length * 7, 20);

  return Math.round((score / maxScore) * 100);
}
