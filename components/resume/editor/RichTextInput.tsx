"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button, Tooltip } from "antd";
import {
  BoldOutlined,
  ItalicOutlined,
  LinkOutlined,
  OrderedListOutlined,
  UnderlineOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { sanitizeRichTextHtml, stripRichText } from "@/lib/rich-text";

type Props = {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  minRows?: number;
};

export function RichTextInput({ value = "", onChange, placeholder, minRows = 3 }: Props) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isEmpty, setIsEmpty] = useState(!stripRichText(value));

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor || document.activeElement === editor) return;

    const nextValue = value || "";
    if (editor.innerHTML !== nextValue) {
      editor.innerHTML = nextValue;
    }
    
    const empty = !stripRichText(nextValue);
    setIsEmpty((prev) => (prev !== empty ? empty : prev));
  }, [value]);

  const emitChange = useCallback(() => {
    const nextValue = editorRef.current?.innerHTML || "";
    
    const empty = !stripRichText(nextValue);
    setIsEmpty((prev) => (prev !== empty ? empty : prev));
    
    if (nextValue !== value) {
      onChange?.(nextValue);
    }
  }, [value, onChange]);

  const selectionIsInsideEditor = () => {
    const editor = editorRef.current;
    const selection = window.getSelection();
    if (!editor || !selection || selection.rangeCount === 0) return false;

    const range = selection.getRangeAt(0);
    return editor.contains(range.commonAncestorContainer);
  };

  const selectEditorContents = () => {
    const editor = editorRef.current;
    if (!editor) return;

    const range = document.createRange();
    range.selectNodeContents(editor);

    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
  };

  const runCommand = (command: string, commandValue?: string) => {
    editorRef.current?.focus();
    if (!selectionIsInsideEditor()) selectEditorContents();
    document.execCommand(command, false, commandValue);
    emitChange();
  };

  const addLink = () => {
    const url = window.prompt("Enter link URL");
    if (!url) return;
    runCommand("createLink", url);
  };

  const sanitizeOnBlur = () => {
    const editor = editorRef.current;
    if (!editor) return;

    const sanitized = sanitizeRichTextHtml(editor.innerHTML);
    editor.innerHTML = sanitized;
    setIsEmpty(!stripRichText(sanitized));
    onChange?.(sanitized);
  };

  const buttons = [
    { label: "Bold", icon: <BoldOutlined />, onClick: () => runCommand("bold") },
    { label: "Italic", icon: <ItalicOutlined />, onClick: () => runCommand("italic") },
    { label: "Underline", icon: <UnderlineOutlined />, onClick: () => runCommand("underline") },
    { label: "Bullet list", icon: <UnorderedListOutlined />, onClick: () => runCommand("insertUnorderedList") },
    { label: "Numbered list", icon: <OrderedListOutlined />, onClick: () => runCommand("insertOrderedList") },
    { label: "Link", icon: <LinkOutlined />, onClick: addLink },
  ];

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100">
      <div className="flex flex-wrap items-center gap-1 border-b border-slate-100 bg-slate-50 px-2 py-1.5">
        {buttons.map((button) => (
          <Tooltip title={button.label} key={button.label}>
            <Button
              type="text"
              size="small"
              icon={button.icon}
              aria-label={button.label}
              onMouseDown={(event) => event.preventDefault()}
              onClick={button.onClick}
              className="flex h-8 w-8 items-center justify-center rounded-md text-slate-600"
            />
          </Tooltip>
        ))}
      </div>
      <div
        ref={editorRef}
        role="textbox"
        aria-multiline="true"
        contentEditable
        suppressContentEditableWarning
        data-placeholder={placeholder}
        className={`rich-text-input px-3 py-2 text-sm leading-6 text-slate-800 outline-none ${isEmpty ? "is-empty" : ""}`}
        style={{ minHeight: `${minRows * 32}px` }}
        onInput={emitChange}
        onBlur={sanitizeOnBlur}
      />
    </div>
  );
}
