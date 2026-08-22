import React from 'react';

export const splitVisibleLyricLines = (text) => text.replace(/\r\n?/g, '\n').split('\n');

export const LyricSection = ({ speaker, text }) => {
  const lines = splitVisibleLyricLines(text);

  return React.createElement(
    'section',
    { className: 'equinox-song-detail__lyric-section' },
    React.createElement('h3', null, `[${speaker}]`),
    text
      ? React.createElement(
        'p',
        { 'data-source-line-count': lines.length },
        lines.map((line, index) => React.createElement(
          React.Fragment,
          { key: index },
          line,
          index < lines.length - 1 ? React.createElement('br') : null,
        )),
      )
      : null,
  );
};
