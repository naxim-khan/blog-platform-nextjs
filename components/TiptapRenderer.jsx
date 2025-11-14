"use client";
import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import React, { useEffect } from "react";
import hljs from "highlight.js/lib/core";

// - Import specific languages you want to support
import javascript from "highlight.js/lib/languages/javascript";
import typescript from "highlight.js/lib/languages/typescript";
import json from "highlight.js/lib/languages/json";
import bash from "highlight.js/lib/languages/bash";
import xml from "highlight.js/lib/languages/xml";

hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("typescript", typescript);
hljs.registerLanguage("json", json);
hljs.registerLanguage("bash", bash);
hljs.registerLanguage("xml", xml);

// ChatGPT-like syntax highlighting theme (light theme)
const chatGPTTheme = {
  background: '#f8f9fa',
  backgroundHeader: '#e9ecef',
  border: '#dee2e6',
  text: '#212529',
  comment: '#6c757d',
  keyword: '#e34f67',
  string: '#0d6efd',
  number: '#fd7e14',
  function: '#6f42c1',
  class: '#198754',
  operator: '#212529',
  punctuation: '#212529',
  property: '#e34f67',
  selector: '#0d6efd',
  type: '#0d6efd',
  parameter: '#212529',
  builtin: '#e34f67',
  constant: '#0d6efd',
  tag: '#198754',
  attribute: '#fd7e14'
};

