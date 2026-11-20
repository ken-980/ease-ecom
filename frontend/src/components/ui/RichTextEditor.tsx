import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
} from 'lucide-react';
import { useId, useState } from 'react';
import { cn } from '../../utils/cn';



export interface RichTextEditorProps {
  label: string;
  name: string;
  defaultValue?: string;
  error?: string;
  disabled?: boolean;
  className?: string
}

export const RichTextEditor = ({
  label,
  name,
  defaultValue = '',
  error,
  disabled = false,
  className,
}: RichTextEditorProps) => {
  const id = useId();
  const [htmlValue, setHtmlValue] = useState(defaultValue);

  const editor = useEditor({
    extensions: [StarterKit],
    content: defaultValue,
    editable: !disabled,
    onUpdate: ({ editor }) => {
      // Store clean empty string if editor only has an empty <p></p>
      setHtmlValue(editor.isEmpty ? '' : editor.getHTML());
    },
    editorProps: {
      attributes: {
        id,
        class:
          'prose prose-sm max-w-none min-h-[160px] px-3.5 py-3 text-ink-primary focus:outline-none',
      },
    },
  });

  if (!editor) return null;

  const toolbarButtons = [
    {
      icon: Bold,
      label: 'Bold',
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: editor.isActive('bold'),
    },
    {
      icon: Italic,
      label: 'Italic',
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: editor.isActive('italic'),
    },
    {
      icon: UnderlineIcon,
      label: 'Underline',
      action: () => editor.chain().focus().toggleUnderline().run(),
      isActive: editor.isActive('underline'),
    },
    {
      icon: Strikethrough,
      label: 'Strikethrough',
      action: () => editor.chain().focus().toggleStrike().run(),
      isActive: editor.isActive('strike'),
    },
    {
      icon: Heading1,
      label: 'Heading 1',
      action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: editor.isActive('heading', { level: 1 }),
    },
    {
      icon: Heading2,
      label: 'Heading 2',
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: editor.isActive('heading', { level: 2 }),
    },
    {
      icon: List,
      label: 'Bullet List',
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: editor.isActive('bulletList'),
    },
    {
      icon: ListOrdered,
      label: 'Ordered List',
      action: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: editor.isActive('orderedList'),
    },
    {
      icon: Quote,
      label: 'Blockquote',
      action: () => editor.chain().focus().toggleBlockquote().run(),
      isActive: editor.isActive('blockquote'),
    },
    {
      icon: Undo,
      label: 'Undo',
      action: () => editor.chain().focus().undo().run(),
      isActive: false,
    },
    {
      icon: Redo,
      label: 'Redo',
      action: () => editor.chain().focus().redo().run(),
      isActive: false,
    },
  ];

  return (
    <div className={cn('flex flex-col', className)}>
      <label htmlFor={id} className="block text-sm font-medium text-ink-label">
        {label}
      </label>

      {/* Hidden input syncs editor HTML with React Router's <Form> */}
      <input type="hidden" name={name} value={htmlValue} />

      <div
        className={cn(
          'mt-1.5 rounded-sm border bg-surface-card shadow-sm overflow-hidden transition focus-within:ring-1',
          error
            ? 'border-red-500 focus-within:border-red-500 focus-within:ring-red-500'
            : 'border-brand-border focus-within:border-brand focus-within:ring-brand',
          disabled && 'opacity-50 pointer-events-none'
        )}
      >
        {/* Toolbar */}
        <div
          role="toolbar"
          aria-label="Formatting options"
          className="flex flex-wrap items-center gap-1 border-b border-brand-border bg-surface-input px-2.5 py-2"
        >
          {toolbarButtons.map(({ icon: Icon, label: btnLabel, action, isActive }) => (
            <button
              key={btnLabel}
              type="button"
              onClick={action}
              aria-label={btnLabel}
              aria-pressed={isActive}
              className={cn(
                'p-1.5 rounded-sm transition cursor-pointer',
                isActive
                  ? 'bg-brand text-white'
                  : 'text-ink-label hover:bg-surface-card hover:text-brand'
              )}
            >
              <Icon className="h-4 w-4" />
            </button>
          ))}
        </div>

        {/* Editable Content Area */}
        <EditorContent editor={editor} />
      </div>

      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};