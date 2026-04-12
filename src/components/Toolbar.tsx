import { Bold, Italic, List, ListOrdered, Heading } from "lucide-react";

function Toolbar({ editor }: any) {
  return (
    <div className="flex gap-1 border-b border-violet-100 p-2 bg-violet-50">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={btn(editor.isActive("bold"))}
      >
        <Bold size={16} />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={btn(editor.isActive("italic"))}
      >
        <Italic size={16} />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={btn(editor.isActive("heading", { level: 1 }))}
      >
        <Heading size={16} />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={btn(editor.isActive("bulletList"))}
      >
        <List size={16} />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={btn(editor.isActive("orderedList"))}
      >
        <ListOrdered size={16} />
      </button>
    </div>
  );
}

function btn(active: boolean) {
  return `p-2 rounded-lg transition ${
    active
      ? "bg-violet-500 text-white"
      : "hover:bg-violet-100 text-gray-700"
  }`;
}