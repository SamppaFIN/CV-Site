// Minimal markdown renderer (subset): headings, bold, italics, links, lists, code blocks
(function(){
  function mdToHtml(md){
    let html = md
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    html = html.replace(/^###\s?(.*)$/gm,'<h3>$1</h3>')
      .replace(/^##\s?(.*)$/gm,'<h2>$1</h2>')
      .replace(/^#\s?(.*)$/gm,'<h1>$1</h1>')
      .replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>')
      .replace(/\*(.*?)\*/g,'<em>$1</em>')
      .replace(/`([^`]+)`/g,'<code>$1</code>')
      .replace(/\[(.*?)\]\((.*?)\)/g,'<a href="$2" target="_blank" rel="noopener">$1<\/a>');
    // lists
    html = html.replace(/^(?:-\s.*(?:\n|$))+?/gm, (block)=>{
      const items = block.trim().split(/\n/).map(l=>l.replace(/^-\s?/,'')).map(t=>`<li>${t}</li>`).join('');
      return `<ul>${items}</ul>`;
    });
    // paragraphs
    html = html.replace(/^(?!<h\d|<ul|<li|<p|<\/|<code|\s*$)(.+)$/gm,'<p>$1</p>');
    return html;
  }
  window.mdToHtml = mdToHtml;
})();
