"use client";

import React from "react";
import MDEditor from "@uiw/react-md-editor";

const CoverLetterPreview = ({ content }) => {
  return (
    <div style={s.previewContainer}>
      <div style={s.previewHeader}>
        <span style={s.previewBadge}>Preview</span>
        <span style={{ fontSize: 13, color: "#6b7280" }}>AI Generated • Ready to copy</span>
      </div>
      <div style={s.mdWrapper}>
        <MDEditor
          value={content}
          preview="preview"
          height={700}
          style={{
            background: "#111",
            color: "#e5e5e5",
            fontFamily: "'DM Sans', system-ui",
          }}
        />
      </div>
    </div>
  );
};

const s = {
  previewContainer: { padding: "40px 48px", maxWidth: 900, margin: "0 auto" },
  previewHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, paddingBottom: 16, borderBottom: "1px solid #1a1a1a" },
  previewBadge: { background: "#13082a", color: "#a78bfa", padding: "4px 14px", borderRadius: 99, fontSize: 13, fontWeight: 600 },
  mdWrapper: { background: "#111", borderRadius: 14, border: "1px solid #1a1a1a", overflow: "hidden" },
};

export default CoverLetterPreview;