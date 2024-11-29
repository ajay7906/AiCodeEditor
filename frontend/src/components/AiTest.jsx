


// import React, { useState, useEffect } from 'react';
// import { Editor } from '@monaco-editor/react';
// import { Loader2, Play, Code2, Terminal, FileCode2, Layout } from 'lucide-react';

// const CodeEditor = () => {
//   const [prompt, setPrompt] = useState('');
//   const [code, setCode] = useState('');
//   const [output, setOutput] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [activeTab, setActiveTab] = useState('editor');
//   const [language, setLanguage] = useState('javascript');
//   const [previewWindow, setPreviewWindow] = useState(null);

//   // Function to create sandbox iframe
//   useEffect(() => {
//     const iframe = document.createElement('iframe');
//     iframe.style.width = '100%';
//     iframe.style.height = '100%';
//     iframe.style.border = 'none';
//     setPreviewWindow(iframe);
//   }, []);

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
//       setActiveTab('editor');
//     } catch (error) {
//       setOutput('Error fetching code: ' + error.message);
//     }
//     setLoading(false);
//   };




















//   // const runCode = () => {
//   //   try {
//   //     if (language === 'javascript') {
//   //       // Run JavaScript code
//   //       const func = new Function(code);
//   //       const consoleLog = console.log;
//   //       let output = '';
        
//   //       console.log = (...args) => {
//   //         output += args.join(' ') + '\n';
//   //       };
        
//   //       func();
//   //       console.log = consoleLog;
        
//   //       setOutput(output || 'Code executed successfully but produced no output');
//   //     } else if (language === 'html') {
//   //       // Run HTML/CSS code in iframe
//   //       if (previewWindow && previewWindow.contentWindow) {
//   //         const combinedCode = `
//   //           <!DOCTYPE html>
//   //           <html>
//   //             <head>
//   //               <style>
//   //                 /* Reset default margins */
//   //                 body { margin: 0; padding: 0; }
//   //               </style>
//   //             </head>
//   //             <body>
//   //               ${code}
//   //             </body>
//   //           </html>
//   //         `;
          
//   //         const outputDiv = document.getElementById('preview-container');
//   //         if (outputDiv && previewWindow.parentNode !== outputDiv) {
//   //           outputDiv.innerHTML = '';
//   //           outputDiv.appendChild(previewWindow);
//   //         }
          
//   //         previewWindow.contentDocument.open();
//   //         previewWindow.contentDocument.write(combinedCode);
//   //         previewWindow.contentDocument.close();
//   //       }
//   //     }
//   //     setActiveTab('output');
//   //   } catch (error) {
//   //     setOutput('Error executing code: ' + error.message);
//   //   }
//   // };

//   const runCode = () => {
//     try {
//       if (language === 'javascript') {
//         // Existing JavaScript execution logic
//         const func = new Function(code);
//         const consoleLog = console.log;
//         let output = '';
        
//         console.log = (...args) => {
//           output += args.join(' ') + '\n';
//         };
        
//         func();
//         console.log = consoleLog;
        
//         setOutput(output || 'Code executed successfully but produced no output');
//       } else if (language === 'html') {
//         const outputDiv = document.getElementById('preview-container');
//         if (outputDiv) {
//           // Clear previous content
//           outputDiv.innerHTML = '';
          
//           // Create iframe
//           const iframe = document.createElement('iframe');
//           iframe.style.width = '100%';
//           iframe.style.height = '100%';
//           iframe.style.border = 'none';
          
//           outputDiv.appendChild(iframe);
          
//           // Get iframe document
//           const doc = iframe.contentDocument || iframe.contentWindow.document;
          
//           // Write complete HTML document
//           doc.open();
//           doc.write(code);
//           doc.close();
//         }
//       }
//       setActiveTab('output');
//     } catch (error) {
//       setOutput('Error executing code: ' + error.message);
//     }
//   };































//   return (
//     <div className="min-h-screen bg-gray-50 p-4">
//       <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
//         {/* Top Section */}
//         <div className="p-4 border-b space-y-4">
//           {/* Language Selector */}
//           <div className="flex gap-2 mb-4">
//             <select
//               value={language}
//               onChange={(e) => setLanguage(e.target.value)}
//               className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//             >
//               <option value="javascript">JavaScript</option>
//               <option value="html">HTML/CSS</option>
//             </select>
//           </div>

//           {/* Prompt Input */}
//           <div className="w-full">
//             <textarea
//               value={prompt}
//               onChange={(e) => setPrompt(e.target.value)}
//               className="w-full p-3 border rounded-lg resize-none h-24 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
//               placeholder="Enter your prompt here..."
//             />
//           </div>
          
