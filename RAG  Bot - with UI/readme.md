# Quick Starter
### 1. Download ollama  
### 2. Download Llama3:8b model
### 3. either through Ollama software, vs code's terminal, or even via Command prompt
### 4. You can copy - paste this command in any terminal
ollama pull llama3:8b

___
# RAG Bot with Web UI


This project is a Retrieval-Augmented Generation (RAG) chatbot featuring a comprehensive web interface. It leverages a local knowledge base and real-time web-scraping capabilities to answer user queries. The backend is built with Flask, and the generation is powered by Llama 3 running via Ollama.

## Key Features

*   **Interactive Web UI:** A clean, modern user interface built with HTML, CSS, and vanilla JavaScript for asking questions and viewing results.
*   **Dual-Source RAG:** Seamlessly switch between two sources for answers:
    *   **Knowledge Base:** Answers questions based on the content of the local `knowledge.txt` file.
    *   **Web:** Performs a live web search using DuckDuckGo, scrapes the top results, and synthesizes an answer.
*   **Ollama Integration:** Utilizes Ollama to run the `llama3:8b` model locally for response generation.
*   **Dynamic Knowledge:** The application automatically detects changes to `knowledge.txt` and re-indexes the content without requiring a restart.
*   **Source Citation:** The UI displays the sources used to generate an answer, whether it's the knowledge base or specific URLs from the web.

## Architecture

The application operates with a simple client-server architecture:

1.  **Frontend (`index.html`):** The user interacts with the web UI to submit a question and select a source (`Knowledge Base` or `Web`).
2.  **Backend (`app.py`):** A Flask server receives the request at its `/ask` endpoint.
3.  **Chatbot Logic (`chatbot.py`):**
    *   If the source is "Knowledge Base", it provides the content from `knowledge.txt` as context.
    *   If the source is "Web", it scrapes content from DuckDuckGo search results to use as context.
4.  **LLM (`Ollama`):** The chatbot logic constructs a prompt containing the context and the user's question and sends it to the locally running Ollama service.
5.  **Response:** The LLM's generated answer is returned to the backend, which then forwards it to the UI for display.

## Setup and Installation

Follow these steps to run the chatbot on your local machine.

### Prerequisites

*   Python 3.8+ and `pip`
*   [Ollama](https://ollama.com/) installed and running.

### 1. Clone the Repository

Clone this repository to your local machine:
```bash
git clone https://github.com/Varun-Kumar-Code/SIH-2025.git
cd SIH-2025/RAG\ \ Bot\ -\ with\ UI
```

### 2. Install Dependencies

Install the required Python packages using `requirements.txt`:
```bash
pip install -r requirements.txt
```

### 3. Set Up Ollama

First, ensure the Ollama application is running on your system. Then, pull the Llama 3 model:
```bash
ollama pull llama3:8b
```
The application is configured to use this model by default.

### 4. Run the Application

Start the Flask web server:
```bash
python app.py
```
You will see output indicating that the server is running and the chatbot is being initialized:
```
Initializing chatbot...
✓ Llama trained with knowledge base
Chatbot ready!
Starting Flask chatbot server...
Visit http://localhost:5000 to use the chatbot
 * Serving Flask app 'app'
 * Debug mode: on
...
```

### 5. Access the Chatbot

Open your web browser and navigate to:
[http://localhost:5000](http://localhost:5000)

## How to Use

1.  **Open the Web UI:** Navigate to `http://localhost:5000`.
2.  **Select a Source:**
    *   **Knowledge Base:** To ask questions based on the content of `knowledge.txt`.
    *   **Web:** To ask questions that require current information from the internet.
3.  **Ask a Question:** Type your question into the input field.
4.  **Submit:** Click the "Ask" button or press Enter.
5.  **View Results:** The answer will appear in the "Answer" box, and the sources used (either the knowledge base or web links) will appear in the "Sources" box.

## Customization

### Modifying the Knowledge Base

You can customize the chatbot's knowledge by editing the `knowledge.txt` file. Add, remove, or modify the text as you see fit. The application will automatically detect the changes upon the next query and refresh its index.

### Changing the LLM

To use a different model from Ollama, change the value of the `OLLAMA_MODEL` variable in `chatbot.py`:
```python
# In chatbot.py
OLLAMA_MODEL = "your-ollama-model-name:tag" # e.g., "mistral:latest"
```
Ensure you have pulled the desired model using `ollama pull <model-name>`.

## File Descriptions

*   `app.py`: The main Flask application file that serves the web UI and handles API requests.
*   `chatbot.py`: Contains the core logic for the RAG pipeline, web scraping, and interaction with the Ollama API.
*   `knowledge.txt`: A plain text file containing the local knowledge base for the RAG system.
*   `requirements.txt`: A list of Python packages required to run the project.
*   `Modelfile`: A configuration file for creating a custom Ollama model with a predefined system prompt. (Note: The current code does not use this by default).
*   `templates/index.html`: The single-page HTML file that provides the complete user interface.
