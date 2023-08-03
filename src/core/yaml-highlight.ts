import hljs from 'highlight.js/lib/core';
import yaml from 'highlight.js/lib/languages/yaml';
import 'highlight.js/styles/atom-one-dark.css';

hljs.registerLanguage('yaml', yaml);

export default {
  mounted(el: HTMLElement) {
    const code = el.innerText;
    const highlightedCode = hljs.highlight('yaml', code).value;
    el.innerHTML = highlightedCode;
    el.classList.add('hljs');
  },
};
