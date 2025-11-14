"use client";
import React, { useEffect, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Heading from "@tiptap/extension-heading";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Link as LinkIcon,
  Image as ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo,
  MoreHorizontal,
  ChevronDown,
} from "lucide-react";

export default function RichTextEditor({ content, onChange, placeholder = "Write something amazing..." }) {
  const [mounted, setMounted] = useState(false);
  const [activeStates, setActiveStates] = useState({});
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [showMoreTools, setShowMoreTools] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false, // Disable default heading to use our custom one
      }),
      Heading.configure({
        levels: [1, 2, 3],
      }),
      Underline,
      Placeholder.configure({
        placeholder: placeholder,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-lg max-w-full h-auto border',
        },
      }),
      Link.configure({
        HTMLAttributes: {
          class: 'text-blue-600 underline',
        },
        openOnClick: false,
      }),
    ],
    content: content,
    editorProps: {
      attributes: {
        class: "tiptap-editor min-h-[200px] sm:min-h-[300px] p-3 sm:p-4 bg-white focus:outline-none text-sm sm:text-base",
      },
    },
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
      updateEditorState(editor);
    },
    onCreate: ({ editor }) => {
      updateEditorState(editor);
    },
    onTransaction: ({ editor }) => {
      updateEditorState(editor);
    },
    immediatelyRender: false,
  });

  // Update all editor states
  const updateEditorState = (editorInstance) => {
    if (!editorInstance) return;
    
    setActiveStates({
      bold: editorInstance.isActive('bold'),
      italic: editorInstance.isActive('italic'),
      underline: editorInstance.isActive('underline'),
      heading1: editorInstance.isActive('heading', { level: 1 }),
      heading2: editorInstance.isActive('heading', { level: 2 }),
      heading3: editorInstance.isActive('heading', { level: 3 }),
      bulletList: editorInstance.isActive('bulletList'),
      orderedList: editorInstance.isActive('orderedList'),
      blockquote: editorInstance.isActive('blockquote'),
      codeBlock: editorInstance.isActive('codeBlock'),
      link: editorInstance.isActive('link'),
      alignLeft: editorInstance.isActive({ textAlign: 'left' }),
      alignCenter: editorInstance.isActive({ textAlign: 'center' }),
      alignRight: editorInstance.isActive({ textAlign: 'right' }),
    });

    setCanUndo(editorInstance.can().undo());
    setCanRedo(editorInstance.can().redo());
  };

  // Prevent SSR mismatch
  useEffect(() => setMounted(true), []);

  // Update content when prop changes
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
      updateEditorState(editor);
    }
  }, [content, editor]);

  if (!mounted) {
    return (
      <div className="border border-gray-300 rounded-lg bg-white overflow-hidden shadow-sm">
        <div className="h-10 sm:h-12 bg-gray-50 border-b border-gray-200 rounded-t-lg flex items-center gap-1 p-2 overflow-x-auto">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-6 w-6 sm:h-8 sm:w-8 bg-gray-200 rounded-md animate-pulse flex-shrink-0"></div>
          ))}
        </div>
        <div className="min-h-[200px] sm:min-h-[300px] p-3 sm:p-4 bg-white rounded-b-lg">
          <div className="space-y-2 sm:space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-3 sm:h-4 bg-gray-200 rounded animate-pulse" style={{ width: `${100 - i * 15}%` }}></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!editor) {
    return (
      <div className="border border-gray-300 rounded-lg bg-white overflow-hidden shadow-sm">
        <div className="p-4 min-h-[200px] sm:min-h-[300px] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-500 text-xs sm:text-sm">Loading editor...</p>
          </div>
        </div>
      </div>
    );
  }

  const addImage = () => {
    const url = window.prompt('Enter image URL:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Enter URL:', previousUrl);

    if (url === null) return;
    
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  // Formatting functions
  const toggleHeading = (level) => {
    editor.chain().focus().toggleHeading({ level }).run();
  };

  const toggleBulletList = () => {
    editor.chain().focus().toggleBulletList().run();
  };

  const toggleOrderedList = () => {
    editor.chain().focus().toggleOrderedList().run();
  };

  const toggleBlockquote = () => {
    editor.chain().focus().toggleBlockquote().run();
  };

  const toggleCodeBlock = () => {
    editor.chain().focus().toggleCodeBlock().run();
  };

  const setTextAlignment = (alignment) => {
    editor.chain().focus().setTextAlign(alignment).run();
  };

  const handleUndo = () => {
    if (canUndo) {
      editor.chain().focus().undo().run();
    }
  };

  const handleRedo = () => {
    if (canRedo) {
      editor.chain().focus().redo().run();
    }
  };

  return (
    <div className="border border-gray-300 rounded-lg bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow min-h-auto">
      {/* Enhanced Toolbar - Mobile Optimized */}
      <div className="flex flex-col">
        {/* Main Toolbar Row */}
        <div className="flex items-center gap-1 p-2 sm:p-3 border-b border-gray-200 bg-gray-50 overflow-x-auto">
          {/* Text Formatting */}
          <div className="flex items-center gap-1 border-r border-gray-300 pr-2 flex-shrink-0">
            <ToolbarButton
              icon={<Bold className="h-3 w-3 sm:h-4 sm:w-4" />}
              active={activeStates.bold}
              onClick={() => editor.chain().focus().toggleBold().run()}
              tooltip="Bold (Ctrl+B)"
              mobile
            />
            <ToolbarButton
              icon={<Italic className="h-3 w-3 sm:h-4 sm:w-4" />}
              active={activeStates.italic}
              onClick={() => editor.chain().focus().toggleItalic().run()}
              tooltip="Italic (Ctrl+I)"
              mobile
            />
            <ToolbarButton
              icon={<UnderlineIcon className="h-3 w-3 sm:h-4 sm:w-4" />}
              active={activeStates.underline}
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              tooltip="Underline (Ctrl+U)"
              mobile
            />
          </div>

          {/* Headings */}
          <div className="flex items-center gap-1 border-r border-gray-300 px-2 flex-shrink-0">
            <ToolbarButton
              icon={<Heading1 className="h-3 w-3 sm:h-4 sm:w-4" />}
              active={activeStates.heading1}
              onClick={() => toggleHeading(1)}
              tooltip="Heading 1"
              mobile
            />
            <ToolbarButton
              icon={<Heading2 className="h-3 w-3 sm:h-4 sm:w-4" />}
              active={activeStates.heading2}
              onClick={() => toggleHeading(2)}
              tooltip="Heading 2"
              mobile
            />
          </div>

          {/* Lists */}
          <div className="flex items-center gap-1 border-r border-gray-300 px-2 flex-shrink-0">
            <ToolbarButton
              icon={<List className="h-3 w-3 sm:h-4 sm:w-4" />}
              active={activeStates.bulletList}
              onClick={toggleBulletList}
              tooltip="Bullet List"
              mobile
            />
            <ToolbarButton
              icon={<ListOrdered className="h-3 w-3 sm:h-4 sm:w-4" />}
              active={activeStates.orderedList}
              onClick={toggleOrderedList}
              tooltip="Numbered List"
              mobile
            />
          </div>

          {/* History */}
          <div className="flex items-center gap-1 border-r border-gray-300 px-2 flex-shrink-0">
            <ToolbarButton
              icon={<Undo className="h-3 w-3 sm:h-4 sm:w-4" />}
              onClick={handleUndo}
              disabled={!canUndo}
              tooltip="Undo (Ctrl+Z)"
              mobile
            />
            <ToolbarButton
              icon={<Redo className="h-3 w-3 sm:h-4 sm:w-4" />}
              onClick={handleRedo}
              disabled={!canRedo}
              tooltip="Redo (Ctrl+Y)"
              mobile
            />
          </div>

          {/* More Tools Dropdown for Mobile */}
          <div className="flex items-center gap-1 pl-2 flex-shrink-0 sm:hidden">
            <button
              type="button"
              onClick={() => setShowMoreTools(!showMoreTools)}
              className="relative p-1.5 rounded-md transition-all duration-200 hover:bg-gray-100 text-gray-600 hover:text-gray-900"
              title="More tools"
            >
              <MoreHorizontal className="h-3 w-3" />
            </button>
          </div>

          {/* Media - Hidden on mobile, shown in dropdown */}
          <div className="hidden sm:flex items-center gap-1 border-r border-gray-300 px-2 flex-shrink-0">
            <ToolbarButton
              icon={<LinkIcon className="h-3 w-3 sm:h-4 sm:w-4" />}
              active={activeStates.link}
              onClick={setLink}
              tooltip="Add Link"
              mobile
            />
            <ToolbarButton
              icon={<ImageIcon className="h-3 w-3 sm:h-4 sm:w-4" />}
              onClick={addImage}
              tooltip="Add Image"
              mobile
            />
          </div>

          {/* Text Alignment - Hidden on mobile, shown in dropdown */}
          <div className="hidden sm:flex items-center gap-1 border-r border-gray-300 px-2 flex-shrink-0">
            <ToolbarButton
              icon={<AlignLeft className="h-3 w-3 sm:h-4 sm:w-4" />}
              active={activeStates.alignLeft}
              onClick={() => setTextAlignment('left')}
              tooltip="Align Left"
              mobile
            />
            <ToolbarButton
              icon={<AlignCenter className="h-3 w-3 sm:h-4 sm:w-4" />}
              active={activeStates.alignCenter}
              onClick={() => setTextAlignment('center')}
              tooltip="Align Center"
              mobile
            />
            <ToolbarButton
              icon={<AlignRight className="h-3 w-3 sm:h-4 sm:w-4" />}
              active={activeStates.alignRight}
              onClick={() => setTextAlignment('right')}
              tooltip="Align Right"
              mobile
            />
          </div>

          {/* Blocks - Hidden on mobile, shown in dropdown */}
          <div className="hidden sm:flex items-center gap-1 pl-2 flex-shrink-0">
            <ToolbarButton
              icon={<Quote className="h-3 w-3 sm:h-4 sm:w-4" />}
              active={activeStates.blockquote}
              onClick={toggleBlockquote}
              tooltip="Blockquote"
              mobile
            />
            <ToolbarButton
              icon={<Code className="h-3 w-3 sm:h-4 sm:w-4" />}
              active={activeStates.codeBlock}
              onClick={toggleCodeBlock}
              tooltip="Code Block"
              mobile
            />
          </div>
        </div>

        {/* Expanded Tools Row for Mobile */}
        {showMoreTools && (
          <div className="flex items-center gap-1 p-2 border-b border-gray-200 bg-gray-50 overflow-x-auto sm:hidden">
            {/* Media Tools */}
            <div className="flex items-center gap-1 border-r border-gray-300 pr-2 flex-shrink-0">
              <ToolbarButton
                icon={<LinkIcon className="h-3 w-3" />}
                active={activeStates.link}
                onClick={setLink}
                tooltip="Add Link"
                mobile
              />
              <ToolbarButton
                icon={<ImageIcon className="h-3 w-3" />}
                onClick={addImage}
                tooltip="Add Image"
                mobile
              />
            </div>

            {/* Text Alignment */}
            <div className="flex items-center gap-1 border-r border-gray-300 px-2 flex-shrink-0">
              <ToolbarButton
                icon={<AlignLeft className="h-3 w-3" />}
                active={activeStates.alignLeft}
                onClick={() => setTextAlignment('left')}
                tooltip="Align Left"
                mobile
              />
              <ToolbarButton
                icon={<AlignCenter className="h-3 w-3" />}
                active={activeStates.alignCenter}
                onClick={() => setTextAlignment('center')}
                tooltip="Align Center"
                mobile
              />
              <ToolbarButton
                icon={<AlignRight className="h-3 w-3" />}
                active={activeStates.alignRight}
                onClick={() => setTextAlignment('right')}
                tooltip="Align Right"
                mobile
              />
            </div>

            {/* Blocks */}
            <div className="flex items-center gap-1 pl-2 flex-shrink-0">
              <ToolbarButton
                icon={<Quote className="h-3 w-3" />}
                active={activeStates.blockquote}
                onClick={toggleBlockquote}
                tooltip="Blockquote"
                mobile
              />
              <ToolbarButton
                icon={<Code className="h-3 w-3" />}
                active={activeStates.codeBlock}
                onClick={toggleCodeBlock}
                tooltip="Code Block"
                mobile
              />
              <ToolbarButton
                icon={<Heading3 className="h-3 w-3" />}
                active={activeStates.heading3}
                onClick={() => toggleHeading(3)}
                tooltip="Heading 3"
                mobile
              />
            </div>
          </div>
        )}
      </div>

      {/* Editor Content */}
      <EditorContent editor={editor} />
    </div>
  );
}

function ToolbarButton({ icon, onClick, active, disabled = false, tooltip, mobile = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`
        relative p-1.5 sm:p-2 rounded-md transition-all duration-200 group
        ${active
          ? "bg-blue-500 text-white shadow-sm"
          : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
        }
        ${disabled
          ? "opacity-40 cursor-not-allowed"
          : "cursor-pointer"
        }
        ${mobile ? "touch-manipulation" : ""}
      `}
      title={tooltip}
    >
      {icon}

      {/* Tooltip - Only show on non-touch devices or with delay for mobile */}
      <div className="hidden sm:block absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
        {tooltip}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
      </div>

      {/* Mobile tooltip with tap */}
      <div className="sm:hidden absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 text-xs text-white bg-gray-900 rounded-md opacity-0 group-focus:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
        {tooltip}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
      </div>
    </button>
  );
}