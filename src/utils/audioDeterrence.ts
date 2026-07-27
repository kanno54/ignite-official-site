import React from 'react';

export function blockCasualSave(event: React.SyntheticEvent) {
  event.preventDefault();
  event.stopPropagation();
  return false;
}

export const protectedMediaProps = {
  onContextMenu: blockCasualSave,
  onDragStart: blockCasualSave,
  draggable: false,
  style: {
    WebkitTouchCallout: 'none',
    WebkitUserSelect: 'none',
    userSelect: 'none',
  } as React.CSSProperties,
};
