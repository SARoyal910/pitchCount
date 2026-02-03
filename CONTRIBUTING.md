# Contributing to pitchCount

Thank you for your interest in contributing to pitchCount! This document provides guidelines and instructions for contributing to this project.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and collaborative environment for everyone.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/pitchCount.git`
3. Create a new branch: `git checkout -b feature/your-feature-name`
4. Set up your development environment (see README.md for setup instructions)

## Development Workflow

### 1. Making Changes

- Keep changes focused and atomic
- Follow the existing code style and conventions
- Write clear, descriptive commit messages
- Test your changes thoroughly on iOS, Android, and Web (when applicable)

### 2. Code Style

This project uses:
- **TypeScript** with strict mode
- **ESLint** for code linting
- **Expo conventions** for React Native development

Run linting before committing:
```bash
npm run lint
```

### 3. Commit Messages

Follow this format for commit messages:
```
Type: Brief description

Detailed explanation of what changed and why.

- Bullet point 1
- Bullet point 2
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### 4. Testing

Before submitting a pull request:
- [ ] Test on iOS (if applicable)
- [ ] Test on Android (if applicable)
- [ ] Test on Web (if applicable)
- [ ] Ensure no console errors or warnings
- [ ] Verify all existing functionality still works

### 5. Pull Request Process

1. Update your branch with the latest main:
   ```bash
   git checkout main
   git pull origin main
   git checkout your-branch
   git rebase main
   ```

2. Push your changes:
   ```bash
   git push origin your-branch
   ```

3. Create a Pull Request on GitHub:
   - Use the PR template
   - Provide a clear description of changes
   - Link any related issues
   - Add screenshots/videos for UI changes
   - Request review from maintainers

4. Address review feedback:
   - Make requested changes
   - Push updates to the same branch
   - Respond to comments

5. Once approved, a maintainer will merge your PR

## Project Structure

Understanding the project structure will help you navigate the codebase:

```
pitchCount/
├── app/               # Screens and routes (Expo Router)
├── components/        # Reusable UI components
├── constants/         # App constants and theme
├── hooks/            # Custom React hooks
├── lib/              # Firebase and utilities
├── styles/           # Global styles and theming
└── assets/           # Images and static assets
```

## Firebase Configuration

When working with Firebase features:
- Never commit actual Firebase credentials
- Use environment variables (`.env` file)
- Test with your own Firebase project
- Document any new Firebase features used

## Reporting Issues

When reporting bugs:
- Use the bug report template
- Provide clear reproduction steps
- Include device/platform information
- Add screenshots if relevant

## Feature Requests

When requesting features:
- Use the feature request template
- Explain the problem it solves
- Provide use cases
- Consider implementation complexity

## Questions?

If you have questions:
- Check existing issues and discussions
- Open a new issue with the `question` label
- Be respectful and patient

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to pitchCount!
