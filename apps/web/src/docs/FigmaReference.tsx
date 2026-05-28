/**
 * FigmaReference — Display Figma design alongside Storybook story implementation
 *
 * Shows:
 * - Figma design image (source of truth)
 * - Story implementation
 * - Overlay toggle to compare
 * - Fidelity checklist
 *
 * Usage in stories:
 *
 * const meta = {
 *   parameters: {
 *     figma: {
 *       url: "https://www.figma.com/design/...",
 *       imageUrl: "/figma-references/button-primary.png",
 *     },
 *   },
 * } satisfies Meta;
 */

import React, { useState } from "react";

interface FigmaReferenceProps {
  figmaUrl: string;
  imageUrl: string;
  componentName: string;
  variantName?: string;
}

export const FigmaReference: React.FC<FigmaReferenceProps> = ({
  figmaUrl,
  imageUrl,
  componentName,
  variantName,
}) => {
  const [overlay, setOverlay] = useState(false);
  const [opacity, setOpacity] = useState(50);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>
          {componentName}
          {variantName && ` — ${variantName}`}
        </h3>
        <a
          href={figmaUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={styles.figmaLink}
        >
          View in Figma →
        </a>
      </div>

      <div style={styles.comparisonContainer}>
        {/* Figma reference image */}
        <div style={styles.panelContainer}>
          <h4 style={styles.panelTitle}>Figma (Source of Truth)</h4>
          <div style={styles.imageWrapper}>
            <img
              src={imageUrl}
              alt={`${componentName} from Figma`}
              style={{
                ...styles.image,
                display: overlay ? "none" : "block",
              }}
            />
          </div>
        </div>

        {/* Implementation */}
        <div style={styles.panelContainer}>
          <h4 style={styles.panelTitle}>Implementation</h4>
          <div style={styles.storyContent}>
            <div style={{ position: "relative" }}>
              <div
                style={{
                  ...styles.overlay,
                  opacity: overlay ? opacity / 100 : 0,
                  pointerEvents: "none",
                }}
              >
                <img
                  src={imageUrl}
                  alt={`${componentName} overlay`}
                  style={{
                    ...styles.image,
                  }}
                />
              </div>
              <div style={styles.content}>
                <div style={styles.slotPlaceholder}>
                  Story renders here
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div style={styles.controls}>
        <label style={styles.label}>
          <input
            type="checkbox"
            checked={overlay}
            onChange={(e) => setOverlay(e.target.checked)}
            style={styles.checkbox}
          />
          Show Figma overlay
        </label>

        {overlay && (
          <div style={styles.sliderContainer}>
            <label style={styles.label}>
              Opacity: {opacity}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={opacity}
              onChange={(e) => setOpacity(Number(e.target.value))}
              style={styles.slider}
            />
          </div>
        )}
      </div>

      {/* Fidelity checklist */}
      <div style={styles.fidelitySection}>
        <h4 style={styles.fidelityTitle}>Fidelity Checklist</h4>
        <ul style={styles.checklist}>
          <li style={styles.checklistItem}>
            <input type="checkbox" disabled style={styles.checkboxSmall} />
            Color values match design tokens
          </li>
          <li style={styles.checklistItem}>
            <input type="checkbox" disabled style={styles.checkboxSmall} />
            Spacing matches 8px grid system
          </li>
          <li style={styles.checklistItem}>
            <input type="checkbox" disabled style={styles.checkboxSmall} />
            Typography matches weight/size tokens
          </li>
          <li style={styles.checklistItem}>
            <input type="checkbox" disabled style={styles.checkboxSmall} />
            Border radius matches design tokens
          </li>
          <li style={styles.checklistItem}>
            <input type="checkbox" disabled style={styles.checkboxSmall} />
            Shadows and depth match design system
          </li>
        </ul>
        <p style={styles.note}>
          ⓘ Manually verify items above by comparing Figma design with
          implementation
        </p>
      </div>
    </div>
  );
};

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: "24px",
    backgroundColor: "#f9fafb",
    borderRadius: "8px",
    marginTop: "24px",
    marginBottom: "24px",
    border: "1px solid #e5e7eb",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
  },

  title: {
    margin: 0,
    fontSize: "16px",
    fontWeight: 600,
    color: "#111827",
  },

  figmaLink: {
    fontSize: "14px",
    color: "#3b82f6",
    textDecoration: "none",
    fontWeight: 500,
  },

  comparisonContainer: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "24px",
    marginBottom: "24px",
  },

  panelContainer: {
    display: "flex",
    flexDirection: "column" as const,
  },

  panelTitle: {
    margin: "0 0 12px 0",
    fontSize: "13px",
    fontWeight: 600,
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },

  imageWrapper: {
    backgroundColor: "white",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    overflow: "hidden",
    aspectRatio: "1",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  image: {
    maxWidth: "100%",
    maxHeight: "100%",
    objectFit: "contain",
  },

  storyContent: {
    backgroundColor: "white",
    border: "2px dashed #d1d5db",
    borderRadius: "6px",
    overflow: "hidden",
    aspectRatio: "1",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative" as const,
  },

  overlay: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    transition: "opacity 200ms ease-in-out",
  },

  content: {
    position: "relative" as const,
    zIndex: 1,
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  slotPlaceholder: {
    fontSize: "13px",
    color: "#9ca3af",
    fontStyle: "italic",
  },

  controls: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "12px",
    padding: "16px",
    backgroundColor: "white",
    borderRadius: "6px",
    border: "1px solid #e5e7eb",
    marginBottom: "24px",
  },

  label: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
    color: "#374151",
    fontWeight: 500,
    cursor: "pointer",
  },

  checkbox: {
    cursor: "pointer",
  },

  checkboxSmall: {
    cursor: "pointer",
    marginRight: "4px",
  },

  sliderContainer: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "8px",
    marginLeft: "24px",
  },

  slider: {
    width: "100%",
    cursor: "pointer",
  },

  fidelitySection: {
    padding: "16px",
    backgroundColor: "#f0f9ff",
    borderRadius: "6px",
    border: "1px solid #bfdbfe",
  },

  fidelityTitle: {
    margin: "0 0 12px 0",
    fontSize: "13px",
    fontWeight: 600,
    color: "#1e40af",
  },

  checklist: {
    margin: "0 0 12px 0",
    paddingLeft: "20px",
  },

  checklistItem: {
    fontSize: "13px",
    color: "#374151",
    marginBottom: "8px",
    display: "flex",
    alignItems: "center",
  },

  note: {
    margin: 0,
    fontSize: "12px",
    color: "#6b7280",
    fontStyle: "italic",
  },
};
