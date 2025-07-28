// import fs from 'fs';
// import path from 'path';
// import { createRequire } from 'module';
// const require = createRequire(import.meta.url);
// const pdfjsLib = require('pdfjs-dist');

// pdfjsLib.GlobalWorkerOptions.workerSrc = require.resolve('pdfjs-dist/build/pdf.worker.min.js');

// export function extractRelevantSections(text, persona, job) {
//   const keywords = [...new Set([...job.toLowerCase().split(/\s+/), ...persona.toLowerCase().split(/\s+/)])];
  
//   const lines = text.split('\n');
//   const scoredLines = lines.map((line, index) => ({
//     line,
//     score: keywords.reduce((count, word) => line.toLowerCase().includes(word) ? count + 1 : count, 0),
//     index
//   }));

//   return scoredLines
//     .filter(item => item.score > 0)
//     .sort((a, b) => b.score - a.score || a.index - b.index)
//     .slice(0, 5)
//     .map((item, i) => ({
//       extractedSections: {
//         document: '',
//         section_title: item.line.slice(0, 80).trim() || `Section ${i+1}`,
//         importance_rank: i + 1,
//         page_number: 1
//       },
//       subsectionAnalysis: {
//         document: '',
//         refined_text: item.line.trim(),
//         page_number: 1
//       }
//     }))
//     .reduce((acc, curr) => ({
//       extractedSections: [...acc.extractedSections, curr.extractedSections],
//       subsectionAnalysis: [...acc.subsectionAnalysis, curr.subsectionAnalysis]
//     }), { extractedSections: [], subsectionAnalysis: [] });
// }

// export async function processCollection(collectionPath) {
//   try {
//     const inputPath = path.join(collectionPath, 'challenge1b_input.json');
//     const pdfDir = path.join(collectionPath, 'PDFs');
//     const outputPath = path.join('/app/output', 'challenge1b_output.json');

//     // Verify input files exist
//     if (!fs.existsSync(inputPath)) {
//       throw new Error(`Input file not found at ${inputPath}`);
//     }
//     if (!fs.existsSync(pdfDir)) {
//       throw new Error(`PDF directory not found at ${pdfDir}`);
//     }

//     const input = JSON.parse(fs.readFileSync(inputPath, 'utf-8'));
//     const { role: persona, focus_areas: focusAreas = [] } = input.persona;
//     const { task: job, context: jobContext = '' } = input.job_to_be_done;
//     const documents = input.documents || [];

//     let results = [];
//     for (const doc of documents) {
//       try {
//         const pdfPath = path.join(pdfDir, doc.filename);
//         if (!fs.existsSync(pdfPath)) {
//           console.warn(`PDF not found: ${pdfPath}`);
//           continue;
//         }

//         const data = new Uint8Array(fs.readFileSync(pdfPath));
//         const pdf = await pdfjsLib.getDocument(data).promise;
//         let fullText = '';
        
//         for (let i = 1; i <= pdf.numPages; i++) {
//           const page = await pdf.getPage(i);
//           const textContent = await page.getTextContent();
//           fullText += textContent.items.map(item => item.str).join(' ') + '\n';
//         }

//         const { extractedSections, subsectionAnalysis } = extractRelevantSections(
//           fullText,
//           `${persona} ${focusAreas.join(' ')}`,
//           `${job} ${jobContext}`
//         );

//         extractedSections.forEach(s => s.document = doc.filename);
//         subsectionAnalysis.forEach(s => s.document = doc.filename);
        
//         results.push({ extractedSections, subsectionAnalysis });
//       } catch (err) {
//         console.error(`Error processing ${doc.filename}:`, err.message);
//       }
//     }

//     const output = {
//       metadata: {
//         input_documents: documents.map(d => d.filename),
//         persona: { role: persona, focus_areas: focusAreas },
//         job_to_be_done: { task: job, context: jobContext },
//         processing_timestamp: new Date().toISOString()
//       },
//       extracted_sections: results.flatMap(r => r.extractedSections),
//       subsection_analysis: results.flatMap(r => r.subsectionAnalysis)
//     };

//     fs.mkdirSync(path.dirname(outputPath), { recursive: true });
//     fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
//     console.log(`✅ Output written to ${outputPath}`);
//   } catch (err) {
//     console.error('❌ Processing failed:', err.message);
//     throw err;
//   }
// }


import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfjsLib = require('pdfjs-dist');

pdfjsLib.GlobalWorkerOptions.workerSrc = require.resolve('pdfjs-dist/build/pdf.worker.min.js');

export function extractRelevantSections(text, persona, job) {
  const keywords = [...new Set([...job.toLowerCase().split(/\s+/), ...persona.toLowerCase().split(/\s+/)])];

  const lines = text.split('\n');
  const scoredLines = lines.map((line, index) => ({
    line,
    score: keywords.reduce((count, word) => line.toLowerCase().includes(word) ? count + 1 : count, 0),
    index
  }));

  return scoredLines
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, 5)
    .map((item, i) => ({
      extractedSections: {
        document: '',
        section_title: item.line.slice(0, 80).trim() || `Section ${i + 1}`,
        importance_rank: i + 1,
        page_number: 1
      }
    }))
    .map(section => section.extractedSections);
}

export async function processCollection(collectionPath) {
  try {
    const inputPath = path.join(collectionPath, 'challenge1b_input.json');
    const pdfDir = path.join(collectionPath, 'PDFs');
    const outputPath = path.join('/app/output', 'challenge1b_output.json');

    // Verify input files exist
    if (!fs.existsSync(inputPath)) {
      throw new Error(`Input file not found at ${inputPath}`);
    }
    if (!fs.existsSync(pdfDir)) {
      throw new Error(`PDF directory not found at ${pdfDir}`);
    }

    const input = JSON.parse(fs.readFileSync(inputPath, 'utf-8'));
    const { role: persona, focus_areas: focusAreas = [] } = input.persona;
    const { task: job, context: jobContext = '' } = input.job_to_be_done;
    const documents = input.documents || [];

    let allExtractedSections = [];

    for (const doc of documents) {
      try {
        const pdfPath = path.join(pdfDir, doc.filename);
        if (!fs.existsSync(pdfPath)) {
          console.warn(`PDF not found: ${pdfPath}`);
          continue;
        }

        const data = new Uint8Array(fs.readFileSync(pdfPath));
        const pdf = await pdfjsLib.getDocument(data).promise;
        let fullText = '';

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          fullText += textContent.items.map(item => item.str).join(' ') + '\n';
        }

        const extractedSections = extractRelevantSections(
          fullText,
          `${persona} ${focusAreas.join(' ')}`,
          `${job} ${jobContext}`
        );

        extractedSections.forEach(section => {
          section.document = doc.filename;
        });

        allExtractedSections.push(...extractedSections);
      } catch (err) {
        console.error(`Error processing ${doc.filename}:`, err.message);
      }
    }

    const output = {
      metadata: {
        input_documents: documents.map(d => d.filename),
        persona: {
          role: persona,
          focus_areas: focusAreas
        },
        job_to_be_done: {
          task: job,
          context: jobContext
        },
        processing_timestamp: new Date().toISOString()
      },
      extracted_sections: allExtractedSections
    };

    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
    console.log(`✅ Output written to ${outputPath}`);
  } catch (err) {
    console.error('❌ Processing failed:', err.message);
    throw err;
  }
}
