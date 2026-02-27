declare module 'react';
declare module 'react-dom';
declare module 'lucide-react';
declare module 'next/link';
declare module 'next/navigation';
declare module 'next/font/google';

declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}
