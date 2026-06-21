import React, { useEffect, useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { html } from '@codemirror/lang-html';
import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';
import cls from './CodeEditor.module.css';

interface CodeEditorProps {
  codeValue: string;
  onCodeChange?: (value: string) => void;
  language?: 'html' | 'javascript'; // Добавляем выбор языка
}

const CodeEditor = ({ codeValue, onCodeChange, language = 'html' }: CodeEditorProps) => {
  const [htmlCode, setHtmlCode] = useState(codeValue);
  const [output, setOutput] = useState('');

  const handleCodeChange = (value: string) => {
    setHtmlCode(value);
    onCodeChange?.(value);
    updatePreview(value);
  };

  const updatePreview = (code: string) => {
    setOutput(code);
  };

  useEffect(() => {
    setHtmlCode(codeValue);
  }, [codeValue]);

  // Выбираем расширение в зависимости от языка
  const getLanguageExtension = () => {
    switch (language) {
      case 'javascript':
        return javascript({ jsx: true, typescript: false });
      case 'html':
      default:
        return html();
    }
  };

  return (
    <div className={cls.container}>
      <div className={cls.editorPane}>
        <div className={cls.paneHeader}>
          <span>📝 {language === 'javascript' ? 'JavaScript' : 'HTML'} редактор</span>
        </div>
        <CodeMirror
          value={htmlCode}
          height="100%"
          extensions={[getLanguageExtension()]}
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