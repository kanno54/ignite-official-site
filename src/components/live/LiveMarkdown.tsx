import React from 'react';

type Props = {
  markdown: string;
};

const renderInline = (value: string): React.ReactNode[] => {
  const parts = value.split(/(\*\*[^*]+\*\*)/g);
  return parts.filter(Boolean).map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
};

export const LiveMarkdown: React.FC<Props> = ({ markdown }) => {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const blocks: React.ReactNode[] = [];
  let paragraph: string[] = [];
  let list: string[] = [];

  const flushParagraph = () => {
    if (!paragraph.length) return;
    blocks.push(<p key={`p-${blocks.length}`}>{renderInline(paragraph.join(' '))}</p>);
    paragraph = [];
  };

  const flushList = () => {
    if (!list.length) return;
    blocks.push(
      <ul key={`ul-${blocks.length}`}>
        {list.map((item, index) => <li key={index}>{renderInline(item)}</li>)}
      </ul>,
    );
    list = [];
  };

  lines.forEach((rawLine) => {
    const line = rawLine.trim();
    if (!line) {
      flushParagraph();
      flushList();
      return;
    }

    const heading = line.match(/^(#{1,6})\s+(.+)$/);
    if (heading) {
      flushParagraph();
      flushList();
      const level = Math.min(heading[1].length + 1, 6);
      blocks.push(React.createElement(`h${level}`, { key: `h-${blocks.length}` }, renderInline(heading[2])));
      return;
    }

    if (/^-{3,}$/.test(line)) {
      flushParagraph();
      flushList();
      blocks.push(<hr key={`hr-${blocks.length}`} />);
      return;
    }

    const bullet = line.match(/^[-*]\s+(.+)$/);
    if (bullet) {
      flushParagraph();
      list.push(bullet[1]);
      return;
    }

    if (list.length && /^\s{2,}/.test(rawLine)) {
      list[list.length - 1] = `${list[list.length - 1]} ${line}`;
      return;
    }

    flushList();
    paragraph.push(line.replace(/\s{2,}$/, ''));
  });

  flushParagraph();
  flushList();

  return <div className="live-markdown">{blocks}</div>;
};
