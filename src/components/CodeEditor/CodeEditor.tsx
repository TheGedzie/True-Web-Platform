import React, { useEffect, useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { html } from '@codemirror/lang-html';
import { oneDark } from '@codemirror/theme-one-dark';
import cls from './CodeEditor.module.css'; // ← теперь cls

interface CodeEditorProps {
  codeValue : string,
}


const CodeEditor = ({codeValue} : CodeEditorProps) => {
  const [htmlCode, setHtmlCode] = useState(`${codeValue}`);
  
  const [output, setOutput] = useState('');
  
  const handleCodeChange = (value) => {
    setHtmlCode(value);
    updatePreview(value);
  };
  
  const updatePreview = (code) => {
    setOutput(code);
  };
  useEffect(() => {
    setHtmlCode(codeValue)
  }, [codeValue])

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