// Enhanced language detection and highlighting
const highlightCode = (code, language = 'text') => {
  const theme = chatGPTTheme;
  
  const languagePatterns = {
    javascript: {
      comments: /(\/\/.*$|\/\*[\s\S]*?\*\/)/gm,
      strings: /('.*?'|".*?"|`.*?`)/g,
      keywords: /\b(function|const|let|var|if|else|for|while|return|class|import|export|from|default|extends|super|this|new|typeof|instanceof|void|in|of|try|catch|finally|throw|delete|yield|await|async|static|public|private|protected|true|false|null|undefined)\b/g,
      numbers: /\b\d+(\.\d+)?\b/g,
      functions: /\b([a-zA-Z_$][a-zA-Z0-9_$]*)(?=\()/g,
      classes: /\b(class|interface|enum)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g,
      types: /\b(Number|String|Boolean|Object|Array|Function|Symbol|Date|RegExp|Promise)\b/g
    },
    typescript: {
      comments: /(\/\/.*$|\/\*[\s\S]*?\*\/)/gm,
      strings: /('.*?'|".*?"|`.*?`)/g,
      keywords: /\b(function|const|let|var|if|else|for|while|return|class|import|export|from|default|extends|super|this|new|typeof|instanceof|void|in|of|try|catch|finally|throw|delete|yield|await|async|static|public|private|protected|interface|type|enum|namespace|module|declare|implements|readonly|abstract|keyof|typeof|is)\b/g,
      numbers: /\b\d+(\.\d+)?\b/g,
      functions: /\b([a-zA-Z_$][a-zA-Z0-9_$]*)(?=\()/g,
      classes: /\b(class|interface|enum)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g,
      types: /\b(number|string|boolean|any|void|undefined|null|never|object|array|Date|Promise|Record|Partial|Required|Readonly|Pick|Omit)\b/g,
      decorators: /@[a-zA-Z_$][a-zA-Z0-9_$]*/g
    },
    python: {
      comments: /(#.*$|""".*?"""|'''.*?''')/gm,
      strings: /('.*?'|".*?"|""".*?"""|'''.*?''')/g,
      keywords: /\b(def|class|if|else|elif|for|while|return|import|from|as|try|except|finally|with|lambda|yield|async|await|True|False|None|and|or|not|in|is|global|nonlocal|pass|break|continue)\b/g,
      numbers: /\b\d+(\.\d+)?\b/g,
      functions: /\b([a-zA-Z_][a-zA-Z0-9_]*)(?=\()/g,
      classes: /\b(class)\s+([a-zA-Z_][a-zA-Z0-9_]*)/g,
      decorators: /@[a-zA-Z_][a-zA-Z0-9_]*/g
    },
    html: {
      comments: /(&lt;!--[\s\S]*?--&gt;)/g,
      tags: /(&lt;\/?)([a-zA-Z][a-zA-Z0-9]*)(?:\s|>)/g,
      attributes: /([a-zA-Z-]+)=/g,
      strings: /(".*?"|'.*?')/g
    },
    css: {
      comments: /(\/\*[\s\S]*?\*\/)/g,
      properties: /([a-zA-Z-]+)\s*:/g,
      selectors: /([.#]?[a-zA-Z][a-zA-Z0-9-]*)\s*{/g,
      values: /:\s*([^;]+);/g,
      units: /(\d+)(px|em|rem|%|vh|vw)/g
    },
    java: {
      comments: /(\/\/.*$|\/\*[\s\S]*?\*\/)/gm,
      strings: /(".*?")/g,
      keywords: /\b(public|private|protected|static|final|abstract|class|interface|extends|implements|void|int|long|double|float|boolean|char|byte|short|if|else|for|while|do|switch|case|default|break|continue|return|try|catch|finally|throw|throws|new|this|super|null|true|false|package|import)\b/g,
      numbers: /\b\d+(\.\d+)?\b/g,
      classes: /\b(class|interface|enum)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g
    },
    bash: {
      comments: /(#.*$)/gm,
      strings: /(".*?"|'.*?')/g,
      keywords: /\b(if|then|else|elif|fi|for|while|do|done|case|esac|function|export|local|return|exit)\b/g,
      commands: /^\s*\b([a-zA-Z_][a-zA-Z0-9_]*)\b/g,
      variables: /\$[a-zA-Z_][a-zA-Z0-9_]*/g
    },
    json: {
      keys: /"([^"]+)":/g,
      strings: /"([^"]+)"/g,
      numbers: /\b\d+(\.\d+)?\b/g,
      keywords: /\b(true|false|null)\b/g
    }
  };

  let highlighted = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

  const patterns = languagePatterns[language] || {};

  // Apply highlighting in order
  if (patterns.comments) {
    highlighted = highlighted.replace(patterns.comments, `<span style="color: ${theme.comment}">$1</span>`);
  }
  if (patterns.strings) {
    highlighted = highlighted.replace(patterns.strings, `<span style="color: ${theme.string}">$1</span>`);
  }
  if (patterns.keywords) {
    highlighted = highlighted.replace(patterns.keywords, `<span style="color: ${theme.keyword}">$1</span>`);
  }
  if (patterns.numbers) {
    highlighted = highlighted.replace(patterns.numbers, `<span style="color: ${theme.number}">$1</span>`);
  }
  if (patterns.types) {
    highlighted = highlighted.replace(patterns.types, `<span style="color: ${theme.type}">$1</span>`);
  }
  if (patterns.functions) {
    highlighted = highlighted.replace(patterns.functions, `<span style="color: ${theme.function}">$1</span>`);
  }
  if (patterns.classes) {
    highlighted = highlighted.replace(patterns.classes, `<span style="color: ${theme.class}">$1 $2</span>`);
  }
  if (patterns.properties) {
    highlighted = highlighted.replace(patterns.properties, `<span style="color: ${theme.property}">$1</span>:`);
  }
  if (patterns.selectors) {
    highlighted = highlighted.replace(patterns.selectors, `<span style="color: ${theme.selector}">$1</span> {`);
  }
  if (patterns.decorators) {
    highlighted = highlighted.replace(patterns.decorators, `<span style="color: ${theme.class}">$1</span>`);
  }
  if (patterns.tags) {
    highlighted = highlighted.replace(patterns.tags, `$1<span style="color: ${theme.tag}">$2</span>`);
  }
  if (patterns.attributes) {
    highlighted = highlighted.replace(patterns.attributes, `<span style="color: ${theme.attribute}">$1</span>=`);
  }
  if (patterns.keys) {
    highlighted = highlighted.replace(patterns.keys, `"<span style="color: ${theme.property}">$1</span>":`);
  }
  if (patterns.commands) {
    highlighted = highlighted.replace(patterns.commands, `<span style="color: ${theme.function}">$1</span>`);
  }
  if (patterns.variables) {
    highlighted = highlighted.replace(patterns.variables, `<span style="color: ${theme.constant}">$1</span>`);
  }

  return highlighted;
};

// Language detection function
const detectLanguage = (language) => {
  const langMap = {
    js: 'javascript',
    javascript: 'javascript',
    ts: 'typescript',
    typescript: 'typescript',
    py: 'python',
    python: 'python',
    html: 'html',
    css: 'css',
    java: 'java',
    bash: 'bash',
    sh: 'bash',
    shell: 'bash',
    json: 'json',
    text: 'text'
  };
  return langMap[language?.toLowerCase()] || 'text';
};

export function TiptapRenderer({ content, className }) {
  const renderContent = useMemo(() => {
    if (!content) return null;

    // If content is already HTML, render it directly
    if (typeof content === 'string' && (content.startsWith('<') || content.includes('</'))) {
      return (
        <div 
          className="tiptap-content"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      );
    }

    try {
      // If content is a string, try to parse it as JSON
      const parsedContent = typeof content === 'string' ? JSON.parse(content) : content;

      if (!parsedContent || !parsedContent.content) {
        // If no valid content, try to render as plain text
        return <div className="tiptap-content">{String(content)}</div>;
      }

      return parsedContent.content.map((node, index) => {
        return renderNode(node, `${index}`);
      });
    } catch (error) {
      console.error('Error parsing Tiptap content:', error);
      // Fallback: render as plain text or HTML
      if (typeof content === 'string' && content.length > 0) {
        return (
          <div 
            className="tiptap-content"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        );
      }
      return <div className="text-gray-500 text-sm sm:text-base">No content available.</div>;
    }
  }, [content]);

  if (!content) {
    return <div className={cn("text-gray-500 text-sm sm:text-base", className)}>No content available.</div>;
  }

  return (
    <div className={cn("tiptap-content w-full max-w-full overflow-x-hidden", className)}>
      {renderContent}
    </div>
  );
}

function renderNode(node, key) {
  if (!node) return null;

  switch (node.type) {
    case 'text':
      let textElement = node.text;
      
      if (node.marks) {
        node.marks.forEach(mark => {
          switch (mark.type) {
            case 'bold':
              textElement = <strong key={key} className="font-semibold text-gray-900 text-sm sm:text-base">{textElement}</strong>;
              break;
            case 'italic':
              textElement = <em key={key} className="italic text-gray-800 text-sm sm:text-base">{textElement}</em>;
              break;
            case 'underline':
              textElement = <u key={key} className="underline decoration-blue-400 text-sm sm:text-base">{textElement}</u>;
              break;
            case 'strike':
              textElement = <s key={key} className="line-through text-gray-500 text-sm sm:text-base">{textElement}</s>;
              break;
            case 'code':
              textElement = (
                <code 
                  key={key} 
                  className="bg-gray-100 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs sm:text-sm font-mono text-red-600 border border-gray-300 break-words"
                >
                  {textElement}
                </code>
              );
              break;
            case 'link':
              textElement = (
                <a 
                  key={key} 
                  href={mark.attrs.href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 underline hover:text-blue-800 transition-colors text-sm sm:text-base break-all"
                >
                  {textElement}
                </a>
              );
              break;
            case 'highlight':
              textElement = (
                <mark key={key} className="bg-yellow-200 px-1 rounded text-sm sm:text-base">
                  {textElement}
                </mark>
              );
              break;
            default:
              break;
          }
        });
      }
      
      return textElement;

    case 'paragraph':
      const alignClass = node.attrs?.textAlign ? `text-${node.attrs.textAlign}` : '';
      return (
        <p key={key} className={cn("mb-3 sm:mb-4 leading-6 sm:leading-7 text-gray-700 text-sm sm:text-base", alignClass)}>
          {node.content?.map((child, idx) => renderNode(child, `${key}-${idx}`))}
        </p>
      );

    case 'heading':
      const level = node.attrs?.level || 1;
      const HeadingTag = `h${level}`;
      const headingAlignClass = node.attrs?.textAlign ? `text-${node.attrs.textAlign}` : '';
      const headingClasses = {
        1: "text-xl sm:text-2xl font-bold mt-6 sm:mt-8 mb-3 sm:mb-4 text-gray-900",
        2: "text-lg sm:text-xl font-bold mt-5 sm:mt-6 mb-2 sm:mb-3 text-gray-800",
        3: "text-base sm:text-lg font-semibold mt-4 sm:mt-5 mb-2 text-gray-800"
      };
      
      return (
        <HeadingTag key={key} className={cn(headingClasses[level], headingAlignClass)}>
          {node.content?.map((child, idx) => renderNode(child, `${key}-${idx}`))}
        </HeadingTag>
      );

    case 'codeBlock':
      const language = detectLanguage(node.attrs?.language);
      const codeContent = node.content?.[0]?.text || '';
      
      const handleCopy = async () => {
        try {
          await navigator.clipboard.writeText(codeContent);
          // You could add a toast notification here
          console.log('Code copied to clipboard!');
        } catch (err) {
          console.error('Failed to copy code:', err);
        }
      };

      return (
        <div key={key} className="my-4 sm:my-6 rounded-lg overflow-hidden border border-gray-300 bg-gray-50 shadow-sm max-w-full">
          <div className="bg-gray-100 text-gray-700 px-3 sm:px-4 py-2 text-xs sm:text-sm font-mono flex justify-between items-center border-b border-gray-300">
            <div className="flex items-center gap-1 sm:gap-2">
              <span className="text-gray-600 font-medium">{language.toUpperCase()}</span>
            </div>
            <button 
              onClick={handleCopy}
              className="text-xs bg-white hover:bg-gray-50 px-2 sm:px-3 py-1 rounded border border-gray-300 hover:border-gray-400 transition-colors duration-200 flex items-center gap-1 text-gray-600 hover:text-gray-800 min-w-[60px] sm:min-w-[70px] justify-center"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy
            </button>
          </div>
          <pre className="bg-white text-gray-900 p-3 sm:p-4 overflow-x-auto m-0 max-w-full">
            <code 
              className="font-mono text-xs sm:text-sm leading-5 sm:leading-6 block whitespace-pre-wrap break-words"
              dangerouslySetInnerHTML={{ 
                __html: highlightCode(codeContent, language)
              }}
            />
          </pre>
        </div>
      );

    case 'blockquote':
      return (
        <blockquote key={key} className="border-l-4 border-blue-500 pl-3 sm:pl-4 my-3 sm:my-4 italic text-gray-600 bg-blue-50 py-2 rounded-r text-sm sm:text-base">
          {node.content?.map((child, idx) => renderNode(child, `${key}-${idx}`))}
        </blockquote>
      );

    case 'bulletList':
      return (
        <ul key={key} className="list-disc list-inside my-3 sm:my-4 space-y-1 ml-3 sm:ml-4 text-sm sm:text-base">
          {node.content?.map((child, idx) => renderNode(child, `${key}-${idx}`))}
        </ul>
      );

    case 'orderedList':
      return (
        <ol key={key} className="list-decimal list-inside my-3 sm:my-4 space-y-1 ml-3 sm:ml-4 text-sm sm:text-base">
          {node.content?.map((child, idx) => renderNode(child, `${key}-${idx}`))}
        </ol>
      );

    case 'listItem':
      return (
        <li key={key} className="text-gray-700 mb-1 text-sm sm:text-base">
          {node.content?.map((child, idx) => renderNode(child, `${key}-${idx}`))}
        </li>
      );

    case 'horizontalRule':
      return (
        <hr key={key} className="my-4 sm:my-6 border-gray-300" />
      );

    case 'image':
      return (
        <div key={key} className="my-3 sm:my-4 max-w-full overflow-hidden">
          <div className="rounded-lg overflow-hidden border border-gray-300 max-w-full">
            <img
              src={node.attrs?.src}
              alt={node.attrs?.alt || ''}
              className="max-w-full h-auto"
            />
          </div>
          {node.attrs?.alt && (
            <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2 text-center italic px-2">
              {node.attrs.alt}
            </p>
          )}
        </div>
      );

    case 'table':
      return (
        <div key={key} className="overflow-x-auto my-3 sm:my-4 rounded-lg border border-gray-300 max-w-full">
          <table className="min-w-full border-collapse text-sm sm:text-base">
            {node.content?.map((child, idx) => renderNode(child, `${key}-${idx}`))}
          </table>
        </div>
      );

    case 'tableRow':
      const isHeader = node.content?.[0]?.type === 'tableHeader';
      return (
        <tr key={key} className={isHeader ? 'bg-gray-50' : 'border-b border-gray-300'}>
          {node.content?.map((child, idx) => renderNode(child, `${key}-${idx}`))}
        </tr>
      );

    case 'tableHeader':
      return (
        <th key={key} className="border border-gray-300 px-2 sm:px-3 py-1.5 sm:py-2 text-left font-semibold text-gray-900 bg-gray-100 text-xs sm:text-sm">
          {node.content?.map((child, idx) => renderNode(child, `${key}-${idx}`))}
        </th>
      );

    case 'tableCell':
      return (
        <td key={key} className="border border-gray-300 px-2 sm:px-3 py-1.5 sm:py-2 text-gray-700 text-xs sm:text-sm">
          {node.content?.map((child, idx) => renderNode(child, `${key}-${idx}`))}
        </td>
      );

    case 'hardBreak':
      return <br key={key} />;

    case 'mention':
      return (
        <span key={key} className="bg-blue-100 text-blue-800 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs sm:text-sm font-medium">
          @{node.attrs?.label || node.attrs?.id}
        </span>
      );

    case 'taskList':
      return (
        <div key={key} className="my-3 sm:my-4 space-y-2 text-sm sm:text-base">
          {node.content?.map((child, idx) => renderNode(child, `${key}-${idx}`))}
        </div>
      );

    case 'taskItem':
      const checked = node.attrs?.checked || false;
      return (
        <div key={key} className="flex items-start gap-2 text-sm sm:text-base">
          <input 
            type="checkbox" 
            checked={checked} 
            readOnly 
            className="mt-0.5 sm:mt-1 w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
          />
          <div className="flex-1 text-gray-700">
            {node.content?.map((child, idx) => renderNode(child, `${key}-${idx}`))}
          </div>
        </div>
      );

    case 'youtube':
      return (
        <div key={key} className="my-3 sm:my-4 max-w-full">
          <div className="bg-gray-200 rounded-lg overflow-hidden max-w-full">
            <iframe
              src={`https://www.youtube.com/embed/${node.attrs?.videoId}`}
              title="YouTube video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-40 sm:h-48 md:h-64"
            />
          </div>
        </div>
      );

    default:
      if (node.content) {
        return (
          <div key={key} className="text-sm sm:text-base">
            {node.content?.map((child, idx) => renderNode(child, `${key}-${idx}`))}
          </div>
        );
      }
      return null;
  }
}