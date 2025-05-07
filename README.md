# AwesomeProject

A React Native mobile application with a clean architecture and a consistent UI component system.

## Project Overview

This project follows modern React Native development practices, including:

- TypeScript for type safety
- Component-based architecture
- Consistent theming system
- UI component library for reusability
- React Navigation for routing

## Project Structure

```
AwesomeProject/
├── android/           # Android native code
├── ios/               # iOS native code
├── components/        # Reusable components
│   └── ui/            # UI component library
├── screens/           # App screens
│   └── tabs/          # Tab screen components
├── theme/             # Theme and styling utilities
├── App.tsx            # App entry point
└── index.js           # React Native entry point
```

## UI Component System

The project includes a comprehensive UI component system to ensure consistency across the application.

### Theme

The theming system (`theme/theme.ts`) provides:

- Color palette with primary, secondary, and utility colors
- Typography settings for consistent font sizes and weights
- Spacing utilities for consistent layout
- Elevation/shadow settings
- Roundness (border radius) settings

### UI Components

Reusable UI components include:

- `Avatar`: For displaying user avatars with fallback to initials
- `Badge`: For status indicators with various styles
- `Button`: Versatile button component with multiple variants
- `Card`: Container component for content with consistent styling
- `Header`: Screen header with title and optional actions
- `Input`: Text input component with validation support

Each component is:
- Fully typed with TypeScript
- Customizable through props
- Responsive to theme settings
- Designed for reusability

## Screens

The app includes the following screens:

- `HomeScreen`: Login/authentication screen
- `OTPScreen`: OTP verification
- `MainTabs`: Main app tabs container
  - `HomeTab`: Main feed of photos
  - `ContestTab`: Photo contests
  - `CreateTab`: Create/upload new content
  - `InvitationTab`: Invitations and notifications
  - `ProfileTab`: User profile

## Navigation

The app uses React Navigation with:
- Stack navigation for authentication flow
- Tab navigation for main app screens
- Customized navigation theme

## Getting Started

1. Install dependencies:
   ```
   npm install
   ```

2. Start Metro bundler:
   ```
   npm start
   ```

3. Run on Android:
   ```
   npm run android
   ```

   Or iOS:
   ```
   npm run ios
   ```

## Development Guidelines

When extending this project, follow these guidelines:

1. Use the existing theme system for all styling
2. Create new UI components in the `components/ui` directory and export them from the index
3. Maintain TypeScript typing for all new code
4. Follow the established component patterns for props and customization
5. Keep screens focused on layout and business logic, delegating UI concerns to components

## License

This project is proprietary and confidential.