//           {/* Buttons */}
//           <div className="flex flex-col sm:flex-row gap-2">
//             <button
//               onClick={fetchCode}
//               disabled={loading}
//               className="flex-1 sm:flex-none px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
//             >
//               {loading ? (
//                 <Loader2 className="w-4 h-4 animate-spin" />
//               ) : (
//                 <Code2 className="w-4 h-4" />
//               )}
//               Generate Code
//             </button>
//             <button
//               onClick={runCode}
//               className="flex-1 sm:flex-none px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
//             >
//               {language === 'html' ? (
//                 <Layout className="w-4 h-4" />
//               ) : (
//                 <Play className="w-4 h-4" />
//               )}
//               {language === 'html' ? 'Preview' : 'Run Code'}
//             </button>
//           </div>
//         </div>

//         {/* Mobile Tabs */}
//         <div className="md:hidden">
//           <div className="flex border-b">
//             <button
//               onClick={() => setActiveTab('editor')}
//               className={`flex-1 px-4 py-2 flex items-center justify-center gap-2 ${
//                 activeTab === 'editor'
//                   ? 'border-b-2 border-blue-500 text-blue-500'
//                   : 'text-gray-600'
//               }`}
//             >
//               <FileCode2 className="w-4 h-4" />
//               Editor
//             </button>
//             <button
//               onClick={() => setActiveTab('output')}
//               className={`flex-1 px-4 py-2 flex items-center justify-center gap-2 ${
//                 activeTab === 'output'
//                   ? 'border-b-2 border-blue-500 text-blue-500'
//                   : 'text-gray-600'
//               }`}
//             >
//               {language === 'html' ? (
//                 <Layout className="w-4 h-4" />
//               ) : (
//                 <Terminal className="w-4 h-4" />
//               )}
//               {language === 'html' ? 'Preview' : 'Output'}
//             </button>
//           </div>
          
//           {/* Mobile Content */}
//           <div className="h-[400px]">
//             {activeTab === 'editor' ? (
//               <Editor
//                 height="100%"
//                 defaultLanguage="javascript"
//                 language={language}
//                 value={code}
//                 onChange={(value) => setCode(value || '')}
//                 options={{
//                   minimap: { enabled: false },
//                   fontSize: 14,
//                   scrollBeyondLastLine: false,
//                 }}
//               />
//             ) : (
//               language === 'html' ? (
//                 <div id="preview-container" className="h-full bg-white" />
//               ) : (
//                 <div className="h-full bg-gray-50 p-4 font-mono text-sm whitespace-pre-wrap overflow-auto">
//                   {output || 'Output will appear here...'}
//                 </div>
//               )
//             )}
//           </div>
//         </div>

//         {/* Desktop Split View */}
//         <div className="hidden md:flex">
//           <div className="w-1/2 border-r h-[600px]">
//             <div className="border-b px-4 py-2 flex items-center gap-2 bg-gray-50">
//               <FileCode2 className="w-4 h-4 text-gray-600" />
//               <span className="font-medium text-gray-700">Code Editor</span>
//             </div>
//             <Editor
//               height="calc(100% - 37px)"
//               defaultLanguage="javascript"
//               language={language}
//               value={code}
//               onChange={(value) => setCode(value || '')}
//               options={{
//                 minimap: { enabled: false },
//                 fontSize: 14,
//                 scrollBeyondLastLine: false,
//               }}
//             />
//           </div>
//           <div className="w-1/2 h-[600px] flex flex-col">
//             <div className="border-b px-4 py-2 flex items-center gap-2 bg-gray-50">
//               {language === 'html' ? (
//                 <Layout className="w-4 h-4 text-gray-600" />
//               ) : (
//                 <Terminal className="w-4 h-4 text-gray-600" />
//               )}
//               <span className="font-medium text-gray-700">
//                 {language === 'html' ? 'Preview' : 'Output'}
//               </span>
//             </div>
//             {language === 'html' ? (
//               <div id="preview-container" className="flex-1 bg-white" />
//             ) : (
//               <div className="flex-1 bg-gray-50 p-4 font-mono text-sm whitespace-pre-wrap overflow-auto">
//                 {output || 'Output will appear here...'}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CodeEditor;














































































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

  const runCode = () => {
    try {
      if (language === 'javascript') {
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
        if (desktopIframeRef.current) {
          renderHTMLInIframe(desktopIframeRef.current);
        }
        if (mobileIframeRef.current) {
          renderHTMLInIframe(mobileIframeRef.current);
        }
      }
      setActiveTab('output');
    } catch (error) {
      setOutput('Error executing code: ' + error.message);
    }
  };

  useEffect(() => {
    if (language === 'html' && code) {
      if (desktopIframeRef.current) {
        renderHTMLInIframe(desktopIframeRef.current);
      }
      if (mobileIframeRef.current) {
        renderHTMLInIframe(mobileIframeRef.current);
      }
    }
  }, [code, language]);

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
              onClick={runCode}
              className="flex-1 sm:flex-none px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
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
              language={language}
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
                language={language}
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