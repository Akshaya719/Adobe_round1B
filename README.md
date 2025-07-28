# 📄 Adobe Hackathon 2025 – Round 1B: Persona-Driven Document Intelligence

## 🚀 Project Title
**Smart Document Analyzer for Persona-Based Task Extraction**

---

## 📌 Problem Statement

In Round 1B of the Adobe India Hackathon, we were tasked with building an intelligent system that analyzes a collection of documents and extracts the **most relevant sections and subsections** based on a given:

- **Persona** (e.g., Travel Planner, Analyst, Researcher)
- **Job-to-be-done** (e.g., Plan a trip, Summarize financials, Prepare study notes)

The solution must be:
- CPU-only
- Executed in under **60 seconds** for 3–5 documents
- Contained within a **1GB model/code** size
- Executed **offline** (no internet access)

---

## 🧠 How It Works

The solution uses **PDF text extraction**, **keyword scoring**, and **ranking logic** to identify the most relevant:
- **Sections** (titles/headings) → `extracted_sections`
- **Subsections** (detailed content) → `subsection_analysis`

---

## 📁 Project Structure

```
Adobe_Round1B/
├── challenge1bProcessor.js        # Main logic: PDF parsing, scoring, and extraction
├── runner.js                      # Entry point for container execution
├── Dockerfile                     # Docker configuration for offline setup
├── input/
│   ├── challenge1b_input.json     # Persona + job + document list
│   └── PDFs/                      # Folder containing the input PDFs
├── output/
│   └── challenge1b_output.json    # Final generated output JSON
├── folder_structure.txt           # (Optional) Helper for navigation
├── package.json / package-lock.json # Node dependencies
└── node_modules/                  # Installed packages
```

---

## 📥 Input Format (`challenge1b_input.json`)

```json
{
  "persona": {
    "role": "Travel Planner",
    "focus_areas": []
  },
  "job_to_be_done": {
    "task": "Plan a trip of 4 days for a group of 10 college friends.",
    "context": ""
  },
  "documents": [
    { "filename": "South of France - Cities.pdf" },
    { "filename": "South of France - Cuisine.pdf" }
  ]
}
```

---

## 📤 Output Format (`challenge1b_output.json`)

Contains:
- ✅ Metadata
- ✅ Top 5 Extracted Sections per document
- ✅ Ranked Subsection Analysis with refined content

---

## 🐳 Docker Instructions

### 🔧 Build Image
```bash
docker build -t adobe_challenge1b .
```

### ▶️ Run Container
```bash
docker run --rm \
  -v $(pwd)/input:/app/input \
  -v $(pwd)/output:/app/output \
  adobe_challenge1b
```

> Replace `$(pwd)` with the full path if you're on Windows.

---

## 🧪 Sample Use Case

- **Persona**: Travel Planner  
- **Job**: Plan a 4-day itinerary  
- **Input**: 7 travel-related PDFs  
- **Output**: Top sections/subsections helpful for trip planning

You can test the system on any new set of documents and personas by modifying the input JSON and placing relevant PDFs inside `input/PDFs`.

---

## ✅ Deliverables

| File                      | Description                                  |
|---------------------------|----------------------------------------------|
| `challenge1bProcessor.js` | Main logic (PDF extraction & scoring)        |
| `challenge1b_output.json` | Final output JSON                            |
| `Dockerfile`              | Offline CPU-only container setup             |
| `runner.js`               | Execution wrapper                            |
| `README.md`               | This documentation file                      |
| `approach_explanation.md`| Explanation of methodology (separate file)   |

---



