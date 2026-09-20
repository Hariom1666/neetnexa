'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function AdminPage() {
  // Single question form state
  const [chapterName, setChapterName] = useState('Physics and Measurement');
  const [questionText, setQuestionText] = useState('');
  const [optionA, setOptionA] = useState('');
  const [optionB, setOptionB] = useState('');
  const [optionC, setOptionC] = useState('');
  const [optionD, setOptionD] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [singleStatus, setSingleStatus] = useState('');

  // Bulk JSON uploader state
  const [bulkJson, setBulkJson] = useState('');
  const [bulkStatus, setBulkStatus] = useState('');

  // Handle single question upload
  const handleSingleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSingleStatus('Uploading...');

    const { error } = await supabase.from('questions').insert([
      {
        chapter_name: chapterName,
        question_text: questionText,
        option_a: optionA,
        option_b: optionB,
        option_c: optionC,
        option_d: optionD,
        correct_answer: correctAnswer,
      },
    ]);

    if (error) {
      setSingleStatus(`Error: ${error.message}`);
    } else {
      setSingleStatus('Question uploaded successfully!');
      setQuestionText('');
      setOptionA('');
      setOptionB('');
      setOptionC('');
      setOptionD('');
      setCorrectAnswer('');
    }
  };

  // Handle bulk JSON upload
  const handleBulkSubmit = async () => {
    setBulkStatus('Parsing and uploading...');
    try {
      const parsedData = JSON.parse(bulkJson);
      if (!Array.isArray(parsedData)) {
        setBulkStatus('Error: JSON must be an array of objects ([...])');
        return;
      }

      const { error } = await supabase.from('questions').insert(parsedData);

      if (error) {
        setBulkStatus(`Error: ${error.message}`);
      } else {
        setBulkStatus(`Successfully uploaded ${parsedData.length} questions!`);
        setBulkJson('');
      }
    } catch (err: any) {
      setBulkStatus(`Invalid JSON format: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 md:p-12">
      <div className="max-w-2xl mx-auto space-y-12">
        <header className="border-b border-gray-800 pb-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-400">Admin Question Uploader</h1>
          <a href="/" className="text-sm text-gray-400 hover:text-white">← Back to Home</a>
        </header>

        {/* BULK JSON UPLOADER SECTION */}
        <section className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
          <h2 className="text-lg font-bold mb-2 text-yellow-400">⚡ Bulk Upload Questions (JSON)</h2>
          <p className="text-xs text-gray-400 mb-4">
            Paste an array of questions below to upload dozens at once.
          </p>
          <textarea
            rows={8}
            value={bulkJson}
            onChange={(e) => setBulkJson(e.target.value)}
            placeholder={`[\n  {\n    \"chapter_name\": \"Work, Energy and Power\",\n    \"question_text\": \"What is work?\",\n    \"option_a\": \"Force x Displacement\",\n    \"option_b\": \"Mass x Acceleration\",\n    \"option_c\": \"Velocity / Time\",\n    \"option_d\": \"None\",\n    \"correct_answer\": \"Force x Displacement\"\n  }\n]`}
            className="w-full p-3 bg-gray-900 border border-gray-700 rounded text-xs font-mono mb-4 focus:outline-none focus:border-yellow-500 text-gray-200"
          />
          <button
            onClick={handleBulkSubmit}
            className="w-full py-3 bg-green-600 font-bold rounded hover:bg-green-500 transition text-sm"
          >
            Upload All Questions
          </button>
          {bulkStatus && <p className="mt-3 text-sm font-medium text-center">{bulkStatus}</p>}
        </section>

        {/* SINGLE QUESTION FORM SECTION */}
        <section className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
          <h2 className="text-lg font-bold mb-4 text-blue-400">Add a Single Question</h2>
          <form onSubmit={handleSingleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium mb-1">Chapter Name</label>
              <input
                type="text"
                value={chapterName}
                onChange={(e) => setChapterName(e.target.value)}
                className="w-full p-2 bg-gray-900 border border-gray-700 rounded text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Question Text</label>
              <textarea
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                className="w-full p-2 bg-gray-900 border border-gray-700 rounded text-sm"
                rows={3}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium mb-1">Option A</label>
                <input
                  type="text"
                  value={optionA}
                  onChange={(e) => setOptionA(e.target.value)}
                  className="w-full p-2 bg-gray-900 border border-gray-700 rounded text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Option B</label>
                <input
                  type="text"
                  value={optionB}
                  onChange={(e) => setOptionB(e.target.value)}
                  className="w-full p-2 bg-gray-900 border border-gray-700 rounded text-sm"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium mb-1">Option C</label>
                <input
                  type="text"
                  value={optionC}
                  onChange={(e) => setOptionC(e.target.value)}
                  className="w-full p-2 bg-gray-900 border border-gray-700 rounded text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Option D</label>
                <input
                  type="text"
                  value={optionD}
                  onChange={(e) => setOptionD(e.target.value)}
                  className="w-full p-2 bg-gray-900 border border-gray-700 rounded text-sm"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Correct Answer (Must match exact text)</label>
              <input
                type="text"
                value={correctAnswer}
                onChange={(e) => setCorrectAnswer(e.target.value)}
                className="w-full p-2 bg-gray-900 border border-gray-700 rounded text-sm"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 font-bold rounded hover:bg-blue-500 transition text-sm"
            >
              Upload Single Question
            </button>
            {singleStatus && <p className="mt-2 text-sm font-medium text-center">{singleStatus}</p>}
          </form>
        </section>
      </div>
    </div>
  );
}