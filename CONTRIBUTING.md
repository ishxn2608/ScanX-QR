# Contributing to ScanX QR

Thank you for considering contributing to ScanX QR! This document provides guidelines for contributing to the project.

## 🚀 Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/scanx-qr.git
   cd scanx-qr
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Set up environment variables** (see README.md)
5. **Create a branch** for your feature:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## 💻 Development Workflow

1. **Make your changes** in your feature branch
2. **Test your changes** thoroughly:
   ```bash
   npm run dev
   npm run build
   ```
3. **Follow code style**:
   - Use TypeScript for type safety
   - Follow existing code formatting
   - Use meaningful variable and function names
   - Add comments for complex logic

4. **Commit your changes**:
   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   ```

## 📝 Commit Message Guidelines

Use conventional commit format:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

Examples:
```
feat: add QR code expiration feature
fix: resolve admin login redirect issue
docs: update deployment instructions
```

## 🧪 Testing

Before submitting a PR:

1. **Run the build**:
   ```bash
   npm run build
   ```
2. **Test locally**:
   - Test authentication flows
   - Test vendor approval workflow
   - Test QR generation and scanning
   - Test on mobile devices

3. **Check for errors**:
   - No console errors
   - No TypeScript errors
   - No build warnings

## 📋 Pull Request Process

1. **Update documentation** if needed
2. **Ensure all tests pass**
3. **Update README.md** with details of changes if applicable
4. **Submit your PR** with a clear description:
   - What changes were made
   - Why the changes were needed
   - How to test the changes

## 🎯 Areas for Contribution

We welcome contributions in these areas:

### Features
- Payment gateway integration
- Multi-language support
- Advanced analytics dashboard
- QR code customization options
- Bulk QR generation
- Export/import functionality

### Improvements
- Performance optimizations
- UI/UX enhancements
- Mobile responsiveness
- Accessibility improvements
- Security enhancements

### Documentation
- Tutorial videos
- API documentation
- Deployment guides
- Troubleshooting guides

### Bug Fixes
- Check the Issues tab for open bugs
- Report new bugs with detailed reproduction steps

## 🔒 Security

If you discover a security vulnerability:
- **DO NOT** open a public issue
- Contact the maintainer directly via LinkedIn
- Provide detailed information about the vulnerability

## 📖 Code Style

- Use **TypeScript** for all new code
- Follow **Next.js 15 App Router** conventions
- Use **Tailwind CSS** for styling
- Keep components **small and focused**
- Use **meaningful names** for variables and functions
- Add **JSDoc comments** for complex functions

## 🤔 Questions?

- Open an issue for general questions
- Contact via LinkedIn for specific inquiries
- Check existing issues and documentation first

## 📜 Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on the code, not the person
- Help others learn and grow

## 🙏 Thank You!

Your contributions make ScanX QR better for everyone. We appreciate your time and effort!

---

**Happy Coding! 🚀**
