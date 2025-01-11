"use client";

import { html } from '@codemirror/lang-html';
import CodeMirror, { ViewUpdate } from '@uiw/react-codemirror';
import { githubDarkInit } from '@uiw/codemirror-theme-github'

interface EditorProps {
  onChange?: (value: string, viewUpdate: ViewUpdate) => void;
}

export const Editor = ({ onChange }: EditorProps) => {
  return <CodeMirror onChange={onChange} className='h-full' extensions={[html()]} theme={githubDarkInit({
    settings: {
      fontFamily: 'JetBrains Mono',
      fontSize: 14,
      lineHighlight: 'var(--muted-foreground)',
      gutterBackground: 'transparent',
      background: 'transparent',
    },
  })} />;
};
