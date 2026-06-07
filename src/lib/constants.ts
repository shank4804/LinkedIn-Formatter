export const LINKEDIN_POST_CHARACTER_LIMIT = 3000;
export const LINKEDIN_POST_WARNING_THRESHOLD = 2800;

export type CharacterCountStatus = 'normal' | 'warning' | 'over';

export function getCharacterCountStatus(count: number): CharacterCountStatus {
  if (count > LINKEDIN_POST_CHARACTER_LIMIT) {
    return 'over';
  }

  if (count >= LINKEDIN_POST_WARNING_THRESHOLD) {
    return 'warning';
  }

  return 'normal';
}