import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';
import "./styles.prose.css";
import styles from './styles.module.css';

// Регистрируем языки
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import css from 'highlight.js/lib/languages/css';
import html from 'highlight.js/lib/languages/xml';
import { useEffect, useRef } from "react";

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('css', css);
hljs.registerLanguage('html', html);
hljs.registerLanguage('typescriptreact', typescript); // Регистрируем псевдоним
hljs.registerLanguage('tsx', typescript); // TSX как TypeScript

export const HTMLText = ({ htmlText, className }: { htmlText: string, className?: string }) => {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.querySelectorAll('pre code').forEach((block) => {
        try {
          hljs.highlightElement(block as HTMLElement);
        } catch (error) {
          console.warn('Highlight error:', error);
          // В случае ошибки просто оставляем как есть
        }
      });
    }
  }, [htmlText]);

  return (
    <p ref={contentRef} className={`prose ${styles.text} ${className || ''}`} dangerouslySetInnerHTML={{ __html: htmlText }} />
  );

}