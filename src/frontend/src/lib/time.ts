export function formatTime(time: bigint): string {
  const milliseconds = Number(time / 1_000_000n);
  const date = new Date(milliseconds);
  
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function getCurrentTime(): bigint {
  return BigInt(Date.now()) * 1_000_000n;
}
