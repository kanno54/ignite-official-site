export type InterviewBlock = { type: 'speech'; speaker: string; label: string; separator: string; paragraphs: string[] } | { type: 'question' | 'editorial'; paragraphs: string[] };
export type InterviewSection = { heading: string; blocks: InterviewBlock[] };
export function parseWeBurnInterview(markdown: string, options?: { closingEditorialStart?: string }): InterviewSection[];
