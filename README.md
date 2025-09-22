# Is Billy Napier Fired Yet?

A simple landing page to track Billy Napier's employment status at the University of Florida.

## Features

- Clean, responsive design with custom CSS
- Toggle between "No" and "Yes" views
- Buy me a coffee link in the top right
- Background image support
- Global view counter (tracks all visitors across all devices)
- Easy to deploy on Vercel

## Setup

1. Install dependencies:
```bash
npm install
```

2. Add your images:
   - Place your background image in `public/images/background.jpg`
   - Place your "not fired" image in `public/images/not-fired.jpg`
   - Place your "fired" image in `public/images/fired.jpg`
   - Update the image paths in `src/App.jsx` if using different filenames

3. Update the Buy Me a Coffee link:
   - The link is already set to `https://buymeacoffee.com/maxeatssnacks`

4. Run the development server:
```bash
npm run dev
```

**Note**: The global view counter API will only work when deployed to Vercel. In development, it will fall back to localStorage.

## Deployment on Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy!

## Switching Between Views

Currently, there's a toggle button in the bottom left corner for testing. For production:

1. **To show "No" (not fired)**: Set `isFired` to `false` in `src/App.jsx`
2. **To show "Yes" (fired)**: Set `isFired` to `true` in `src/App.jsx`

You can remove the toggle button by deleting the button element in the App component.

## Customization

- Update colors by modifying the CSS variables in `src/index.css`
- Change fonts by updating the font-family in the CSS
- Modify the layout by adjusting the CSS classes
- Add animations or transitions as needed