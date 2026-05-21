# Stich AI Dermatology Platform - Quick Start Guide

## 🚀 Getting Started

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build
pnpm start
```

The application will be available at `http://localhost:3000`

## 📁 Project Structure

```
stitch-ai-dermatology/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Main page with state management
│   └── globals.css         # Design tokens & custom utilities
├── components/
│   ├── Header.tsx          # Navigation header
│   ├── Hero.tsx            # Hero section with animations
│   ├── UploadSection.tsx   # Drag-drop image upload
│   ├── ScanAnimation.tsx   # AI scanning animation overlay
│   ├── ResultsDashboard.tsx # Results display with metrics
│   ├── WorkflowTimeline.tsx # 4-step workflow diagram
│   ├── DiseasesLibrary.tsx  # Disease cards library
│   ├── Features.tsx         # Feature highlights
│   ├── FAQ.tsx             # Accordion FAQ section
│   ├── Testimonials.tsx    # Social proof section
│   └── Footer.tsx          # Footer with links
├── package.json
├── tailwind.config.ts
├── next.config.mjs
└── tsconfig.json
```

## 🎨 Design System

### Colors
- **Primary (Deep Space Blue)**: `#000000`
- **Secondary (Electric Cyan)**: `#00696e`
- **Tertiary (Soft Purple)**: `#6200bc`
- **Background**: `#f7f9fb`
- **Success**: `#00a86b`

### Tailwind Utilities
- `glass-card`: Glassmorphic card styling
- `glass-glow`: Soft outer glow effect
- `glass-glow-purple`: Purple variant glow

### Custom Animations
- `animate-pulse-glow`: Pulsing opacity
- `animate-float`: Vertical floating
- `animate-scan`: Horizontal scan line

## 🔄 User Flow

### Image Analysis Workflow

1. **Upload Phase**
   - User uploads image via drag-drop or file picker
   - Image preview displays with metadata
   - "Analyze Image" button becomes active

2. **Analysis Phase** (3.5s simulation)
   - Scanning animation plays on image
   - Processing indicator shows status
   - Smooth transition to results

3. **Results Phase**
   - Condition prediction (e.g., "Eczema")
   - Confidence score with animated bar
   - Severity indicator (mild/moderate/severe)
   - Recommendations list
   - Medical disclaimer

4. **Actions**
   - Share results button
   - Analyze another image button

## 🛠️ Customization

### Change Colors
Edit `/app/globals.css` CSS variables:
```css
:root {
  --primary: #000000;
  --secondary: #00696e;
  --tertiary: #6200bc;
}
```

### Modify Mock Prediction
Edit `/app/page.tsx` `mockPrediction` object:
```typescript
const mockPrediction = {
  condition: 'Your Condition',
  confidence: 0.95,
  severity: 'mild',
  description: 'Your description...',
  recommendations: ['Rec 1', 'Rec 2'],
};
```

### Adjust Animation Timing
Framer Motion components use `transition` props. Example:
```typescript
transition={{ duration: 0.8, ease: 'easeOut' }}
```

## 🔌 API Integration Ready

### Current State
- Mock prediction system with 3.5s simulated analysis
- No backend required to run locally

### To Connect Real Backend
1. Replace mock prediction in `page.tsx`
2. Create API route in `app/api/analyze.ts`
3. Send FormData with image to backend
4. Process real AI analysis
5. Return prediction data

Example API integration:
```typescript
const formData = new FormData();
formData.append('image', selectedImage);

const response = await fetch('/api/analyze', {
  method: 'POST',
  body: formData,
});

const results = await response.json();
setAnalysisResults(results);
```

## 📱 Responsive Design

- **Mobile** (<768px): Single column, full width
- **Tablet** (768px-1024px): 2 columns where applicable
- **Desktop** (>1024px): 3+ columns, expanded layout

## ♿ Accessibility

- Semantic HTML elements (`<section>`, `<nav>`, `<main>`)
- ARIA labels on interactive elements
- Keyboard navigation support
- Color contrast ratios meet WCAG AA standards
- Screen reader friendly copy

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Other Platforms
- Netlify: `netlify deploy --prod`
- AWS Amplify: Connect GitHub repo
- Docker: See Dockerfile template below

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN pnpm install
RUN pnpm build
EXPOSE 3000
CMD ["pnpm", "start"]
```

## 📊 Performance Tips

1. **Optimize Images**: Compress uploaded images before upload
2. **Lazy Load**: Components use `whileInView` for scroll triggers
3. **Caching**: Implement service workers for offline support
4. **CDN**: Deploy through Vercel for automatic edge caching

## 🔐 Security Checklist

- [ ] Add HTTPS only
- [ ] Implement CSRF protection
- [ ] Validate file uploads server-side
- [ ] Add rate limiting
- [ ] Implement user authentication
- [ ] Add audit logging
- [ ] Comply with medical data regulations (HIPAA/GDPR)

## 📚 Key Dependencies

- **Next.js 16**: React framework
- **React 19**: UI library
- **Framer Motion 12**: Animations
- **Tailwind CSS**: Styling
- **Lucide React**: Icons
- **TypeScript**: Type safety

## 🐛 Troubleshooting

### Dev server not starting
```bash
# Clear cache
rm -rf .next
pnpm install
pnpm dev
```

### Styles not applying
```bash
# Rebuild Tailwind
pnpm install
pnpm dev
```

### Animation performance issues
- Reduce motion with `prefers-reduced-motion`
- Use `will-change` CSS on animated elements
- Profile with Chrome DevTools

## 📖 Documentation

- [Next.js Docs](https://nextjs.org/docs)
- [Framer Motion Docs](https://www.framer.com/motion/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [React Docs](https://react.dev)

## 🤝 Contributing

To add new sections:
1. Create new component in `/components`
2. Import in `/app/page.tsx`
3. Add section ID for navigation links
4. Follow existing animation patterns
5. Test on mobile and desktop

## 📞 Support

For issues and questions:
- Check IMPLEMENTATION.md for detailed feature docs
- Review component comments for usage
- Open issues on GitHub

---

**Built with ❤️ for healthcare innovation**

Ready to deploy and integrate with your AI backend!
