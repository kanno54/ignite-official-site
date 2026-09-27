// The approved v1 manuscripts use one nonempty source line per paragraph
// (FEAT01 additionally separates paragraphs with blank lines). Never merge lines.
// FEAT02's unheaded closing editorial needs an explicit boundary: a blank line
// alone cannot end a speech, because speeches may contain blank-line paragraphs.

export function parseWeBurnInterview(markdown, { closingEditorialStart } = {}) {
  const lines = markdown.replace(/\r\n?/g, '\n').split('\n');
  const first = lines.findIndex(line => line.trim());
  const sections = [{ heading: '', blocks: [] }];
  let active;
  let editorial = false;
  for (const line of lines.slice(first + 1)) {
    if (!line.trim()) continue; // Paragraph boundaries remain separate entries below.
    const heading = line.match(/^##\s+(.+)$/) || line.match(/^(\d{2}｜.+)$/);
    if (heading) {
      sections.push({ heading: heading[1], blocks: [] });
      active = undefined;
      editorial = false;
      continue;
    }
    const blocks = sections[sections.length - 1].blocks;
    if (line === closingEditorialStart) {
      active = undefined;
      editorial = true;
    }
    const speaker = !editorial && line.match(/^(?:\*\*(KAI|SHO|LEO|REN|YUTO)([：:])\*\*|(KAI|SHO|LEO|REN|YUTO)([：:]))(\s*)(.*)$/);
    if (speaker) {
      active = { type: 'speech', speaker: speaker[1] || speaker[3], label: (speaker[1] || speaker[3]) + (speaker[2] || speaker[4]), separator: speaker[5], paragraphs: [speaker[6]] };
      blocks.push(active);
    } else if (!editorial && line.startsWith('――')) {
      active = undefined;
      blocks.push({ type: 'question', paragraphs: [line] });
    } else if (active) {
      active.paragraphs.push(line);
    } else {
      blocks.push({ type: 'editorial', paragraphs: [line] });
    }
  }
  return sections;
}
