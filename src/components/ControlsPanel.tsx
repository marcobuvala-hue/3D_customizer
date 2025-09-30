import { ChangeEvent, useMemo, useState } from 'react';

interface ControlsPanelProps {
  text: string;
  onTextChange: (value: string) => void;
  fontFamily: string;
  onFontFamilyChange: (value: string) => void;
  color: string;
  onColorChange: (value: string) => void;
  onLogoSelected: (file: File | null) => void;
  logoPreview: string | null;
}

const FONT_OPTIONS = [
  { label: 'Roboto', value: 'Roboto' },
  { label: 'Montserrat', value: 'Montserrat' },
  { label: 'Lora', value: 'Lora' },
  { label: 'Courier Prime', value: 'Courier Prime' },
];

export function ControlsPanel({
  text,
  onTextChange,
  fontFamily,
  onFontFamilyChange,
  color,
  onColorChange,
  onLogoSelected,
  logoPreview,
}: ControlsPanelProps) {
  const [error, setError] = useState<string | null>(null);
  const [fileInputKey, setFileInputKey] = useState(0);

  const fontOptions = useMemo(() => FONT_OPTIONS, []);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = event.target.files?.[0] ?? null;

    if (!file) {
      onLogoSelected(null);
      return;
    }

    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file (PNG, JPG, SVG, etc.).');
      setFileInputKey((value) => value + 1);
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError('Images must be smaller than 2MB.');
      setFileInputKey((value) => value + 1);
      return;
    }

    onLogoSelected(file);
    event.target.value = '';
  };

  const handleRemoveLogo = () => {
    onLogoSelected(null);
    setError(null);
    setFileInputKey((value) => value + 1);
  };

  return (
    <aside className="controls-panel">
      <h2>Customizer Controls</h2>
      <label className="control">
        <span>Headline Text</span>
        <input
          type="text"
          value={text}
          placeholder="Enter your product name"
          onChange={(event) => onTextChange(event.target.value)}
        />
      </label>

      <label className="control">
        <span>Font Family</span>
        <select value={fontFamily} onChange={(event) => onFontFamilyChange(event.target.value)}>
          {fontOptions.map((font) => (
            <option key={font.value} value={font.value}>
              {font.label}
            </option>
          ))}
        </select>
      </label>

      <label className="control">
        <span>Accent Color</span>
        <input type="color" value={color} onChange={(event) => onColorChange(event.target.value)} />
      </label>

      <label className="control">
        <span>Upload Logo</span>
        <input key={fileInputKey} type="file" accept="image/*" onChange={handleFileChange} />
      </label>

      {error ? <p className="error">{error}</p> : null}

      {logoPreview ? (
        <div className="logo-preview">
          <img src={logoPreview} alt="Uploaded logo preview" />
          <button type="button" onClick={handleRemoveLogo} className="secondary-button">
            Remove logo
          </button>
        </div>
      ) : (
        <p className="helper">Accepted formats: PNG, JPG, SVG. Max size: 2MB.</p>
      )}
    </aside>
  );
}

export default ControlsPanel;
