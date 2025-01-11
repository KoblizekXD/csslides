"use client";

import { html } from '@codemirror/lang-html';
import CodeMirror from '@uiw/react-codemirror';
import { githubDarkInit } from '@uiw/codemirror-theme-github'

export const Editor = () => {
  return <CodeMirror extensions={[html()]} theme={githubDarkInit({
    settings: {
      fontFamily: 'JetBrains Mono',
      fontSize: 14,
      lineHighlight: 'var(--muted-foreground)',
    }
  })} />;
};
