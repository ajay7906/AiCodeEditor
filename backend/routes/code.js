







const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const router = express.Router();
require('dotenv').config();
// Initialize AI client
const genAI = new GoogleGenerativeAI(process.env.openAiKey);

router.post('/generate-code', async (req, res) => {
    const { prompt } = req.body;
    
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(prompt);
        
        // Extract code and sanitize it
        let code = result.response.text();
        code = sanitizeCode(code);
        
        res.json({ code });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Function to sanitize and format the code
function sanitizeCode(code) {
    // Remove code block markers (```javascript, ```js, ```, etc.)
    code = code.replace(/```[\w]*\n?/g, '');
    
    // Handle potential code block ending markers
    code = code.replace(/```\s*$/g, '');
    
    // Preserve newlines but remove any excessive blank lines
    code = code
        .split('\n')
        .map(line => line.trimRight()) // Remove trailing spaces
        .reduce((lines, line) => {
            // If we have more than 2 blank lines in a row, skip this one
            if (line === '' && lines.length > 0 && lines[lines.length - 1] === '' && 
                (lines.length > 1 && lines[lines.length - 2] === '')) {
                return lines;
            }
            lines.push(line);
            return lines;
        }, [])
        .join('\n');
    
    // Ensure code starts and ends cleanly
    code = code.trim() + '\n';
    
    return code;
}

// Helper function to check if a line is a comment
function isComment(line) {
    return line.trim().startsWith('//') || 
           line.trim().startsWith('/*') || 
           line.trim().startsWith('*');
}

module.exports = router;