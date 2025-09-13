"""
Generic Knowledge-Based Chatbot - Fixed Version
A chatbot that answers questions based on a local knowledge file,
with web scraping capabilities for additional information.
"""

import os
import re
import time
import requests
import urllib.parse
from bs4 import BeautifulSoup
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

# Configuration
KNOWLEDGE_FILE = 'knowledge.txt'
OLLAMA_URL = "http://localhost:11434/api/generate"
KNOWLEDGE_CONFIDENCE_THRESHOLD = 0.3  # If confidence is below this, use web search
UNKNOWN_RESPONSE = "I don't know."
ENABLE_WEB_SCRAPING = True  # Set to False to disable web scraping

# Model configuration - always use Llama 3 8B
OLLAMA_MODEL = "llama3:8b"

# Global variable to track if knowledge base has been fed to Llama
_KB_TRAINED_IN_LLAMA = False

# Global variables for TF-IDF
_VECTORIZER = None
_TFIDF_MATRIX = None
_CACHED_CHUNKS = []
_TRAINED = False
_KB_MTIME = None

def feed_knowledge_to_llama():
    """Feed the entire knowledge base to Llama on startup to train it for query responses."""
    global _KB_TRAINED_IN_LLAMA
    
    if _KB_TRAINED_IN_LLAMA:
        print("[Knowledge already fed to Llama]")
        return True
    
    knowledge_content = get_knowledge()
    if not knowledge_content or len(knowledge_content.strip()) < 10:
        print("[Warning: No knowledge base content to feed to Llama]")
        return False
    
    print("[Feeding knowledge base to Llama for training...]")
    
    # Create a training prompt that teaches Llama about the knowledge base
    training_prompt = f"""You are an AI assistant with access to a knowledge base. Please read and learn this information so you can answer questions about it accurately.

KNOWLEDGE BASE CONTENT:
{knowledge_content.strip()}

Please acknowledge that you have read and understood this information. You will use this knowledge to answer future questions."""

    print(f"[Sending {len(knowledge_content)} characters to Llama for training...]")
    result = _make_ollama_request(training_prompt, temperature=0.1, num_predict=50, timeout=180)
    
    if "error" in result:
        print(f"[Error feeding knowledge to Llama: {result['error']}]")
        return False
    
    acknowledgment = result.get('response', '').strip()
    print(f"[Llama response: {acknowledgment[:100]}...]")
    _KB_TRAINED_IN_LLAMA = True
    print("[✓ Knowledge base successfully fed to Llama]")
    return True

def _make_ollama_request(prompt: str, temperature: float = 0.5, num_predict: int = 200, timeout: int = 120) -> dict:
    """Make a request to Ollama and return the result."""
    payload = {
        "model": OLLAMA_MODEL,
        "prompt": prompt,
        "stream": False,
        "options": {
            "temperature": temperature,
            "num_predict": num_predict
        }
    }
    
    try:
        response = requests.post(OLLAMA_URL, json=payload, timeout=timeout)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        return {"error": str(e)}

def get_knowledge():
    """Load and return the knowledge base content."""
    try:
        if os.path.exists(KNOWLEDGE_FILE):
            with open(KNOWLEDGE_FILE, 'r', encoding='utf-8') as f:
                return f.read()
        else:
            print(f"[Warning: {KNOWLEDGE_FILE} not found]")
            return ""
    except Exception as e:
        print(f"[Error reading knowledge file: {e}]")
        return ""

