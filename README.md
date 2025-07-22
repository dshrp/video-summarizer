# Video Summarizer

Transform lengthy interviews and videos into digestible insights using AI-powered analysis.

## 🚀 Live Demo

**[Try it now at summarizer.thedscs.com](https://summarizer.thedscs.com/)**

## ✨ Features

- **Smart Analysis**: Extracts key takeaways, quotes, and insights from video transcripts
- **Multiple Formats**: Handles various interview types (tech talks, podcasts, business discussions)
- **Batch Processing**: Summarize up to 5 transcripts in one session
- **Export Options**: Copy to clipboard or download as text files
- **Clean Interface**: Simple upload → process → export workflow

## 🔧 How to Use

1. Get your transcript using [Downsub](https://downsub.com)
2. Upload the `.txt` file to the summarizer
3. Get structured insights with key takeaways, tools mentioned, and strategic quotes
4. Export or copy your summary

## 🛠️ Built With

- **React** - Frontend framework
- **Tailwind CSS** - Styling
- **AI Analysis** - Custom content extraction and pattern matching
- **Vercel** - Deployment and hosting

## 📊 Perfect For

- AI/Tech interviews and podcasts
- Business strategy discussions  
- Educational content
- Conference talks and presentations

## 🤝 Contributing

Found a bug or have a feature idea? Feel free to open an issue or submit a pull request!

## 📝 License

MIT License - feel free to use this project for your own needs.

---

**Created by [Daniel Sharp](https://thedscs.com) | [DSCS](https://dscs.substack.com)**


markdown# Video Summarizer

AI-powered tool to transform video transcripts into structured summaries with key takeaways, quotes, and insights.

🔗 **Live Demo**: [summarizer.thedscs.com](https://summarizer.thedscs.com/)

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/dshrp/video-summarizer.git
cd video-summarizer

# Install dependencies
npm install

# Set up environment variables (see below)
cp .env.example .env.local

# Run development server
npm run dev
Open http://localhost:3000 in your browser.
📋 Prerequisites

Node.js 18+ and npm
OpenAI API key (for AI analysis)
Vercel account (for deployment)

⚙️ Environment Setup
Create a .env.local file in the root directory:
env# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4-turbo-preview

# Optional: Rate limiting
RATE_LIMIT_MAX_REQUESTS=10
RATE_LIMIT_WINDOW_MS=60000
Getting OpenAI API Key

Visit platform.openai.com/api-keys
Create a new API key
Add billing information (pay-per-use pricing)
Copy the key to your .env.local file

Cost Estimate: ~$0.01-0.05 per transcript analysis
🏗️ Project Structure
video-summarizer/
├── components/
│   ├── ui/                 # Shadcn/ui components
│   └── summarizer/         # Main summarizer component
├── lib/
│   ├── openai.js          # OpenAI integration
│   ├── transcript-analyzer.js  # Content analysis logic
│   └── utils.js           # Helper functions
├── pages/
│   ├── api/
│   │   └── analyze.js     # API endpoint for transcript analysis
│   └── index.js           # Main page
├── public/                # Static assets
└── styles/               # Global styles
🔧 Core Features
Transcript Analysis Pipeline

File Upload: Accepts .txt transcript files
Content Extraction: Parses speakers, topics, and key phrases
AI Analysis: Uses OpenAI to generate structured summaries
Output Formatting: Creates organized takeaways and insights

Analysis Components

Pattern Recognition: Identifies adoption patterns, strategies, challenges
Quote Extraction: Finds meaningful quotes and insights
Tool Detection: Recognizes mentioned technologies and platforms
Content Categorization: Organizes insights by theme

🚀 Deployment
Deploy to Vercel

Connect to Vercel:
bashnpm install -g vercel
vercel login
vercel

Set Environment Variables:

Go to Vercel Dashboard → Project → Settings → Environment Variables
Add your OPENAI_API_KEY


Custom Domain (optional):

Add your domain in Vercel Dashboard → Domains
Update DNS records as instructed



Deploy to Other Platforms
The app is a standard Next.js application and can be deployed to:

Netlify: Add build command npm run build && npm run export
Railway: Connect GitHub repo and set environment variables
DigitalOcean App Platform: Use the Next.js preset

🔨 Development
Available Scripts
bashnpm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
Adding New Analysis Features

Extend the analyzer in lib/transcript-analyzer.js:
javascriptconst customPattern = /your-regex-pattern/gi;
// Add to extractTakeaways() function

Modify the prompt in lib/openai.js:
javascriptconst systemPrompt = `
Your existing prompt...
Additional instructions for new feature...
`;

Update the UI in components/summarizer/ to display new insights

Customizing the UI

Styling: Uses Tailwind CSS classes
Components: Built with Shadcn/ui components
Theme: Modify colors in tailwind.config.js

🛡️ Rate Limiting & Security
The app includes basic rate limiting:
javascript// pages/api/analyze.js
const rateLimit = {
  max: process.env.RATE_LIMIT_MAX_REQUESTS || 10,
  windowMs: process.env.RATE_LIMIT_WINDOW_MS || 60000
};
Production Recommendations:

Implement user authentication
Add request logging
Set up monitoring for API usage
Configure CORS properly

🐛 Troubleshooting
Common Issues
OpenAI API Errors:
bashError: 401 Unauthorized

Check your API key is valid and has billing enabled

Build Failures:
bashModule not found: '@/components/ui/...'

Ensure all Shadcn/ui components are properly installed

Rate Limiting:

Implement exponential backoff for API calls
Consider caching results for identical transcripts

Debug Mode
Enable detailed logging:
envDEBUG=true
LOG_LEVEL=debug
🤝 Contributing

Fork the repository
Create a feature branch: git checkout -b feature/new-feature
Commit changes: git commit -m 'Add new feature'
Push to branch: git push origin feature/new-feature
Submit a pull request

Development Guidelines

Follow the existing code style
Add tests for new features
Update documentation for API changes
Ensure environment variables are documented

📄 License
MIT License - see LICENSE file for details.
🆘 Support

Issues: GitHub Issues
Questions: Email
Documentation: Wiki


Built by Daniel Sharp | DSCS
