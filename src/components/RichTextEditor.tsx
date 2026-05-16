"use client";

import dynamic from "next/dynamic";

const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => <div className="h-[160px] w-full bg-surface-container-low animate-pulse rounded" />,
});

interface RichTextEditorProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export default function RichTextEditor({ label, value, onChange }: RichTextEditorProps) {
  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "link",
  ];

  return (
    <div className="space-y-2 rich-text-editor">
      <label className="font-label-caps text-[9px] text-on-surface-variant tracking-widest uppercase block">{label}</label>
      <div className="bg-surface-container-low border border-outline-variant focus-within:border-primary transition-colors overflow-hidden rounded-sm">
        <ReactQuill
          theme="snow"
          value={value}
          onChange={onChange}
          modules={modules}
          formats={formats}
          className="admin-quill-editor"
        />
      </div>
    </div>
  );
}
