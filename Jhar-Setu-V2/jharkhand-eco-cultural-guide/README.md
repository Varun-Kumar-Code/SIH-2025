# Jharkhand Eco-Cultural Guide

A modern, AI-powered tourism assistance application for exploring the rich culture and natural beauty of Jharkhand, India. Built with React, TypeScript, and Google's Gemini AI.

## 🌟 Features

- **AI-Powered Chat Assistant** - Intelligent responses using Google Gemini AI
- **Multi-language Support** - English, Hindi, Tamil, Telugu, Bengali, and Marathi
- **Voice Interaction** - Speech-to-text input and text-to-speech output
- **Trip Planning** - Personalized itinerary suggestions
- **Cultural Discovery** - Information about local art, crafts, and traditions
- **Responsive Design** - Works seamlessly on desktop and mobile devices

## 🚀 Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (version 18.0 or higher)
- **npm** (version 8.0 or higher) or **yarn**
- **Git** (for version control)

You can check your versions by running:
```bash
node --version
npm --version
```

## 📦 Required Dependencies

### Core Dependencies

```json
{
  "react": "^19.1.1",
  "react-dom": "^19.1.1",
  "@google/genai": "^1.20.0"
}
```

### Development Dependencies

```json
{
  "@types/node": "^22.14.0",
  "@vitejs/plugin-react": "^5.0.0",
  "typescript": "~5.8.2",
  "vite": "^6.2.0"
}
```

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/jharkhand-eco-cultural-guide.git
cd jharkhand-eco-cultural-guide
```

### 2. Install Node Modules

Run one of the following commands to install all necessary dependencies:

```bash
# Using npm
npm install

# Using yarn (alternative)
yarn install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory and add your Google Gemini API key:

```bash
GEMINI_API_KEY=your_gemini_api_key_here
```

To get a Gemini API key:
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy and paste it into your `.env.local` file

## 🏃‍♂️ Running the Application

### Development Mode

```bash
npm run dev
```

This will start the development server at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
jharkhand-eco-cultural-guide/
├── components/
│   ├── ChatInput.tsx          # Message input with voice support
│   ├── ChatWindow.tsx         # Chat message display area
│   ├── FeatureSelection.tsx   # Home screen feature cards
│   ├── Header.tsx             # Navigation bar with language selector
│   ├── Icons.tsx              # SVG icon components
│   ├── LoadingSpinner.tsx     # Loading animation
│   └── MessageBubble.tsx      # Individual message component
├── hooks/
│   ├── useSpeechRecognition.ts # Voice input functionality
│   └── useSpeechSynthesis.ts   # Text-to-speech functionality
├── services/
│   ├── geminiService.ts       # Google Gemini AI integration
│   └── ragService.ts          # Knowledge database service
├── App.tsx                    # Main application component
├── types.ts                   # TypeScript type definitions
├── index.tsx                  # Application entry point
├── index.html                 # HTML template
├── vite.config.ts            # Vite configuration
├── tsconfig.json             # TypeScript configuration
└── package.json              # Dependencies and scripts
```

## 🔧 Configuration Files

### Vite Configuration (`vite.config.ts`)

```typescript
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
```

### TypeScript Configuration (`tsconfig.json`)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

## 🌐 Browser Support

This application supports modern browsers with the following features:
- ES2020 support
- Web Speech API (for voice features)
- Fetch API
- Modern CSS features

### Recommended Browsers:
- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

## 🎯 API Integration

The application integrates with:

- **Google Gemini AI** - For intelligent chat responses
- **Web Speech API** - For voice recognition and synthesis
- **Geolocation API** - For location-based recommendations (optional)

## 🚨 Troubleshooting

### Common Issues:

1. **Module not found errors**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **TypeScript compilation errors**
   ```bash
   npm run build
   ```

3. **Environment variable not loaded**
   - Ensure `.env.local` file exists in root directory
   - Restart the development server after adding environment variables

4. **Voice features not working**
   - Ensure you're using HTTPS in production
   - Check browser permissions for microphone access

## 📝 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run type-check` | Run TypeScript type checking |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Google AI for providing the Gemini API
- Jharkhand Tourism Department for cultural information
- React and Vite communities for excellent development tools

## 📧 Support

If you encounter any issues or have questions, please:
1. Check the troubleshooting section above
2. Search existing [GitHub Issues](https://github.com/yourusername/jharkhand-eco-cultural-guide/issues)
3. Create a new issue if needed

---

**Happy Coding! 🚀**
