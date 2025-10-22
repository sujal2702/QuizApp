import React from 'react';

export const AtomIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3.75c-4.418 0-8 4.03-8 9s3.582 9 8 9c4.418 0 8-4.03 8-9s-3.582-9-8-9zm0 13.5c-2.485 0-4.5-2.015-4.5-4.5s2.015-4.5 4.5-4.5 4.5 2.015 4.5 4.5-2.015 4.5-4.5 4.5z" transform="rotate(45 12 12)" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3.75c-4.418 0-8 4.03-8 9s3.582 9 8 9c4.418 0 8-4.03 8-9s-3.582-9-8-9zm0 13.5c-2.485 0-4.5-2.015-4.5-4.5s2.015-4.5 4.5-4.5 4.5 2.015 4.5 4.5-2.015 4.5-4.5 4.5z" transform="rotate(-45 12 12)" />
  </svg>
);