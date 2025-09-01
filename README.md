# AI Wall Visualizer

A modern, production-ready web application that allows users to visualize different wall designs and materials on their space using AI-powered image analysis and canvas manipulation.

## 🚀 Features

- **AI-Powered Wall Detection**: Automatically detects walls in uploaded images using computer vision algorithms
- **Real-time Design Application**: Apply different wall designs, patterns, and materials in real-time
- **Interactive Canvas**: Built with Fabric.js for smooth, responsive image manipulation
- **Fallback Detection**: Graceful degradation when AI models are unavailable
- **Export Functionality**: Download high-quality renders of your designs
- **Modern UI**: Beautiful, responsive interface built with Tailwind CSS and Radix UI
- **Production Ready**: Optimized for performance and scalability

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI Components
- **Canvas**: Fabric.js for image manipulation
- **AI/ML**: Custom computer vision algorithms (with TensorFlow.js support for future enhancements)
- **Animation**: Framer Motion
- **Icons**: Lucide React

## 📋 Prerequisites

- Node.js 18.0.0 or higher
- npm 8.0.0 or higher
- Modern web browser with Canvas support

## 🚀 Quick Start

### 1. Clone the repository

```bash
git clone <repository-url>
cd ai-wall-visualizer
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking
- `npm run analyze` - Analyze bundle size
- `npm run export` - Export static site
- `npm run clean` - Clean build artifacts

## 🏗️ Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── CanvasEditor.tsx  # Main canvas component
│   ├── DesignPalette.tsx # Design selection
│   ├── ExportPanel.tsx   # Export functionality
│   ├── Header.tsx        # App header
│   ├── ImageUpload.tsx   # Image upload
│   └── Toolbar.tsx       # Canvas toolbar
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
│   ├── ai-models.ts      # AI/ML functionality
│   ├── config.ts         # Configuration
│   ├── fabric-utils.ts   # Fabric.js utilities
│   ├── image-processing.ts # Image processing
│   └── utils.ts          # General utilities
├── types/                # TypeScript type definitions
└── public/               # Static assets
```

## 🎨 Usage

1. **Upload Image**: Click the upload area or drag and drop an image of your space
2. **AI Analysis**: The app will automatically detect walls in your image
3. **Select Design**: Choose from the available wall designs and patterns
4. **Apply Design**: The selected design will be applied to the detected wall area
5. **Export**: Download your final design as a high-quality image

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Optional: Custom API key for future AI enhancements
CUSTOM_KEY=your_api_key_here
```

### AI Models

The application uses fallback detection methods by default. To enable advanced AI features:

1. Install TensorFlow.js dependencies (optional):
   ```bash
   npm install @tensorflow/tfjs @tensorflow/tfjs-backend-webgl
   ```

2. Update the AI models in `lib/ai-models.ts` to use actual ML models

## 🚀 Production Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

### Other Platforms

1. Build the application:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm run start
   ```

### Docker Deployment

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

## 🔍 Performance Optimization

- **Code Splitting**: Automatic code splitting with Next.js
- **Image Optimization**: Built-in Next.js image optimization
- **Bundle Analysis**: Use `npm run analyze` to analyze bundle size
- **Lazy Loading**: Components are lazy-loaded for better performance

## 🐛 Troubleshooting

### Common Issues

1. **Canvas not loading**: Ensure your browser supports HTML5 Canvas
2. **Image upload fails**: Check file format and size (supports JPG, PNG, WebP)
3. **AI detection not working**: The app will use fallback detection automatically

### Development Issues

1. **TypeScript errors**: Run `npm run type-check`
2. **Linting errors**: Run `npm run lint`
3. **Build failures**: Clean and rebuild with `npm run clean && npm run build`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:

1. Check the troubleshooting section
2. Search existing issues
3. Create a new issue with detailed information

## 🔮 Future Enhancements

- [ ] Real-time collaboration
- [ ] Advanced AI models integration
- [ ] 3D visualization
- [ ] Mobile app
- [ ] Design marketplace
- [ ] AR/VR support

---

Built with ❤️ using Next.js and modern web technologies.



