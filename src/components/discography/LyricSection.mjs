import React from 'react';

export const splitVisibleLyricLines = (text) => text.replace(/\r\n?/g, '\n').split('\n');

const classNames = (...values) => values.filter(Boolean).join(' ');

export const LyricSection = ({
  speaker,
  text,
  showSpeaker = true,
  surface = 'default',
  sectionIndex,
}) => {
  const lines = text === '' ? [] : splitVisibleLyricLines(text);

  return React.createElement(
    'section',
    {
      className: classNames('lyric-section', `lyric-section--${surface}`),
      'data-lyric-section': true,
      'data-lyric-section-index': sectionIndex,
    },
    showSpeaker && speaker
      ? React.createElement(
        'div',
        {
          className: 'lyric-speaker',
          'data-lyric-speaker': true,
        },
        `[${speaker}]`,
      )
      : null,
    React.createElement(
      'div',
      {
        className: 'lyric-lines',
        'data-lyric-lines': true,
        'data-source-line-count': lines.length,
      },
      lines.map((line, index) => (
        line === ''
          ? React.createElement('div', {
            key: index,
            className: 'lyric-stanza-gap',
            'data-lyric-stanza-gap': true,
            'data-source-line-index': index,
            'aria-hidden': true,
          })
          : React.createElement(
            'div',
            {
              key: index,
              className: 'lyric-line',
              'data-lyric-line': true,
              'data-source-line-index': index,
            },
            line,
          )
      )),
    ),
  );
};

export const LyricsRenderer = ({
  lyrics,
  surface,
  showSpeaker = true,
  className,
}) => React.createElement(
  'div',
  {
    className: classNames('lyrics-renderer', `lyrics-renderer--${surface}`, className),
    'data-lyrics-surface': surface,
  },
  lyrics.map((section, sectionIndex) => React.createElement(LyricSection, {
    key: `${section.speaker}-${sectionIndex}`,
    speaker: section.speaker,
    text: section.text,
    showSpeaker,
    surface,
    sectionIndex,
  })),
);
