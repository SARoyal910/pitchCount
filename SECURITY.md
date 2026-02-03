# Security Policy

## Supported Versions

Currently, the following version of pitchCount is being supported with security updates:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

We take the security of pitchCount seriously. If you believe you have found a security vulnerability, please report it to us responsibly.

### Please Do NOT:

- Open a public GitHub issue for security vulnerabilities
- Disclose the vulnerability publicly before it has been addressed
- Exploit the vulnerability beyond what is necessary to demonstrate it

### Please DO:

1. **Report privately**: Send details to the repository maintainers via GitHub Security Advisories or by opening a private security issue
2. **Provide details**: Include as much information as possible:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if you have one)
3. **Give us time**: Allow reasonable time for us to address the issue before public disclosure

### What to Expect:

- **Acknowledgment**: We will acknowledge receipt of your vulnerability report within 48 hours
- **Assessment**: We will assess the vulnerability and determine its severity
- **Updates**: We will keep you informed of our progress
- **Resolution**: We will work to fix the vulnerability and release a patch
- **Credit**: We will credit you for the discovery (unless you prefer to remain anonymous)

## Security Best Practices

When using pitchCount:

### Environment Variables
- Never commit `.env` files to version control
- Keep Firebase credentials secure and rotate them if compromised
- Use different Firebase projects for development and production

### Dependencies
- Keep dependencies up to date
- Run `npm audit` regularly to check for known vulnerabilities
- Review dependency changes in updates

### Firebase Security
- Configure Firebase security rules appropriately
- Limit API key permissions in Firebase Console
- Enable Firebase App Check for additional security
- Monitor Firebase usage for suspicious activity

### Code Security
- Validate all user inputs
- Sanitize data before displaying
- Follow React Native security best practices
- Use HTTPS for all network requests

## Known Security Considerations

### Firebase Client-Side Configuration
Firebase configuration (API keys, project IDs) are visible in client-side code. This is expected behavior for Firebase web/mobile apps. Security is enforced through:
- Firebase Security Rules
- Firebase App Check
- API key restrictions in Firebase Console

To secure your Firebase project:
1. Set up proper [Firebase Security Rules](https://firebase.google.com/docs/rules)
2. Enable [Firebase App Check](https://firebase.google.com/docs/app-check)
3. Restrict your API keys in the [Firebase Console](https://console.firebase.google.com/)

## Resources

- [OWASP Mobile Security Project](https://owasp.org/www-project-mobile-security/)
- [React Native Security](https://reactnative.dev/docs/security)
- [Firebase Security](https://firebase.google.com/docs/rules)
- [Expo Security](https://docs.expo.dev/guides/security/)

---

Thank you for helping keep pitchCount secure!
