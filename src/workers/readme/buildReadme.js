const {readTextFile, createMarkdownHTML, injectToHtml, writeTextFile} = require('../../tools');

writeTextFile('./readme.html', injectToHtml(readTextFile('./template.html'), 'readme', createMarkdownHTML('./readme.md')));
