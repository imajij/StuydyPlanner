// A simple Markdown renderer for the notes component
export function renderMarkdown(markdown: string): string {
  if (!markdown) return '';
  
  // Process headers (# Header -> <h1>Header</h1>)
  let html = markdown
    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/^#### (.*$)/gm, '<h4>$1</h4>')
    .replace(/^##### (.*$)/gm, '<h5>$1</h5>')
    .replace(/^###### (.*$)/gm, '<h6>$1</h6>');
  
  // Process bold and italic
  html = html
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/__(.*?)__/g, '<strong>$1</strong>')
    .replace(/_(.*?)_/g, '<em>$1</em>');
  
  // Process lists
  html = html
    .replace(/^\s*\*\s(.*$)/gm, '<li>$1</li>')
    .replace(/^\s*-\s(.*$)/gm, '<li>$1</li>')
    .replace(/^\s*\d+\.\s(.*$)/gm, '<li>$1</li>');
  
  // Wrap lists (this is a simplified approach)
  html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
  
  // Process links
  html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  
  // Process code blocks
  html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
  
  // Process inline code
  html = html.replace(/`(.*?)`/g, '<code>$1</code>');
  
  // Process paragraphs (lines that aren't headers or lists)
  html = html.replace(/^([^<].*)/gm, '<p>$1</p>');
  
  // Fix any paragraphs that got nested in other elements
  html = html
    .replace(/<h(\d)><p>(.*?)<\/p><\/h\1>/g, '<h$1>$2</h$1>')
    .replace(/<li><p>(.*?)<\/p><\/li>/g, '<li>$1</li>');
  
  return html;
}
