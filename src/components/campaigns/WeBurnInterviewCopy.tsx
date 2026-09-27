import React from 'react';
import type { InterviewBlock } from '../../utils/weBurnInterview.mjs';

export const WeBurnInterviewCopy: React.FC<{ blocks: InterviewBlock[] }> = ({ blocks }) => (
  <div className="wb-copy">
    {blocks.map((block, i) => block.type === 'speech' ? (
      <div className="wb-dialogue" data-speaker={block.speaker} key={i}>
        {block.paragraphs.map((paragraph, j) => (
          <p key={j}>{j === 0 && <><strong>{block.label}</strong>{block.separator}</>}{paragraph}</p>
        ))}
      </div>
    ) : (
      <p className={block.type === 'question' ? 'wb-question' : 'wb-editorial'} key={i}>{block.paragraphs[0]}</p>
    ))}
  </div>
);
