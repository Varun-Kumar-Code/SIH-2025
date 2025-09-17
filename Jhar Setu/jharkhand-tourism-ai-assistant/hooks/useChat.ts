
import { useState, useCallback, useMemo } from 'react';
import { Message, Feature, Language } from '../types';
import { getItinerary, getLocationSuggestion, getLanguageHelp, translateText } from '../services/geminiService';
import { recommendSouvenirs } from '../services/souvenirService';

type ConversationState = 'SELECTING_FEATURE' | 'IN_CONVERSATION';

interface ItineraryData {
    destination: string | null;
    duration: string | null;
    interests: string | null;
    status: 'pending' | 'collecting' | 'generating' | 'done';
}

const uiStringData = {
    title: { en: "Jharkhand AI Guide", hi: "झारखंड एआई गाइड", bn: "ঝাড়খণ্ড এআই গাইড", mr: "झारखंड एआय मार्गदर्शक", te: "జార్ఖండ్ AI గైడ్", ta: "ஜார்கண்ட் AI வழிகாட்டி" },
    startOver: { en: "Start Over", hi: "फिर से शुरू करें", bn: "আবার শুরু করুন", mr: "पुन्हा सुरू करा", te: "మళ్లీ ప్రారంభించండి", ta: "மீண்டும் தொடங்கு" },
    disclaimer: { en: "AI can make mistakes. Consider checking important information.", hi: "एआई गलतियाँ कर सकता है। महत्वपूर्ण जानकारी की जाँच करने पर विचार करें।", bn: "এআই ভুল করতে পারে। গুরুত্বপূর্ণ তথ্য চেক করার কথা বিবেচনা করুন।", mr: "एआय चुका करू शकते. महत्त्वाची माहिती तपासण्याचा विचार करा.", te: "AI తప్పులు చేయవచ్చు. ముఖ్యమైన సమాచారాన్ని తనిఖీ చేయడాన్ని పరిగణించండి.", ta: "AI தவறுகள் செய்யலாம். முக்கியமான தகவல்களைச் சரிபார்க்கவும்." },
    welcome: { en: "Welcome to the Jharkhand Tourism AI Assistant! How can I help you today?", hi: "झारखंड पर्यटन एआई सहायक में आपका स्वागत है! मैं आज आपकी कैसे मदद कर सकता हूँ?", bn: "ঝাড়খণ্ড পর্যটন এআই সহকারীতে আপনাকে স্বাগতম! আমি আজ আপনাকে কিভাবে সাহায্য করতে পারি?", mr: "झारखंड पर्यटन एआय सहाय्यकामध्ये आपले स्वागत आहे! मी आज तुमची कशी मदत करू शकतो?", te: "జార్ఖండ్ టూరిజం AI అసిస్టెంట్‌కు స్వాగతం! ఈ రోజు నేను మీకు ఎలా సహాయపడగలను?", ta: "ஜார்கண்ட் சுற்றுலா AI உதவியாளருக்கு வரவேற்கிறோம்! இன்று நான் உங்களுக்கு எப்படி உதவ முடியும்?" },
    itinerary: {
        prompt1: { en: "I can help plan your trip! First, where in Jharkhand would you like to go?", hi: "मैं आपकी यात्रा की योजना बनाने में मदद कर सकता हूँ! सबसे पहले, आप झारखंड में कहाँ जाना चाहेंगे?", bn: "আমি আপনার ট্রিপ পরিকল্পনা করতে সাহায্য করতে পারি! প্রথমে, আপনি ঝাড়খণ্ডের কোথায় যেতে চান?", mr: "मी तुमच्या प्रवासाचे नियोजन करण्यास मदत करू शकतो! प्रथम, तुम्हाला झारखंडमध्ये कोठे जायचे आहे?", te: "నేను మీ పర్యటనను ప్లాన్ చేయడంలో సహాయపడగలను! ముందుగా, మీరు జార్ఖండ్‌లో ఎక్కడికి వెళ్లాలనుకుంటున్నారు?", ta: "உங்கள் பயணத்தைத் திட்டமிட நான் உதவ முடியும்! முதலில், ஜார்கண்டில் நீங்கள் எங்கு செல்ல விரும்புகிறீர்கள்?" },
        prompt2: { en: "Got it. And how many days will your trip be?", hi: "समझ गया। और आपकी यात्रा कितने दिनों की होगी?", bn: "বুঝেছি। আর আপনার ট্রিপ কত দিনের হবে?", mr: "समजले. आणि तुमचा प्रवास किती दिवसांचा असेल?", te: "అర్థమైంది. మరియు మీ పర్యటన ఎన్ని రోజులు ఉంటుంది?", ta: "புரிந்தது. உங்கள் பயணம் எத்தனை நாட்கள் இருக்கும்?" },
        prompt3: { en: "Perfect. What are you interested in? (e.g., temples, waterfalls, trekking, local culture)", hi: "बढ़िया। आपकी रुचि किसमें है? (जैसे, मंदिर, झरने, ट्रेकिंग, स्थानीय संस्कृति)", bn: "দারুণ। আপনি কিসে আগ্রহী? (যেমন, মন্দির, জলপ্রপাত, ট্রেকিং, স্থানীয় সংস্কৃতি)", mr: "उत्तम. तुम्हाला कशात रस आहे? (उदा. मंदिरे, धबधबे, ट्रेकिंग, स्थानिक संस्कृती)", te: "అద్భుతం. మీకు దేనిపై ఆసక్తి ఉంది? (ఉదా. దేవాలయాలు, జలపాతాలు, ట్రేకింగ్, స్థానిక సంస్కృతి)", ta: "அற்புதம். உங்களுக்கு எதில் ஆர்வம்? (எ.கா. கோவில்கள், நீர்வீழ்ச்சிகள், மலையேற்றம், உள்ளூர் கலாச்சாரம்)" },
        generating: { en: "Awesome! I'm creating a personalized itinerary for you now based on your preferences. This might take a moment...", hi: "बहुत बढ़िया! मैं अब आपकी प्राथमिकताओं के आधार पर आपके लिए एक व्यक्तिगत यात्रा कार्यक्रम बना रहा हूँ। इसमें थोड़ा समय लग सकता है...", bn: "অসাধারণ! আমি এখন আপনার পছন্দের উপর ভিত্তি করে আপনার জন্য একটি ব্যক্তিগত ভ্রমণসূচী তৈরি করছি। এতে কিছুক্ষণ সময় লাগতে পারে...", mr: "अप्रतिम! मी आता तुमच्या पसंतीनुसार तुमच्यासाठी वैयक्तिक प्रवासाची योजना तयार करत आहे. याला थोडा वेळ लागू शकतो...", te: "అద్భుతం! నేను ఇప్పుడు మీ ప్రాధాన్యతల ఆధారంగా మీ కోసం వ్యక్తిగతీకరించిన ప్రయాణ ప్రణాళికను సృష్టిస్తున్నాను. దీనికి కొంత సమయం పట్టవచ్చు...", ta: "அற்புதம்! உங்கள் விருப்பங்களின் அடிப்படையில் உங்களுக்காக ஒரு தனிப்பயனாக்கப்பட்ட பயணத்திட்டத்தை நான் இப்போது உருவாக்குகிறேன். இதற்கு சிறிது நேரம் ஆகலாம்..." }
    },
    souvenir: { prompt: { en: "Looking for souvenirs? Ask me about specific categories like 'textiles' or 'metal crafts', or describe what you're looking for.", hi: "स्मृति चिन्ह खोज रहे हैं? मुझसे 'कपड़ा' या 'धातु शिल्प' जैसी विशिष्ट श्रेणियों के बारे में पूछें, या आप जो खोज रहे हैं उसका वर्णन करें।", bn: "স্মারক খুঁজছেন? আমাকে 'টেক্সটাইল' বা 'মেটাল ক্রাফ্টস'-এর মতো নির্দিষ্ট বিভাগ সম্পর্কে জিজ্ঞাসা করুন বা আপনি যা খুঁজছেন তা বর্ণনা করুন।", mr: "स्मृतिचिन्हे शोधत आहात? मला 'कापड' किंवा 'धातू कला' यांसारख्या विशिष्ट श्रेणींबद्दल विचारा किंवा तुम्ही काय शोधत आहात याचे वर्णन करा.", te: "జ్ఞాపికల కోసం చూస్తున్నారా? 'వస్త్రాలు' లేదా 'లోహపు கைவினைలు' వంటి నిర్దిష్ట వర్గాల గురించి నన్ను అడగండి లేదా మీరు వెతుకుతున్న దాన్ని వివరించండి.", ta: "நினைவுப்பொருட்களைத் தேடுகிறீர்களா? 'ஜவுளி' அல்லது 'உலோக கைவினைப்பொருட்கள்' போன்ற குறிப்பிட்ட வகைகளைப் பற்றி என்னிடம் கேளுங்கள் அல்லது நீங்கள் தேடுவதை விவரிக்கவும்." } },
    location: { prompt: { en: "I can suggest places to visit. Where in Jharkhand are you interested in?", hi: "मैं घूमने के लिए जगहों का सुझाव दे सकता हूँ। झारखंड में आपकी रुचि कहाँ है?", bn: "আমি ঘোরার জায়গা প্রস্তাব করতে পারি। ঝাড়খণ্ডে আপনি কোথায় আগ্রহী?", mr: "मी भेट देण्यासाठी ठिकाणे सुचवू शकेन. तुम्हाला झारखंडमध्ये कोठे रस आहे?", te: "నేను సందర్శించడానికి స్థలాలను సూచించగలను. జార్ఖండ్‌లో మీకు ఎక్కడ ఆసక్తి ఉంది?", ta: "நான் பார்வையிட இடங்களைப் பரிந்துரைக்க முடியும். ஜார்கண்டில் உங்களுக்கு எங்கு ஆர்வம்?" } },
    language: { prompt: { en: "I can help with translations or common phrases. What would you like to know?", hi: "मैं अनुवाद या सामान्य वाक्यांशों में मदद कर सकता हूँ। आप क्या जानना चाहेंगे?", bn: "আমি অনুবাদ বা সাধারণ বাক্যাংশে সাহায্য করতে পারি। আপনি কি জানতে চান?", mr: "मी भाषांतर किंवा सामान्य वाक्यांशांमध्ये मदत करू शकेन. तुम्हाला काय जाणून घ्यायला आवडेल?", te: "నేను అనువాదాలు లేదా సాధారణ పదబంధాలతో సహాయం చేయగలను. మీరు ఏమి తెలుసుకోవాలనుకుంటున్నారు?", ta: "மொழிபெயர்ப்புகள் அல்லது பொதுவான சொற்றொடர்களுக்கு நான் உதவ முடியும். நீங்கள் என்ன தெரிந்து கொள்ள விரும்புகிறீர்கள்?" } }
};


