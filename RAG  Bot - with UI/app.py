
from flask import Flask, render_template, request, jsonify
from pathlib import Path
import sys

# Add the current directory to the Python path so we can import chatbot
sys.path.append(str(Path(__file__).parent.resolve()))

from chatbot import ask_question_web, _refresh_if_changed, _ensure_chunks_loaded, _train_index, feed_knowledge_to_llama

app = Flask(__name__)

# Initialize the chatbot on startup
print("Initializing chatbot...")
_ensure_chunks_loaded()
_train_index()
_refresh_if_changed()

# Feed knowledge base to Llama for training
success = feed_knowledge_to_llama()
print("✓ Llama trained with knowledge base" if success else "⚠ Warning: Could not train Llama with knowledge base")
print("Chatbot ready!")

@app.route('/')
def index():
    """Serve the main chatbot interface."""
    return render_template('index.html')

@app.route('/ask', methods=['POST'])
def ask():
    """Handle question submission and return answer with sources."""
    try:
        data = request.get_json()
        question = data.get('question', '').strip()
        source_type = data.get('sourceType', 'knowledge')
        
        # Validate source type
        if source_type not in ['knowledge', 'web']:
            source_type = 'knowledge'
        
        if not question:
            return jsonify({
                'error': 'Please enter a question',
                'answer': '',
                'sources': [],
                'web_sources': []
            }), 400
        
        # Refresh knowledge if changed and get answer
        _refresh_if_changed()
        result = ask_question_web(question, source_type)
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({
            'error': f'An error occurred: {str(e)}',
            'answer': '',
            'sources': [],
            'web_sources': []
        }), 500

@app.route('/health')
def health():
    """Health check endpoint."""
    return jsonify({'status': 'ok', 'message': 'Chatbot is running'})

if __name__ == '__main__':
    print("Starting Flask chatbot server...")
    print("Visit http://localhost:5000 to use the chatbot")
    app.run(debug=True, host='0.0.0.0', port=5000)