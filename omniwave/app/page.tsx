"use client";

import React, { useState, useRef } from "react";
import { Eye, Smile, Pause, Plus, X, ArrowRight } from "lucide-react";
import { Block } from "@/types/types";

const SpeechPlanningApp = () => {
  const [content, setContent] =
    useState(`Imagine this: You're standing in front of an audience, ready to deliver the speech of your life. You've practiced your words, rehearsed every line—but there's a disconnect. Your hands feel awkward, your pauses are off, and you're unsure whether your message is truly landing.

We've all been there public speaking can be terrifying, not because of what we say, but because of how we say it.`);

  const [blocks, setBlocks] = useState<Block[]>([
    {
      id: 1,
      label: "Antic 1",
      position: 357,
      extension:
        '"Actually, let me show you what that feels like." (demonstrate an awkward speaker and dance a little)',
    },
    {
      id: 2,
      label: "Exaggerate for humor",
      position: 420,
      extension:
        "\"See, this is exactly what I mean. It's not the words—it's how we say them.\"",
    },
    {
      id: 3,
      label: "Full audience scan",
      position: 465,
      extension:
        "Make eye contact with different sections of the audience, hold for 2-3 seconds each",
    },
    {
      id: 4,
      label: "Pause (2 s)",
      position: 580,
      extension:
        "Let the weight of the statement sink in. Count: one-Mississippi, two-Mississippi",
    },
  ]);

  const [selectedBlock, setSelectedBlock] = useState<number | null>(null);
  const [showBlockForm, setShowBlockForm] = useState(false);
  const [newBlockLabel, setNewBlockLabel] = useState("");
  const [newBlockExtension, setNewBlockExtension] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertIcon = (iconType: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const beforeCursor = content.substring(0, start);
    const afterCursor = content.substring(end);

    let iconText = "";
    switch (iconType) {
      case "smile":
        iconText = "😄";
        break;
      case "eye":
        iconText = "👁️";
        break;
      case "pause":
        iconText = "⏸️";
        break;
    }

    const newContent = beforeCursor + iconText + afterCursor;
    setContent(newContent);

    // Set cursor position after the icon
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + iconText.length,
        start + iconText.length
      );
    }, 0);
  };

  const insertBlock = () => {
    const textarea = textareaRef.current;
    if (!textarea || !newBlockLabel) return;

    const position = textarea.selectionStart;
    const newBlock = {
      id: Date.now(),
      label: newBlockLabel,
      position: position,
      extension: newBlockExtension,
    };

    setBlocks([...blocks, newBlock]);
    setNewBlockLabel("");
    setNewBlockExtension("");
    setShowBlockForm(false);

    // Insert a marker in the text
    const beforeCursor = content.substring(0, position);
    const afterCursor = content.substring(position);
    const marker = `[${newBlockLabel}]`;
    setContent(beforeCursor + marker + afterCursor);
  };

  const deleteBlock = (blockId: number) => {
    setBlocks(blocks.filter((block) => block.id !== blockId));
    setSelectedBlock(null);
  };

  const formatTextWithBlocks = () => {
    let formattedContent = content;
    const sortedBlocks = [...blocks].sort((a, b) => b.position - a.position);

    sortedBlocks.forEach((block) => {
      const marker = `[${block.label}]`;
      if (formattedContent.includes(marker)) {
        formattedContent = formattedContent.replace(
          marker,
          `<span class="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium cursor-pointer hover:bg-blue-200" data-block-id="${block.id}">${block.label}</span>`
        );
      }
    });

    return { __html: formattedContent };
  };

  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Main Editor */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="bg-white border-b p-4 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-100 rounded">
              <strong>B</strong>
            </button>
            <button className="p-2 hover:bg-gray-100 rounded">
              <em>I</em>
            </button>
            <button className="p-2 hover:bg-gray-100 rounded">
              <u>U</u>
            </button>
          </div>

          <div className="h-6 w-px bg-gray-300"></div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => insertIcon("smile")}
              className="p-2 hover:bg-gray-100 rounded flex items-center gap-1"
              title="Insert humor cue"
            >
              <Smile size={16} />
              <span className="text-sm">Humor</span>
            </button>
            <button
              onClick={() => insertIcon("eye")}
              className="p-2 hover:bg-gray-100 rounded flex items-center gap-1"
              title="Insert eye contact cue"
            >
              <Eye size={16} />
              <span className="text-sm">Eye Contact</span>
            </button>
            <button
              onClick={() => insertIcon("pause")}
              className="p-2 hover:bg-gray-100 rounded flex items-center gap-1"
              title="Insert pause cue"
            >
              <Pause size={16} />
              <span className="text-sm">Pause</span>
            </button>
          </div>

          <div className="h-6 w-px bg-gray-300"></div>

          <button
            onClick={() => setShowBlockForm(true)}
            className="p-2 hover:bg-gray-100 rounded flex items-center gap-1 bg-blue-50 text-blue-700"
          >
            <Plus size={16} />
            <span className="text-sm">Add Block</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-full p-4 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg leading-relaxed"
            placeholder="Start writing your speech..."
          />
        </div>

        {/* Block Creation Form */}
        {showBlockForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-96">
              <h3 className="text-lg font-semibold mb-4">Create New Block</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Block Label
                  </label>
                  <input
                    type="text"
                    value={newBlockLabel}
                    onChange={(e) => setNewBlockLabel(e.target.value)}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Exaggerate for humor"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Extension Notes
                  </label>
                  <textarea
                    value={newBlockExtension}
                    onChange={(e) => setNewBlockExtension(e.target.value)}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
                    placeholder="Detailed notes for delivery..."
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => setShowBlockForm(false)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={insertBlock}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Create Block
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Side Panel */}
      <div className="w-80 bg-white border-l flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Performance Notes</h2>
          <p className="text-sm text-gray-600">
            Click on blocks to view details
          </p>
        </div>

        <div className="flex-1 overflow-y-auto">
          {blocks.map((block) => (
            <div
              key={block.id}
              className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                selectedBlock === block.id
                  ? "bg-blue-50 border-l-4 border-l-blue-500"
                  : ""
              }`}
              onClick={() =>
                setSelectedBlock(selectedBlock === block.id ? null : block.id)
              }
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">
                    {block.label}
                  </span>
                  <ArrowRight size={14} className="text-gray-400" />
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteBlock(block.id);
                  }}
                  className="text-gray-400 hover:text-red-500"
                >
                  <X size={16} />
                </button>
              </div>

              {selectedBlock === block.id && (
                <div className="mt-2 p-3 bg-gray-50 rounded text-sm">
                  <p className="text-gray-700">{block.extension}</p>
                </div>
              )}
            </div>
          ))}

          {blocks.length === 0 && (
            <div className="p-4 text-center text-gray-500">
              <p>No performance blocks yet.</p>
              <p className="text-sm mt-1">
                Add blocks to organize your speech delivery notes.
              </p>
            </div>
          )}
        </div>

        {/* AI Suggestions Footer */}
        {/* <div className="p-4 bg-gray-50 border-t">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
              AI
            </div>
            <span>AI suggestive features</span>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default SpeechPlanningApp;