const getInitialMessage = (language: Language): Message => ({
    id: 'init',
    text: uiStringData.welcome[language],
    sender: 'bot'
});

export const useChat = () => {
    const [language, setLanguage] = useState<Language>('en');
    const [messages, setMessages] = useState<Message[]>([getInitialMessage(language)]);
    const [conversationState, setConversationState] = useState<ConversationState>('SELECTING_FEATURE');
    const [currentFeature, setCurrentFeature] = useState<Feature | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [itineraryData, setItineraryData] = useState<ItineraryData>({ status: 'pending', destination: null, duration: null, interests: null });

    const uiStrings = useMemo(() => ({
        title: uiStringData.title[language],
        startOver: uiStringData.startOver[language],
        disclaimer: uiStringData.disclaimer[language],
    }), [language]);

    const handleSetLanguage = useCallback((lang: Language) => {
        setLanguage(lang);
        setMessages([getInitialMessage(lang)]);
        setConversationState('SELECTING_FEATURE');
        setCurrentFeature(null);
    }, []);

    const startConversation = useCallback((feature: Feature) => {
        setCurrentFeature(feature);
        setConversationState('IN_CONVERSATION');
        let promptText = '';
        switch (feature) {
            case Feature.ITINERARY:
                promptText = uiStringData.itinerary.prompt1[language];
                setItineraryData({ status: 'collecting', destination: null, duration: null, interests: null });
                break;
            case Feature.SOUVENIR:
                promptText = uiStringData.souvenir.prompt[language];
                break;
            case Feature.LOCATION:
                promptText = uiStringData.location.prompt[language];
                break;
            case Feature.LANGUAGE:
                promptText = uiStringData.language.prompt[language];
                break;
        }
        setMessages([getInitialMessage(language), { id: Date.now().toString(), text: promptText, sender: 'bot' }]);
    }, [language]);

    const resetChat = useCallback(() => {
        setMessages([getInitialMessage(language)]);
        setConversationState('SELECTING_FEATURE');
        setCurrentFeature(null);
        setIsLoading(false);
        setError(null);
        setItineraryData({ status: 'pending', destination: null, duration: null, interests: null });
    }, [language]);

    const sendMessage = async (text: string) => {
        const userMessage: Message = { id: Date.now().toString(), text, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);
        setError(null);

        try {
            const englishPrompt = language === 'en' ? text : await translateText(text, 'en', language);
            let response: Message;

            // Handle interactive itinerary planning
            if (currentFeature === Feature.ITINERARY && itineraryData.status === 'collecting') {
                if (!itineraryData.destination) {
                    setItineraryData(prev => ({ ...prev, destination: englishPrompt }));
                    response = { id: 'bot-' + Date.now(), text: uiStringData.itinerary.prompt2[language], sender: 'bot' };
                } else if (!itineraryData.duration) {
                    setItineraryData(prev => ({ ...prev, duration: englishPrompt }));
                     response = { id: 'bot-' + Date.now(), text: uiStringData.itinerary.prompt3[language], sender: 'bot' };
                } else {
                    setItineraryData(prev => ({ ...prev, interests: englishPrompt, status: 'generating' }));
                    const generatingMessage: Message = { id: 'bot-generating', text: uiStringData.itinerary.generating[language], sender: 'bot' };
                    setMessages(prev => [...prev, generatingMessage]);
                    
                    const fullItineraryPrompt = `Destination: ${itineraryData.destination}, Duration: ${itineraryData.duration}, Interests: ${englishPrompt}`;
                    response = await getItinerary(fullItineraryPrompt);
                    setItineraryData(prev => ({ ...prev, status: 'done' }));
                }
            } else {
                 switch (currentFeature) {
                    case Feature.SOUVENIR:
                        response = await recommendSouvenirs(englishPrompt);
                        break;
                    case Feature.LOCATION:
                        response = await getLocationSuggestion(englishPrompt);
                        break;
                    case Feature.LANGUAGE:
                        response = await getLanguageHelp(englishPrompt, language);
                        break;
                    default:
                        // Generic fallback
                        response = await getLanguageHelp(englishPrompt, language);
                        break;
                }
            }
            
            if (language !== 'en' && response.sender === 'bot') {
                 response.text = await translateText(response.text, language, 'en');
            }
            
            setMessages(prev => [...prev, response]);

        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
            setError(errorMessage);
            setMessages(prev => [...prev, { id: 'error-' + Date.now(), text: `Sorry, something went wrong: ${errorMessage}`, sender: 'bot' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return { messages, conversationState, currentFeature, isLoading, error, language, uiStrings, sendMessage, startConversation, resetChat, setLanguage: handleSetLanguage };
};