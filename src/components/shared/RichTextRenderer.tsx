"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableCell } from "@tiptap/extension-table-cell";
import { TextAlign } from "@tiptap/extension-text-align";
import React from "react";

interface RichTextRendererProps {
  content: string | unknown;
  className?: string;
}

const RichTextRenderer = ({ content, className }: RichTextRendererProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: true,
      }),
      Image.configure({
        inline: true,
        allowBase64: false,
        HTMLAttributes: {
          class: "rounded-lg max-w-full h-auto my-4",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: "border-collapse table-auto w-full mb-4",
        },
      }),
      TableRow,
      TableHeader.configure({
        HTMLAttributes: {
          class: "bg-white/10 border border-white/20 p-2 font-bold text-left",
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: "border border-white/10 p-2 text-white/80",
        },
      }),
    ],
    immediatelyRender: false,
    content: (() => {
      if (!content) return "";
      if (typeof content === "object") return content;
      if (typeof content === "string") {
        try {
          return JSON.parse(content);
        } catch {
          return content;
        }
      }
      return content;
    })(),
    editable: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-invert prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none",
      },
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className={`rich-text-renderer ${className}`}>
      <style>{`
        .prose table {
          border-collapse: collapse;
          table-layout: fixed;
          width: 100%;
          margin: 1.5em 0;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 8px;
        }
        .prose table th,
        .prose table td {
          min-width: 1em;
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 8px 12px;
          vertical-align: top;
          box-sizing: border-box;
          position: relative;
        }
        .prose table th {
          font-weight: bold;
          text-align: left;
          background-color: rgba(255, 255, 255, 0.05);
        }
        .prose .tableWrapper {
          overflow-x: auto;
          margin: 1.5em 0;
        }
      `}</style>
      <EditorContent editor={editor} />
    </div>
  );
};

export default RichTextRenderer;
