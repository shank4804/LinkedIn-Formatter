import { describe, expect, it } from 'vitest';

import { applyStrikethrough, styleText } from './unicodeStyles';

describe('styleText', () => {
  it('maps ASCII letters and digits to sans-serif bold Unicode characters', () => {
    expect(styleText('Abc 123', { bold: true })).toBe('𝗔𝗯𝗰 𝟭𝟮𝟯');
  });

  it('maps italic text to sans-serif italic Unicode characters', () => {
    expect(styleText('Ahz', { italic: true })).toBe('𝘈𝘩𝘻');
  });

  it('maps bold italic text to sans-serif characters while leaving punctuation alone', () => {
    expect(styleText('Hi!', { bold: true, italic: true })).toBe('𝙃𝙞!');
  });

  it('maps code text to monospace Unicode characters', () => {
    expect(styleText('Code 9', { code: true })).toBe('𝙲𝚘𝚍𝚎 𝟿');
  });

  it('keeps hashtags, mentions, and URLs parseable when styling surrounding text', () => {
    expect(styleText('Post #LinkedIn @Ada https://example.com', { bold: true })).toBe(
      '𝗣𝗼𝘀𝘁 #LinkedIn @Ada https://example.com',
    );
  });

  it('can apply experimental strikethrough to non-whitespace characters', () => {
    expect(applyStrikethrough('a b')).toBe('a̶ b̶');
  });
});