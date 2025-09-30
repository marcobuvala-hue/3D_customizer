import { useEffect, useMemo, useState } from 'react';
import type { CanvasTexture } from 'three';
import ControlsPanel from './components/ControlsPanel';
import CustomizerScene from './components/CustomizerScene';
import { createOverlayTexture, loadImageFromFile } from './utils/createOverlayTexture';

const DEFAULT_TEXT = 'Custom Cube';
const DEFAULT_FONT = 'Roboto';
const DEFAULT_COLOR = '#ff6b6b';

function App() {
  const [text, setText] = useState(DEFAULT_TEXT);
  const [fontFamily, setFontFamily] = useState(DEFAULT_FONT);
  const [accentColor, setAccentColor] = useState(DEFAULT_COLOR);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null);
  const [logoImage, setLogoImage] = useState<HTMLImageElement | null>(null);
  const [texture, setTexture] = useState<CanvasTexture | null>(null);

  useEffect(() => {
    let canceled = false;

    if (!logoFile) {
      setLogoPreviewUrl((previous) => {
        if (previous) URL.revokeObjectURL(previous);
        return null;
      });
      setLogoImage(null);
      return () => {
        canceled = true;
      };
    }

    const previewUrl = URL.createObjectURL(logoFile);
    setLogoPreviewUrl((previous) => {
      if (previous) URL.revokeObjectURL(previous);
      return previewUrl;
    });

    loadImageFromFile(logoFile)
      .then((image) => {
        if (!canceled) {
          setLogoImage(image);
        }
      })
      .catch((error) => {
        console.error(error);
      });

    return () => {
      canceled = true;
      URL.revokeObjectURL(previewUrl);
    };
  }, [logoFile]);

  useEffect(() => {
    const newTexture = createOverlayTexture({
      text,
      fontFamily,
      textColor: accentColor,
      logo: logoImage,
    });

    setTexture((previous) => {
      previous?.dispose();
      return newTexture;
    });

    return () => {
      newTexture.dispose();
    };
  }, [text, fontFamily, accentColor, logoImage]);

  const sidebarProps = useMemo(
    () => ({
      text,
      onTextChange: setText,
      fontFamily,
      onFontFamilyChange: setFontFamily,
      color: accentColor,
      onColorChange: setAccentColor,
      onLogoSelected: setLogoFile,
      logoPreview: logoPreviewUrl,
    }),
    [text, fontFamily, accentColor, logoPreviewUrl],
  );

  return (
    <div className="app-shell">
      <ControlsPanel {...sidebarProps} />
      <main className="scene-wrapper">
        <CustomizerScene texture={texture} />
        <section className="scene-caption">
          <h1>Interactive 3D Customizer</h1>
          <p>
            Update the text, pick a font, and upload your own brand assets. The cube will refresh with a
            live texture composed with your selections.
          </p>
        </section>
      </main>
    </div>
  );
}

export default App;
