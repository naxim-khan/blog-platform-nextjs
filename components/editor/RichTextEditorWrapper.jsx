"use client";
import dynamic from "next/dynamic";
import { Loader } from "lucide-react";

const RichTextEditorImpl = dynamic(() => import("./RichTextEditorImpl"), {
  ssr: false,
  loading: () => (
    <div className="border border-gray-300 rounded-lg bg-white overflow-hidden shadow-sm">
      <div className="flex flex-wrap items-center gap-1 p-3 border-b border-gray-200 bg-gray-50 rounded-t-lg">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-8 w-8 bg-gray-200 rounded-md animate-pulse"
          ></div>
        ))}
      </div>
      <div className="p-4 min-h-[300px] bg-gray-50 rounded-b-lg flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-6 w-6 animate-spin text-blue-600 mx-auto mb-2" />
          <p className="text-gray-500 text-sm">Loading editor...</p>
        </div>
      </div>
    </div>
  ),
});

export default function RichTextEditorWrapper(props) {
  return <RichTextEditorImpl {...props} />;
}
