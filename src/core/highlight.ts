import hljs from 'highlight.js/lib/core';
import bash from 'highlight.js/lib/languages/bash';
import yaml from 'highlight.js/lib/languages/yaml';
import 'highlight.js/styles/atom-one-dark.css';

hljs.registerLanguage('bash', bash);
hljs.registerLanguage('yaml', yaml);

export default {
  mounted(el: HTMLElement, binding: any) {
    const code = el.innerText;
    const highlightedCode = hljs.highlight(binding.arg, code).value;
    el.innerHTML = highlightedCode;
    el.classList.add('hljs');
  }
};
