import { Editor } from "@/common/lib/editor/editor";
import { useEffect, useRef } from "react";

export const useEditor = (options: {
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  updateContent: (content: string) => void;
  content: string;
}) => {
  const { textareaRef, updateContent, content } = options;
  const editorRef = useRef<Editor | null>(null);
  const updateContentRef = useRef(updateContent);

  useEffect(() => {
    updateContentRef.current = updateContent;
  }, [updateContent]);

  useEffect(() => {
    if (textareaRef.current) {
      if (editorRef.current) {
        editorRef.current.destroy();
      }
      editorRef.current = new Editor(textareaRef.current, content => {
        updateContentRef.current(content);
      });
    }

    return () => {
      if (editorRef.current) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, []);

  // Consumer: automatically consume pending operations after content changes
  useEffect(() => {
    if (editorRef.current) {
      setTimeout(() => {
        editorRef.current?.consumePendingOperations();
      }, 0);
    }
  }, [content]);

  return {
    editor: editorRef.current,
  };
};
