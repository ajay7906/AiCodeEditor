const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());
app.use(express.json());

const TEMP_DIR = path.join(__dirname, 'temp');

// Create temp directory if it doesn't exist
(async () => {
  try {
    await fs.mkdir(TEMP_DIR);
  } catch (err) {
    if (err.code !== 'EEXIST') throw err;
  }
})();

// Function to clean up temporary files
const cleanup = async (filePath) => {
  try {
    await fs.unlink(filePath);
  } catch (err) {
    console.error('Cleanup error:', err);
  }
};

// Execute code with timeout
const executeWithTimeout = (command, timeout = 10000) => {
  return new Promise((resolve, reject) => {
    const process = exec(command, { timeout }, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve(stdout || stderr);
      }
    });
  });
};

app.post('/api/v1/execute-code', async (req, res) => {
  const { code, language } = req.body;
  const fileId = uuidv4();
  let filePath;
  let command;

  try {
    switch (language) {
      case 'python':
        filePath = path.join(TEMP_DIR, `${fileId}.py`);
        await fs.writeFile(filePath, code);
        command = `python "${filePath}"`;
        break;

      case 'java':
        // Extract class name from code
        const className = code.match(/public\s+class\s+(\w+)/)?.[1] || 'Main';
        filePath = path.join(TEMP_DIR, `${className}.java`);
        await fs.writeFile(filePath, code);
        await executeWithTimeout(`javac "${filePath}"`);
        command = `java -cp "${TEMP_DIR}" ${className}`;
        break;

      case 'cpp':
        filePath = path.join(TEMP_DIR, `${fileId}.cpp`);
        const outputPath = path.join(TEMP_DIR, `${fileId}.exe`);
        await fs.writeFile(filePath, code);
        await executeWithTimeout(`g++ "${filePath}" -o "${outputPath}"`);
        command = `"${outputPath}"`;
        break;

      default:
        return res.status(400).json({ error: 'Unsupported language' });
    }

    const output = await executeWithTimeout(command);
    res.json({ output });

  } catch (error) {
    res.json({ output: `Error: ${error.message}` });
  } finally {
    if (filePath) {
      cleanup(filePath);
    }
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});