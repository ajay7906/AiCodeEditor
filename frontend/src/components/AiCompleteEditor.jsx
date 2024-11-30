import React, { useState, useRef, useEffect } from 'react';
import { Editor } from '@monaco-editor/react';
import { Loader2, Play, Code2, Terminal, FileCode2, Layout } from 'lucide-react';

const CodeEditor = () => {
  const [prompt, setPrompt] = useState('');
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('editor');
  const [language, setLanguage] = useState('html');
  const desktopIframeRef = useRef(null);
  const mobileIframeRef = useRef(null);

  const fetchCode = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/v1/generate-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, language }),
      });
      const data = await response.json();
      setCode(data.code);
      setActiveTab('editor');
    } catch (error) {
      setOutput('Error fetching code: ' + error.message);
    }
    setLoading(false);
  };

  const executeCode = async () => {
    setLoading(true);
    try {
      if (language === 'javascript') {
        // Execute JavaScript in browser
        const func = new Function(code);
        const consoleLog = console.log;
        let output = '';
        console.log = (...args) => {
          output += args.join(' ') + '\n';
        };
        func();
        console.log = consoleLog;
        setOutput(output || 'Code executed successfully but produced no output');
      } else if (language === 'html') {
        // Render HTML in iframes
        if (desktopIframeRef.current) renderHTMLInIframe(desktopIframeRef.current);
        if (mobileIframeRef.current) renderHTMLInIframe(mobileIframeRef.current);
      } else {
        // Execute other languages on the server
        const response = await fetch('http://localhost:5000/api/v1/execute-code', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code, language }),
        });
        const data = await response.json();
        setOutput(data.output || 'Code executed successfully but produced no output');
      }
      setActiveTab('output');
    } catch (error) {
      setOutput('Error executing code: ' + error.message);
    }
    setLoading(false);
  };

  const renderHTMLInIframe = (iframe) => {
    if (iframe) {
      const doc = iframe.contentDocument || iframe.contentWindow.document;
      const sanitizedCode = code.replace(/<script>/g, '<script nonce="safe-inline">');
      const fullDocument = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { margin: 0; padding: 10px; font-family: Arial, sans-serif; }
          </style>
        </head>
        <body>
          ${sanitizedCode}
        </body>
        </html>
      `;
      doc.open();
      doc.write(fullDocument);
      doc.close();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-4 border-b space-y-4">
          <div className="flex gap-2 mb-4">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="html">HTML/CSS</option>
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
            </select>
          </div>

          <div className="w-full">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full p-3 border rounded-lg resize-none h-24 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="Enter your prompt here..."
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={fetchCode}
              disabled={loading}
              className="flex-1 sm:flex-none px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Code2 className="w-4 h-4" />
              )}
              Generate Code
            </button>
            <button
              onClick={executeCode}
              disabled={loading}
              className="flex-1 sm:flex-none px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {language === 'html' ? (
                <Layout className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
              {language === 'html' ? 'Preview' : 'Run Code'}
            </button>
          </div>
        </div>

        <div className="hidden md:flex">
          <div className="w-1/2 border-r h-[600px]">
            <div className="border-b px-4 py-2 flex items-center gap-2 bg-gray-50">
              <FileCode2 className="w-4 h-4 text-gray-600" />
              <span className="font-medium text-gray-700">Code Editor</span>
            </div>
            <Editor
              height="calc(100% - 37px)"
              defaultLanguage="html"
              language={language === 'cpp' ? 'cpp' : language}
              value={code}
              onChange={(value) => setCode(value || '')}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                scrollBeyondLastLine: false,
              }}
            />
          </div>
          <div className="w-1/2 h-[600px] flex flex-col">
            <div className="border-b px-4 py-2 flex items-center gap-2 bg-gray-50">
              {language === 'html' ? (
                <Layout className="w-4 h-4 text-gray-600" />
              ) : (
                <Terminal className="w-4 h-4 text-gray-600" />
              )}
              <span className="font-medium text-gray-700">
                {language === 'html' ? 'Preview' : 'Output'}
              </span>
            </div>
            {language === 'html' ? (
              <iframe 
                ref={desktopIframeRef}
                title="HTML Desktop Preview"
                className="flex-1 w-full border-none bg-white"
                sandbox="allow-scripts allow-same-origin"
              />
            ) : (
              <div className="flex-1 bg-gray-50 p-4 font-mono text-sm whitespace-pre-wrap overflow-auto">
                {output || 'Output will appear here...'}
              </div>
            )}
          </div>
        </div>

        <div className="md:hidden">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('editor')}
              className={`flex-1 px-4 py-2 flex items-center justify-center gap-2 ${
                activeTab === 'editor'
                  ? 'border-b-2 border-blue-500 text-blue-500'
                  : 'text-gray-600'
              }`}
            >
              <FileCode2 className="w-4 h-4" />
              Editor
            </button>
            <button
              onClick={() => setActiveTab('output')}
              className={`flex-1 px-4 py-2 flex items-center justify-center gap-2 ${
                activeTab === 'output'
                  ? 'border-b-2 border-blue-500 text-blue-500'
                  : 'text-gray-600'
              }`}
            >
              {language === 'html' ? (
                <Layout className="w-4 h-4" />
              ) : (
                <Terminal className="w-4 h-4" />
              )}
              {language === 'html' ? 'Preview' : 'Output'}
            </button>
          </div>
          
          <div className="h-[400px]">
            {activeTab === 'editor' ? (
              <Editor
                height="100%"
                defaultLanguage="html"
                language={language === 'cpp' ? 'cpp' : language}
                value={code}
                onChange={(value) => setCode(value || '')}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  scrollBeyondLastLine: false,
                }}
              />
            ) : (
              language === 'html' ? (
                <iframe 
                  ref={mobileIframeRef}
                  title="HTML Mobile Preview"
                  className="w-full h-full border-none bg-white"
                  sandbox="allow-scripts allow-same-origin"
                />
              ) : (
                <div className="h-full bg-gray-50 p-4 font-mono text-sm whitespace-pre-wrap overflow-auto">
                  {output || 'Output will appear here...'}
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;