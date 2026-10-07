/** Turns **bold** in trusted, author-written strings into <strong>. */
export const inline = (s: string) =>
  s.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold">$1</strong>');
