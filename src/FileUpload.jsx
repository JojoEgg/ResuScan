import React, { useRef } from 'react';
import * as pdfjslib from 'pdfjs-dist';
import mammoth from 'mammoth';

pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

const FileUpload = ({ onFileSelect }) => {
  const fileInputRef = useRef(null);

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const extractTextFromPDF = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    let text = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const strings = content.items.map((item) => item.str).join(' ');
      text += strings + '\n';
    }

    return text;
  };

  const extractTextFromDocx = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    let text = '';

    try {
      if (file.name.endsWith('.txt')) {
        const reader = new FileReader();
        reader.onload = (e) => onFileSelect(e.target.result);
        reader.readAsText(file);
        return;
      } else if (file.name.endsWith('.pdf')) {
        text = await extractTextFromPDF(file);
      } else if (file.name.endsWith('.docx')) {
        text = await extractTextFromDocx(file);
      } else {
        alert('Unsupported file type. Only .txt, .pdf, and .docx are supported.');
        return;
      }

      onFileSelect(text);
    } catch (error) {
      console.error('Error reading file:', error);
      alert('An error occurred while reading the file.');
    }
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf,.docx,.txt"
        style={{ display: 'none' }}
      />
      <button className="highlight-button" onClick={handleClick}>
        Upload Resume
      </button>
    </>
  );
};

export default FileUpload;