mermaid.initialize({ startOnLoad: false, securityLevel: "loose", theme: "default" });

let lastMermaidCode = "";
let rawOutput = "";

async function renderMermaid(code) {
  const chartDiv = document.getElementById('chart');
  const statusDiv = document.getElementById('status');
  
  statusDiv.textContent = 'Rendering...';

  try {
    const id = 'm' + Date.now();
    const { svg } = await mermaid.render(id, code);
    chartDiv.innerHTML = svg;
    statusDiv.textContent = 'Rendered';
  } catch (err) {
    statusDiv.textContent = 'Render error: ' + err.message;
    document.getElementById('mermaid-editor').style.display = 'flex';
    document.getElementById('mermaid-code').value = code;
  }
}

async function generate() {
  const prompt = document.getElementById('prompt').value.trim();
  const model = document.getElementById('modelSelect').value;
  lastMermaidCode = '';
  rawOutput = '';

  try {
    const resp = await fetch('/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, model })
    });

    const data = await resp.json();
    const mermaidCode = data.mermaid || "";
    rawOutput = data.raw || "";
    lastMermaidCode = mermaidCode;

    document.getElementById('mermaid-code').value = mermaidCode || rawOutput;

    if (!mermaidCode.trim()) {
      document.getElementById('status').textContent = 'No mermaid detected. You can adjust manually:';
      const editor = document.getElementById('mermaid-editor');
      editor.style.display = 'flex';
    } else {
      renderMermaid(mermaidCode);
    }

  } catch (err) {
    document.getElementById('status').textContent = 'Render error: ' + err.message;
    const editor = document.getElementById('mermaid-editor');
    editor.style.display = 'flex';
    document.getElementById('mermaid-code').value = lastMermaidCode || rawOutput;
  }
}

document.getElementById('go').addEventListener('click', generate);

document.getElementById('re-render').addEventListener('click', () => {
  const editedCode = document.getElementById('mermaid-code').value;
  lastMermaidCode = editedCode;
  renderMermaid(editedCode);
});

document.getElementById('toggle-editor').addEventListener('click', () => {
  const editor = document.getElementById('mermaid-editor');
  editor.style.display = editor.style.display === 'flex' ? 'none' : 'flex';
});
