"use client";

import React from "react";
import MDEditor from "@uiw/react-md-editor";

const CoverLetterPreview = ({ content }) => {
  return (
    <div style={s.previewContainer}>
      <div style={s.previewHeader}>
        <span style={s.previewBadge}>Preview</span>
        <span style={{ fontSize: 13, color: "hsl(var(--muted-foreground))" }}>AI Generated • Ready to copy</span>
      </div>
      <div style={s.mdWrapper}>
        <MDEditor
          value={content}
          preview="preview"
          height={700}
          style={{
            background: "hsl(var(--card))",
            color: "hsl(var(--card-foreground))",
            fontFamily: "'DM Sans', system-ui",
          }}
        />
      </div>
    </div>
  );
};

const s = {
  previewContainer: { padding: "40px 48px", maxWidth: 900, margin: "0 auto" },
  previewHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, paddingBottom: 16, borderBottom: "1px solid hsl(var(--border))" },
  previewBadge: { background: "hsl(var(--primary) / 0.12)", color: "hsl(var(--primary))", padding: "4px 14px", borderRadius: 99, fontSize: 13, fontWeight: 600 },
  mdWrapper: { background: "hsl(var(--card))", borderRadius: 8, border: "1px solid hsl(var(--border))", overflow: "hidden" },
};

export default CoverLetterPreview;
