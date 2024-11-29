




// import React, { useState } from 'react';
// import { Editor } from '@monaco-editor/react';
// import { Loader2 } from 'lucide-react';

// const CodeEditor = () => {
//   const [prompt, setPrompt] = useState('');
//   const [code, setCode] = useState('');
//   const [output, setOutput] = useState('');
//   const [loading, setLoading] = useState(false);

//   const fetchCode = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch('http://localhost:5000/api/v1/generate-code', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ prompt }),
//       });
//       const data = await response.json();
//       setCode(data.code);
//     } catch (error) {
//       setOutput('Error fetching code: ' + error.message);
//     }
//     setLoading(false);
//   };

//   const runCode = () => {
//     try {
//       // Create a new function from the code string
//       const func = new Function(code);
//       const consoleLog = console.log;
//       let output = '';
      
//       // Override console.log to capture output
//       console.log = (...args) => {
//         output += args.join(' ') + '\n';
//       };
      
//       // Execute the code
//       func();
      
//       // Restore console.log
//       console.log = consoleLog;
      
//       setOutput(output || 'Code executed successfully but produced no output');
//     } catch (error) {
//       setOutput('Error executing code: ' + error.message);
//     }
//   };

//   return (
//     <div className="h-screen flex flex-col">
//       {/* Top Bar */}
//       <div className="p-4 bg-gray-100 border-b flex items-center gap-4">
//         <button 
//           onClick={fetchCode}
//           disabled={loading}
//           className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2"
//         >
//           {loading && <Loader2 className="w-4 h-4 animate-spin" />}
//           Generate Code
//         </button>
//         <button 
//           onClick={runCode}
//           className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
//         >
//           Run Code
//         </button>
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 flex">
//         {/* Left Panel */}
//         <div className="w-1/2 flex flex-col border-r">
//           {/* Prompt Input */}
//           <div className="h-1/3 p-4 border-b">
//             <p className="font-medium mb-2">Prompt</p>
//             <textarea
//               value={prompt}
//               onChange={(e) => setPrompt(e.target.value)}
//               className="w-full h-full p-2 border rounded resize-none"
//               placeholder="Enter your prompt here..."
//             />
//           </div>
          
//           {/* Code Editor */}
//           <div className="flex-1">
//             <p className="font-medium p-4 pb-2">Generated Code</p>
//             <Editor
//               height="100%"
//               defaultLanguage="javascript"
//               value={code}
//               onChange={(value) => setCode(value || '')}
//               options={{
//                 minimap: { enabled: false },
//                 fontSize: 14,
//                 scrollBeyondLastLine: false,
//               }}
//             />
//           </div>
//         </div>

//         {/* Right Panel - Output */}
//         <div className="w-1/2 flex flex-col">
//           <p className="font-medium p-4 pb-2">Output</p>
//           <div className="flex-1 bg-gray-100 p-4 font-mono whitespace-pre-wrap overflow-auto">
//             {output}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CodeEditor;















import React, { useState } from 'react';
import { Editor } from '@monaco-editor/react';
import { Loader2, Play, Code2, Terminal, FileCode2 } from 'lucide-react';

const CodeEditor = () => {
  const [prompt, setPrompt] = useState('');
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('editor');

  const fetchCode = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/v1/generate-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await response.json();
      setCode(data.code);
      setActiveTab('editor');
    } catch (error) {
      setOutput('Error fetching code: ' + error.message);
    }
    setLoading(false);
  };

  const runCode = () => {
    try {
      const func = new Function(code);
      const consoleLog = console.log;
      let output = '';
      
      console.log = (...args) => {
        output += args.join(' ') + '\n';
      };
      
      func();
      console.log = consoleLog;
      
      setOutput(output || 'Code executed successfully but produced no output');
      setActiveTab('output');
    } catch (error) {
      setOutput('Error executing code: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Top Section */}
        <div className="p-4 border-b space-y-4">
          {/* Prompt Input */}
          <div className="w-full">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full p-3 border rounded-lg resize-none h-24 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="Enter your prompt here..."
            />
          </div>
          
          {/* Buttons */}
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
              onClick={runCode}
              className="flex-1 sm:flex-none px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4" />
              Run Code
            </button>
          </div>
        </div>

        {/* Mobile Tabs */}
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
              <Terminal className="w-4 h-4" />
              Output
            </button>
          </div>
          
          {/* Mobile Content */}
          <div className="h-[400px]">
            {activeTab === 'editor' ? (
              <Editor
                height="100%"
                defaultLanguage="javascript"
                value={code}
                onChange={(value) => setCode(value || '')}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  scrollBeyondLastLine: false,
                }}
              />
            ) : (
              <div className="h-full bg-gray-50 p-4 font-mono text-sm whitespace-pre-wrap overflow-auto">
                {output || 'Output will appear here...'}
              </div>
            )}
          </div>
        </div>

        {/* Desktop Split View */}
        <div className="hidden md:flex">
          <div className="w-1/2 border-r h-[600px]">
            <div className="border-b px-4 py-2 flex items-center gap-2 bg-gray-50">
              <FileCode2 className="w-4 h-4 text-gray-600" />
              <span className="font-medium text-gray-700">Code Editor</span>
            </div>
            <Editor
              height="calc(100% - 37px)"
              defaultLanguage="javascript"
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
              <Terminal className="w-4 h-4 text-gray-600" />
              <span className="font-medium text-gray-700">Output</span>
            </div>
            <div className="flex-1 bg-gray-50 p-4 font-mono text-sm whitespace-pre-wrap overflow-auto">
              {output || 'Output will appear here...'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;