def _chunk_text(text: str, chunk_size: int = 300, overlap: int = 50) -> list:
    """Split text into overlapping chunks for TF-IDF processing."""
    if not text.strip():
        return []
    
    # Split into sentences (basic approach)
    sentences = re.split(r'[.!?]+', text)
    chunks = []
    current_chunk = ""
    
    for sentence in sentences:
        sentence = sentence.strip()
        if not sentence:
            continue
            
        if len(current_chunk) + len(sentence) > chunk_size:
            if current_chunk:
                chunks.append(current_chunk.strip())
                # Keep overlap
                words = current_chunk.split()
                if len(words) > overlap // 5:  # Rough word-based overlap
                    current_chunk = " ".join(words[-(overlap // 5):]) + " " + sentence
                else:
                    current_chunk = sentence
            else:
                current_chunk = sentence
        else:
            current_chunk += " " + sentence if current_chunk else sentence
    
    if current_chunk.strip():
        chunks.append(current_chunk.strip())
    
    return chunks

def _ensure_chunks_loaded():
    """Ensure the knowledge chunks are loaded and current."""
    global _CACHED_CHUNKS, _KB_MTIME
    
    if not os.path.exists(KNOWLEDGE_FILE):
        _CACHED_CHUNKS = []
        _KB_MTIME = None
        return
    
    current_mtime = os.path.getmtime(KNOWLEDGE_FILE)
    
    if _KB_MTIME != current_mtime:
        print("[Reloading knowledge chunks...]")
        knowledge = get_knowledge()
        _CACHED_CHUNKS = _chunk_text(knowledge)
        _KB_MTIME = current_mtime
        print(f"[Loaded {len(_CACHED_CHUNKS)} chunks]")

def _train_index():
    """Train or retrain the TF-IDF index on the chunks."""
    global _VECTORIZER, _TFIDF_MATRIX, _TRAINED
    
    _ensure_chunks_loaded()
    
    if not _CACHED_CHUNKS:
        print("[No chunks available for training]")
        _VECTORIZER = None
        _TFIDF_MATRIX = None
        _TRAINED = False
        return
    
    print("[Training TF-IDF index...]")
    _VECTORIZER = TfidfVectorizer(
        stop_words='english',
        max_features=1000,
        ngram_range=(1, 2),
        min_df=1
    )
    
    try:
        _TFIDF_MATRIX = _VECTORIZER.fit_transform(_CACHED_CHUNKS)
        _TRAINED = True
        print(f"[TF-IDF index trained on {len(_CACHED_CHUNKS)} chunks]")
    except Exception as e:
        print(f"[Error training TF-IDF: {e}]")
        _TRAINED = False

def _refresh_if_changed():
    """Check if the knowledge file has changed and refresh if needed."""
    global _TRAINED, _KB_MTIME
    
    if not os.path.exists(KNOWLEDGE_FILE):
        return
    
    current_mtime = os.path.getmtime(KNOWLEDGE_FILE)
    if _KB_MTIME != current_mtime:
        print("[Knowledge file changed, refreshing...]")
        _TRAINED = False
        _ensure_chunks_loaded()
        _train_index()

def retrieve_relevant(query: str, top_k: int = 5) -> list:
    """Retrieve the most relevant chunks for a query using TF-IDF."""
    if not _TRAINED:
        _train_index()
    
    if not _TRAINED or not _CACHED_CHUNKS:
        return []
    
    try:
        query_vector = _VECTORIZER.transform([query])
        similarities = cosine_similarity(query_vector, _TFIDF_MATRIX).flatten()
        
        # Get top-k most similar chunks
        top_indices = np.argsort(similarities)[::-1][:top_k]
        top_chunks = [(similarities[i], _CACHED_CHUNKS[i]) for i in top_indices if similarities[i] > 0]
        
        return top_chunks
    except Exception as e:
        print(f"[Error in retrieval: {e}]")
        return []

def _calculate_knowledge_confidence(question: str, chunks: list) -> float:
    """Calculate confidence based on chunk similarity and keyword matching."""
    if not chunks:
        return 0.0
    
    # Get the highest similarity score
    max_similarity = max(score for score, _ in chunks) if chunks else 0.0
    
    # Simple keyword matching boost
    question_lower = question.lower()
    knowledge_text = " ".join(chunk for _, chunk in chunks).lower()
    
    question_words = set(re.findall(r'\b\w+\b', question_lower))
    knowledge_words = set(re.findall(r'\b\w+\b', knowledge_text))
    
    if question_words:
        keyword_overlap = len(question_words & knowledge_words) / len(question_words)
    else:
        keyword_overlap = 0.0
    
    # Combine similarity and keyword matching
    confidence = (max_similarity * 0.7) + (keyword_overlap * 0.3)
    
    return min(confidence, 1.0)

def _search_web(query: str, num_results: int = 3) -> list:
    """Search for URLs using DuckDuckGo."""
    try:
        # Use DuckDuckGo for search
        search_query = urllib.parse.quote_plus(query)
        search_url = f"https://duckduckgo.com/html/?q={search_query}"
        
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        
        response = requests.get(search_url, headers=headers, timeout=10)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.content, 'html.parser')
        urls = []
        
        # Find search result links
        for link in soup.find_all('a', {'class': 'result__a'}):
            href = link.get('href')
            if href and href.startswith('http'):
                urls.append(href)
                if len(urls) >= num_results:
                    break
        
        return urls[:num_results]
    except Exception as e:
        print(f"[Error searching web: {e}]")
        return []

def _scrape_webpage(url: str) -> str:
    """Scrape and clean text content from a webpage."""
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Remove script and style elements
        for script in soup(["script", "style", "nav", "header", "footer", "aside"]):
            script.decompose()
        
        # Get text and clean it
        text = soup.get_text()
        lines = (line.strip() for line in text.splitlines())
        chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
        text = ' '.join(chunk for chunk in chunks if chunk)
        
        # Limit text length
        return text[:2000] if text else ""
    except Exception as e:
        print(f"[Error scraping {url}: {e}]")
        return ""

def _get_web_context(question: str) -> str:
    """Get relevant context from web scraping."""
    if not ENABLE_WEB_SCRAPING:
        return ""
    
    print("[Searching web for additional context...]")
    
    # Search for relevant URLs
    urls = _search_web(question)
    
    if not urls:
        print("[No web results found or no internet connection]")
        return ""
    
    # Scrape content from URLs
    web_content = []
    for url in urls:
        print(f"[Scraping: {urllib.parse.urlparse(url).netloc}]")
        content = _scrape_webpage(url)
        if content:
            web_content.append(f"Source: {url}\nContent: {content[:800]}")  # Limit per source
        time.sleep(1)  # Be respectful to servers
    
    return "\n\n".join(web_content) if web_content else ""

def _get_web_context_with_sources(question: str) -> tuple:
    """Get relevant context from web scraping and return both content and source URLs."""
    if not ENABLE_WEB_SCRAPING:
        return "", []
    
    print("[Searching web for additional context...]")
    
    # Search for relevant URLs
    urls = _search_web(question)
    
    if not urls:
        print("[No web results found or no internet connection]")
        return "", []
    
    # Scrape content from URLs
    web_content = []
    source_urls = []
    for url in urls:
        print(f"[Scraping: {urllib.parse.urlparse(url).netloc}]")
        content = _scrape_webpage(url)
        if content:
            web_content.append(f"Source: {url}\nContent: {content[:600]}")  # Reduced from 1200 to 600 chars
            source_urls.append(url)
        time.sleep(1)  # Be respectful to servers
    
    return "\n\n".join(web_content) if web_content else "", source_urls


def ask_question_web(question: str, source_type: str = 'knowledge') -> dict:
    """Enhanced ask_question with web context support and source type control."""
    
    # For knowledge-only mode, use the simple working approach
    if source_type == 'knowledge' or source_type not in ['knowledge', 'web']:
        # Check if knowledge base exists
        kb_content = get_knowledge()
        if not kb_content or len(kb_content.strip()) < 10:
            return {
                "answer": "I don't know.",
                "sources": ["Knowledge base (empty)"],
                "web_sources": [],
                "confidence": 0.0
            }
        
        # Use the EXACT same approach as the working ask_question function
        full_context = kb_content.strip()
        
        # Use knowledge base content with reminder of training
        prompt = f"""You have been trained with knowledge base information. Here is the relevant information for this question:

{full_context}

Question: {question}

Answer based on the knowledge above:"""

        result = _make_ollama_request(prompt, temperature=0.5, num_predict=150)
        
        if "error" in result:
            return {
                "answer": f"Error: Could not connect to Ollama. Is it running? ({result['error']})",
                "sources": [],
                "web_sources": [],
                "confidence": 0.0
            }
        
        answer = result.get('response', '').strip()
        
        # Filter out generic responses
        generic_phrases = [
            "i understand", "i'm ready", "okay, i understand", 
            "let's start", "i will use", "based on the provided",
            "i can help", "let me help", "ready to help"
        ]
        
        if not answer or any(phrase in answer.lower()[:50] for phrase in generic_phrases):
            answer = "I don't know."
        
        return {
            "answer": answer + "\n\n(Answer based on knowledge base only)",
            "sources": ["Knowledge base"],
            "web_sources": [],
            "confidence": 1.0
        }
    
    # For web-only and both modes, use the complex logic
    context_block = ""
    web_context = ""
    web_sources = []
    knowledge_confidence = 0.0
    
    # Handle source type preferences
    use_knowledge = source_type == 'knowledge'
    use_web = source_type == 'web'
    
    # Get knowledge base context if requested
    if use_knowledge:
        kb_content = get_knowledge()
        if kb_content and len(kb_content.strip()) >= 10:
            top_chunks = retrieve_relevant(question)
            knowledge_confidence = _calculate_knowledge_confidence(question, top_chunks)
            context_block = kb_content.strip()
            print(f"[Knowledge Base Confidence: {knowledge_confidence:.2f}]")
    
    # Get web context for web and both modes
    if use_web:
        try:
            print("[Web-only mode requested]")
            web_context, web_sources = _get_web_context_with_sources(question)
            if web_context:
                print(f"[Web content retrieved: {len(web_context)} chars from {len(web_sources)} sources]")
                print(f"[First 200 chars: {web_context[:200]}...]")
            else:
                print("[No web content retrieved]")
        except Exception as e:
            print(f"[Web scraping failed: {e}]")
            web_context = ""
            web_sources = []
    elif use_web and source_type == 'both' and knowledge_confidence < KNOWLEDGE_CONFIDENCE_THRESHOLD:
        try:
            print(f"[Knowledge base confidence ({knowledge_confidence:.2f}) below threshold]")
            web_context, web_sources = _get_web_context_with_sources(question)
        except Exception as e:
            print(f"[Web scraping failed: {e}]")
            web_context = ""
            web_sources = []
    
    # Build context and response
    actual_sources_used = []
    actual_web_sources_used = []
    
    if source_type == 'web':
        if web_context:
            full_context = f"WEB SOURCES:\n{web_context}"
            source_info = "\n\n(Answer based on current web sources only)"
            actual_web_sources_used = web_sources
        else:
            # Always fallback to KB if web fails
            if context_block.strip():
                print("[Web sources unavailable or no internet, replying from knowledge base]")
                full_context = context_block
                source_info = "\n\n(Answer based on knowledge base only)"
                actual_sources_used = ["Knowledge base (web fallback)"]
            else:
                return {
                    "answer": "I don't know.",
                    "sources": [],
                    "web_sources": [],
                    "confidence": 0.0
                }
    # Remove 'both' mode entirely
    
    if not full_context.strip():
        return {
            "answer": "I don't know.",
            "sources": [],
            "web_sources": [],
            "confidence": 0.0
        }

    # Use different prompts for different content types
    if source_type == 'web':
        prompt = f"""Answer this question using the web sources provided below:

{full_context}

Question: {question}

Based on the web sources above, provide a helpful answer:"""
    else:
        prompt = f"""You have been trained with knowledge base information. Here is the relevant information for this question:

{full_context}

Question: {question}

Answer based on the knowledge above:"""

    result = _make_ollama_request(prompt, temperature=0.5, num_predict=200, timeout=60)
    
    if "error" in result:
        return {
            "answer": f"Error: Could not connect to Ollama. Is it running? ({result['error']})",
            "sources": [],
            "web_sources": [],
            "confidence": 0.0
        }
    
    answer = result.get('response', '').strip()
    
    # Filter out generic responses
    generic_phrases = ["i understand", "i'm ready", "okay, i understand", "let's start", "ready to help"]
    
    # For web content, only filter if it's clearly generic AND short
    if source_type == 'web':
        if not answer or (len(answer) < 20 and any(phrase in answer.lower() for phrase in generic_phrases)):
            answer = "I don't know."
    else:
        if not answer or any(phrase in answer.lower()[:50] for phrase in generic_phrases):
            answer = "I don't know."
    
    return {
        "answer": answer + source_info,
        "sources": actual_sources_used,
        "web_sources": actual_web_sources_used,
        "confidence": knowledge_confidence
    }


if __name__ == "__main__":
    # This file is imported as a module, not run directly
    pass