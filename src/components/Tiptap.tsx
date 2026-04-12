"use client";

import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect, useState } from "react";
import { Bold, Italic, List, ListOrdered, UnderlineIcon } from "lucide-react";
import { useEditor, EditorContent, useEditorState } from "@tiptap/react";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function Tiptap({ value, onChange }: Props) {
  const [, setRefresh] = useState(0);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Nhập mô tả voucher...",
      }),
    ],
    content: value || "<p></p>",
    immediatelyRender: false,

    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  const editorState = useEditorState({
    editor,
    selector: ({ editor }) => ({
      isBold: editor?.isActive("bold") ?? false,
      isItalic: editor?.isActive("italic") ?? false,
      isUnderline: editor?.isActive("underline") ?? false,
      isBulletList: editor?.isActive("bulletList") ?? false,
      isOrderedList: editor?.isActive("orderedList") ?? false,
    }),
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "<p></p>");
    }
  }, [value, editor]);

  if (!editor) return null;

  return (
    <div className="border border-violet-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-violet-400">

      {/* TOOLBAR*/}
      <div className="flex gap-1 border-b border-violet-100 p-2 bg-violet-50">
        {/* BOLD */}
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={btn(editorState?.isBold ?? false)}
        >
          <Bold size={16} />
        </button>

        {/* ITALIC */}
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={btn(editorState?.isItalic ?? false)}
        >
          <Italic size={16} />
        </button>

        {/* UNDERLINE */}
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={btn(editorState?.isUnderline ?? false)}
        >
          <UnderlineIcon size={16} />
        </button>

        {/* BULLET LIST */}
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={btn(editorState?.isBulletList ?? false)}
        >
          <List size={16} />
        </button>

        {/* ORDERED LIST */}
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={btn(editorState?.isOrderedList ?? false)}
        >
          <ListOrdered size={16} />
        </button>

      </div>

      {/* ✍️ EDITOR */}
      <EditorContent
        editor={editor}
        className="p-3 min-h-30 outline-none"
      />
    </div>
  );
}

function btn(active: boolean) {
  return `p-2 rounded-lg transition ${active
    ? "bg-violet-500 text-white"
    : "hover:bg-violet-100 text-gray-700"
    }`;
}