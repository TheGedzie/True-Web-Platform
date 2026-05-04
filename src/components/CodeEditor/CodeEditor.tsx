import React, { useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { html } from '@codemirror/lang-html';
import { oneDark } from '@codemirror/theme-one-dark';
import cls from './CodeEditor.module.css'; // ← теперь cls

const CodeEditor = () => {
  const [htmlCode, setHtmlCode] = useState(`<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      padding: 20px;
      background: #f0f0f0;
    }
    .greeting {
      color: blue;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="greeting">
    <h1>Привет, мир!</h1>
    <p>Редактируй этот код</p>
  </div>
</body>
</html>`);

  const [output, setOutput] = useState('');

  const handleCodeChange = (value) => {
    setHtmlCode(value);
    updatePreview(value);
  };

  const updatePreview = (code) => {
    setOutput(code);
  };

  return (
    <div className={cls.container}>
      <div className={cls.editorPane}>
        <div className={cls.paneHeader}>
          <span>📝 Редактор кода</span>
        </div>
        <CodeMirror
          value={htmlCode}
          height="100%"
          extensions={[html(), oneDark]}
          onChange={handleCodeChange}
          theme={oneDark}
          basicSetup={{
            lineNumbers: true,
            highlightActiveLineGutter: true,
            highlightActiveLine: true,
            foldGutter: true,
            dropCursor: true,
            allowMultipleSelections: true,
            indentOnInput: true,
            bracketMatching: true,
            closeBrackets: true,
            autocompletion: true,
            rectangularSelection: true,
            crosshairCursor: true,
            highlightSelectionMatches: true,
            closeBracketsKeymap: true,
            defaultKeymap: true,
            searchKeymap: true,
            historyKeymap: true,
            foldKeymap: true,
            completionKeymap: true,
            lintKeymap: true,
          }}
        />
      </div>
      
      <div className={cls.previewPane}>
        <div className={cls.paneHeader}>
          <span>👁️ Результат</span>
          <button 
            className={cls.runBtn}
            onClick={() => updatePreview(htmlCode)}
          >
            ▶ Запустить
          </button>
        </div>
        <iframe
          title="preview"
          className={cls.previewFrame}
          srcDoc={output}
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        />
      </div>
    </div>
  );
};

export default CodeEditor;