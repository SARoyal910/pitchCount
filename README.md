# pitchCount

A React Native mobile application built with Expo for tracking baseball pitch counts during games.

## Features

- Real-time pitch count tracking
- User authentication with Firebase
- Live game tracking
- Statistics and dashboard views
- Cross-platform support (iOS, Android, Web)

## Tech Stack

- **Framework**: [Expo](https://expo.dev) ~54.0
- **Language**: TypeScript
- **UI**: React Native with custom theming
- **Navigation**: Expo Router (file-based routing)
- **Backend**: Firebase (Authentication & Firestore)
- **State Management**: React Context API

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo Go app (for mobile testing)
- Firebase account with a project set up

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Firebase

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Add your Firebase credentials to the `.env` file:
```env
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key_here
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

You can find these values in your [Firebase Console](https://console.firebase.google.com/) under Project Settings.

### 3. Start the Development Server

```bash
npm start
```

This will start the Expo development server. You can then:

- Press `i` to open in iOS Simulator
- Press `a` to open in Android Emulator
- Press `w` to open in Web Browser
- Scan the QR code with Expo Go app on your mobile device

## Project Structure

```
pitchCount/
├── app/                    # App screens (file-based routing)
│   ├── (tabs)/            # Tab navigation screens
│   │   ├── index.tsx      # Home screen
│   │   ├── dashboard.tsx  # Dashboard
│   │   ├── stats.tsx      # Statistics
│   │   └── live.tsx       # Live tracking
│   ├── _layout.tsx        # Root layout
│   └── modal.tsx          # Modal screens
├── components/            # Reusable UI components
├── constants/             # App constants and theme
├── hooks/                 # Custom React hooks
├── lib/                   # Firebase and session management
├── styles/                # Global styles and theming
└── assets/                # Images, fonts, and other assets
```

## Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Start on Android
- `npm run ios` - Start on iOS
- `npm run web` - Start on Web
- `npm run lint` - Run ESLint
- `npm run reset-project` - Reset to a blank project

## Development

This project uses:

- **TypeScript** with strict mode enabled
- **ESLint** with Expo's recommended configuration
- **File-based routing** via Expo Router
- **Themed components** for consistent styling across light/dark modes

## Learn More

To learn more about the technologies used in this project:

- [Expo documentation](https://docs.expo.dev/)
- [React Native documentation](https://reactnative.dev/)
- [Firebase documentation](https://firebase.google.com/docs)
- [Expo Router documentation](https://docs.expo.dev/router/introduction/)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For questions or issues, please [open an issue](https://github.com/joepangallo/pitchCount/issues) on GitHub.
