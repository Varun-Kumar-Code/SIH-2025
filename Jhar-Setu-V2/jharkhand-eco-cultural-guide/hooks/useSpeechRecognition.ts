
import { useState, useEffect, useRef } from 'react';

// Type definitions to ensure SpeechRecognition is available on window
interface IWindow extends Window {
  SpeechRecognition: any;
  webkitSpeechRecognition: any;
}

export const useSpeechRecognition = (lang: string) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<any>(null);
  
  const browserSupportsSpeechRecognition =
    typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      console.warn("Speech recognition not supported by this browser.");
      return;
    }
    
    // Stop any previous recognition instance
    if(recognitionRef.current) {
      recognitionRef.current.stop();
    }

    // FIX: Cast window to `unknown` then `IWindow` to access non-standard browser APIs safely.
    // This resolves the TypeScript error because a direct cast from `Window` to `IWindow` is disallowed by strict checks.
    const typedWindow = window as unknown as IWindow;
    const SpeechRecognition = typedWindow.SpeechRecognition || typedWindow.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    const recognition = recognitionRef.current;
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = lang; 

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      setTranscript(finalTranscript + interimTranscript);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
    };

    // Cleanup on unmount
    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [browserSupportsSpeechRecognition, lang]); // Re-run effect if language changes

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setTranscript('');
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  return { isListening, transcript, startListening, stopListening, browserSupportsSpeechRecognition };
};
