declare module 'date-fns' {
  export function formatDistanceToNow(date: Date | number, options?: { addSuffix?: boolean, includeSeconds?: boolean }): string;
} 