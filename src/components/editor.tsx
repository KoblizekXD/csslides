"use client";

import { html } from '@codemirror/lang-html';
import CodeMirror, { type ViewUpdate } from '@uiw/react-codemirror';
import { githubDarkInit } from '@uiw/codemirror-theme-github'

interface EditorProps {
  onChange?: (value: string, viewUpdate: ViewUpdate) => void;
  defaultValue?: string;
}

export const Editor = ({ onChange, defaultValue }: EditorProps) => {
  return <CodeMirror value={defaultValue} onChange={onChange} className='h-full overflow-y-scroll' extensions={[html()]} theme={githubDarkInit({
    settings: {
      fontFamily: 'JetBrains Mono',
      fontSize: 14,
      lineHighlight: 'var(--muted-foreground)',
      gutterBackground: 'transparent',
      background: 'transparent',
    },
  })} />;
};
