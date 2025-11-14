"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
} from "lucide-react";
import { useCallback } from "react";

export default function RichTextEditorImpl({ value = "", onChange }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Write something amazing...",
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class:
          "prose max-w-none focus:outline-none min-h-[300px] px-4 py-2 text-gray-800",
      },
    },
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
  });

  const Button = useCallback(
    ({ icon: Icon, action, isActive }) => (
      <button
        type="button"
        onClick={action}
        className={`p-2 rounded-md ${
          isActive
            ? "bg-blue-100 text-blue-700"
            : "hover:bg-gray-100 text-gray-700"
        }`}
      >
        <Icon size={18} />
      </button>
    ),
    []
  );

  if (!editor) return null;

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm">
      <div className="flex items-center flex-wrap gap-1 p-2 border-b bg-gray-50">
        <Button
          icon={Bold}
          action={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
        />
        <Button
          icon={Italic}
          action={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
        />
        <Button
          icon={Strikethrough}
          action={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive("strike")}
        />
        <Button
          icon={List}
          action={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
        />
        <Button
          icon={ListOrdered}
          action={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedList")}
        />
        <Button
          icon={Quote}
          action={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive("blockquote")}
        />
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}
