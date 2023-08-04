import { marked } from 'marked';

export function useMarkdownToHtml(text: string) {
  marked.use({
    mangle: false,
    headerIds: false,
  });
  return marked.parse(text);
}