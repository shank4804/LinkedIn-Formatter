export interface UnicodeStyleOptions {
  bold?: boolean;
  italic?: boolean;
  code?: boolean;
  strike?: boolean;
}

type UnicodeVariant = 'bold' | 'italic' | 'boldItalic' | 'monospace';

const LINKEDIN_TOKEN_PATTERN = /(https?:\/\/[^\s]+|[#@][A-Za-z0-9_][A-Za-z0-9_.-]*)/gu;

const VARIANT_RANGES = {
  bold: {
    upper: 0x1d5d4,
    lower: 0x1d5ee,
    digit: 0x1d7ec,
  },
  italic: {
    upper: 0x1d608,
    lower: 0x1d622,
  },
  boldItalic: {
    upper: 0x1d63c,
    lower: 0x1d656,
    digit: 0x1d7ec,
  },
  monospace: {
    upper: 0x1d670,
    lower: 0x1d68a,
    digit: 0x1d7f6,
  },
} as const;

export function styleText(text: string, options: UnicodeStyleOptions = {}): string {
  if (!text) {
    return '';
  }

  let result = '';
  let lastIndex = 0;

  for (const match of text.matchAll(LINKEDIN_TOKEN_PATTERN)) {
    const index = match.index ?? 0;
    result += styleSegment(text.slice(lastIndex, index), options);
    result += match[0];
    lastIndex = index + match[0].length;
  }

  result += styleSegment(text.slice(lastIndex), options);
  return result;
}

export function applyStrikethrough(text: string): string {
  return Array.from(text)
    .map((character) => (character.trim() ? `${character}\u0336` : character))
    .join('');
}

function styleSegment(text: string, options: UnicodeStyleOptions): string {
  const variant = getVariant(options);
  const mapped = variant ? Array.from(text).map((character) => mapAsciiCharacter(character, variant)).join('') : text;

  return options.strike ? applyStrikethrough(mapped) : mapped;
}

function getVariant(options: UnicodeStyleOptions): UnicodeVariant | null {
  if (options.code) {
    return 'monospace';
  }

  if (options.bold && options.italic) {
    return 'boldItalic';
  }

  if (options.bold) {
    return 'bold';
  }

  if (options.italic) {
    return 'italic';
  }

  return null;
}

function mapAsciiCharacter(character: string, variant: UnicodeVariant): string {
  const codePoint = character.codePointAt(0);

  if (codePoint === undefined) {
    return character;
  }

  const ranges = VARIANT_RANGES[variant];

  if (codePoint >= 65 && codePoint <= 90) {
    return String.fromCodePoint(ranges.upper + codePoint - 65);
  }

  if (codePoint >= 97 && codePoint <= 122) {
    return String.fromCodePoint(ranges.lower + codePoint - 97);
  }

  if (codePoint >= 48 && codePoint <= 57 && 'digit' in ranges) {
    return String.fromCodePoint(ranges.digit + codePoint - 48);
  }

  return character;
}