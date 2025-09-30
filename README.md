# 3D Customizer

A minimal React + Vite playground for designing branded overlays on a 3D cube in real-time. Update the
headline, pick a font and color, and drop in a logo to see the texture regenerate instantly with Three.js.

## Features

- ⚛️ **React + Vite** scaffolding with hot-module reloading for rapid iteration.
- 🎨 **Interactive controls** for text, font family, accent color, and logo uploads (with validation & preview).
- 🧱 **Three.js scene** rendered via `@react-three/fiber`, including lighting, orbit controls, and a rotating cube.
- 🖼️ **Dynamic texture generator** that composes text and imagery onto a canvas before projecting onto the 3D mesh.

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the dev server:

   ```bash
   npm run dev
   ```

   Vite prints the local URL (default `http://localhost:5173`). Open it in your browser to try the customizer.

3. Build for production:

   ```bash
   npm run build
   ```

   Preview the production bundle locally with:

   ```bash
   npm run preview
   ```

## Usage tips

- **Headline**: Enter any short text—this is centered near the top of the cube face.
- **Font & color**: Choose from the provided font families and adjust the accent color, which shades text and
  subtle background flourishes.
- **Logo upload**: Supported formats include PNG, JPG, and SVG (max 2 MB). A live preview appears in the sidebar,
  and you can remove the image with a single click.
- **3D interaction**: Drag to orbit around the cube and scroll to zoom. The cube auto-rotates to show off the
  generated texture.

## Project structure

```
.
├── index.html
├── package.json
├── public/
│   └── vite.svg
└── src/
    ├── App.tsx
    ├── components/
    │   ├── ControlsPanel.tsx
    │   └── CustomizerScene.tsx
    ├── index.css
    ├── main.tsx
    ├── utils/
    │   └── createOverlayTexture.ts
    └── vite-env.d.ts
```

## License

This project is provided as-is for demonstration purposes. Feel free to adapt it for your own prototypes or
experiments.
