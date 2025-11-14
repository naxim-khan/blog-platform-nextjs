import hljs from 'highlight.js/lib/core';

// Register the languages you use
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import jsx from 'highlight.js/lib/languages/javascript';
import json from 'highlight.js/lib/languages/json';
import css from 'highlight.js/lib/languages/css';
import html from 'highlight.js/lib/languages/xml';

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('jsx', jsx);
hljs.registerLanguage('json', json);
hljs.registerLanguage('css', css);
hljs.registerLanguage('html', html);

export function highlightCode(code, language = 'javascript') {
  const validLanguage = hljs.getLanguage(language) ? language : 'plaintext';
  return hljs.highlight(code, { language: validLanguage }).value;
}
