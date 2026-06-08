export interface EmojiOption {
  emoji: string;
  name: string;
  keywords: string[];
}

export const EMOJI_OPTIONS: EmojiOption[] = [
  { emoji: '😀', name: 'grinning face', keywords: ['smile', 'happy', 'face'] },
  { emoji: '😊', name: 'smiling face', keywords: ['smile', 'happy', 'warm'] },
  { emoji: '😂', name: 'face with tears of joy', keywords: ['laugh', 'funny', 'joy'] },
  { emoji: '😍', name: 'heart eyes', keywords: ['love', 'favorite', 'excited'] },
  { emoji: '🤔', name: 'thinking face', keywords: ['think', 'question', 'idea'] },
  { emoji: '😎', name: 'cool face', keywords: ['cool', 'confident', 'win'] },
  { emoji: '🙌', name: 'raising hands', keywords: ['celebrate', 'win', 'thanks'] },
  { emoji: '👏', name: 'clapping hands', keywords: ['applause', 'great', 'congrats'] },
  { emoji: '🙏', name: 'folded hands', keywords: ['thanks', 'please', 'gratitude'] },
  { emoji: '💪', name: 'flexed biceps', keywords: ['strong', 'strength', 'work'] },
  { emoji: '🤝', name: 'handshake', keywords: ['partner', 'deal', 'team'] },
  { emoji: '👀', name: 'eyes', keywords: ['watch', 'look', 'attention'] },
  { emoji: '✨', name: 'sparkles', keywords: ['sparkle', 'new', 'polish'] },
  { emoji: '🚀', name: 'rocket', keywords: ['launch', 'ship', 'growth'] },
  { emoji: '💡', name: 'light bulb', keywords: ['idea', 'insight', 'innovation'] },
  { emoji: '✅', name: 'check mark button', keywords: ['done', 'success', 'yes'] },
  { emoji: '🔥', name: 'fire', keywords: ['hot', 'great', 'momentum'] },
  { emoji: '📌', name: 'pushpin', keywords: ['pin', 'note', 'important'] },
  { emoji: '🎯', name: 'bullseye', keywords: ['target', 'goal', 'focus'] },
  { emoji: '⭐', name: 'star', keywords: ['favorite', 'quality', 'highlight'] },
  { emoji: '🏆', name: 'trophy', keywords: ['award', 'win', 'achievement'] },
  { emoji: '📈', name: 'chart increasing', keywords: ['growth', 'metrics', 'progress'] },
  { emoji: '📉', name: 'chart decreasing', keywords: ['decline', 'metrics', 'trend'] },
  { emoji: '📊', name: 'bar chart', keywords: ['data', 'analytics', 'metrics'] },
  { emoji: '🧠', name: 'brain', keywords: ['thinking', 'learning', 'ai'] },
  { emoji: '🤖', name: 'robot', keywords: ['ai', 'automation', 'bot'] },
  { emoji: '⚙️', name: 'gear', keywords: ['engineering', 'settings', 'build'] },
  { emoji: '🛠️', name: 'hammer and wrench', keywords: ['tools', 'build', 'fix'] },
  { emoji: '🔒', name: 'locked', keywords: ['security', 'private', 'safe'] },
  { emoji: '🔐', name: 'locked with key', keywords: ['security', 'privacy', 'protect'] },
  { emoji: '🧪', name: 'test tube', keywords: ['test', 'experiment', 'lab'] },
  { emoji: '💻', name: 'laptop', keywords: ['code', 'computer', 'work'] },
  { emoji: '☁️', name: 'cloud', keywords: ['cloud', 'azure', 'platform'] },
  { emoji: '⚡', name: 'high voltage', keywords: ['fast', 'speed', 'energy'] },
  { emoji: '🌍', name: 'globe', keywords: ['global', 'world', 'internet'] },
  { emoji: '📣', name: 'megaphone', keywords: ['announce', 'launch', 'news'] },
  { emoji: '📝', name: 'memo', keywords: ['note', 'write', 'draft'] },
  { emoji: '📚', name: 'books', keywords: ['learn', 'education', 'knowledge'] },
  { emoji: '🔗', name: 'link', keywords: ['url', 'connection', 'reference'] },
  { emoji: '💬', name: 'speech balloon', keywords: ['comment', 'discussion', 'chat'] },
  { emoji: '❓', name: 'question mark', keywords: ['question', 'ask', 'help'] },
  { emoji: '❗', name: 'exclamation mark', keywords: ['important', 'alert', 'note'] },
  { emoji: '➡️', name: 'right arrow', keywords: ['next', 'forward', 'arrow'] },
  { emoji: '👇', name: 'backhand index down', keywords: ['below', 'down', 'cta'] },
  { emoji: '👆', name: 'backhand index up', keywords: ['above', 'up', 'point'] },
  { emoji: '🎉', name: 'party popper', keywords: ['celebrate', 'launch', 'party'] },
  { emoji: '💥', name: 'collision', keywords: ['impact', 'boom', 'big'] },
  { emoji: '🧵', name: 'thread', keywords: ['thread', 'series', 'story'] },
  { emoji: '📅', name: 'calendar', keywords: ['date', 'event', 'schedule'] },
  { emoji: '⏱️', name: 'stopwatch', keywords: ['time', 'fast', 'measure'] },
];

export function searchEmojis(query: string, limit = 24): EmojiOption[] {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return EMOJI_OPTIONS.slice(0, limit);
  }

  const terms = normalized.split(/\s+/);

  return EMOJI_OPTIONS
    .map((option) => {
      const haystack = [option.name, ...option.keywords].join(' ').toLowerCase();
      const score = terms.reduce((total, term) => {
        if (option.name.toLowerCase() === term) {
          return total + 4;
        }

        if (option.name.toLowerCase().includes(term)) {
          return total + 3;
        }

        if (option.keywords.some((keyword) => keyword === term)) {
          return total + 2;
        }

        return haystack.includes(term) ? total + 1 : total;
      }, 0);

      return { option, score };
    })
    .filter((result) => result.score > 0)
    .sort((left, right) => right.score - left.score || left.option.name.localeCompare(right.option.name))
    .slice(0, limit)
    .map((result) => result.option);
}
