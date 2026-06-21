"use client";

interface ShortcutModalProps {
  onClose: () => void;
  nightMode?: boolean;
}

const SHORTCUTS = [
  { key: "→ / ←",  action: "Next / Previous page" },
  { key: "R",       action: "Toggle read aloud" },
  { key: "N",       action: "Toggle night mode" },
  { key: "F",       action: "Toggle fullscreen" },
  { key: "B",       action: "Bookmark current page" },
  { key: "Esc",     action: "Back to library" },
  { key: "?",       action: "Show / hide this help" },
];

export default function ShortcutModal({ onClose, nightMode }: ShortcutModalProps) {
  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center p-6"
      style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(3px)" }}
      onClick={onClose}
    >
      <div
        className="rounded-2xl shadow-2xl p-6 w-full max-w-xs"
        style={{
          background: nightMode ? "#1e1a14" : "white",
          color: nightMode ? "#e8d5b0" : "#24304A",
        }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-extrabold text-base">Keyboard Shortcuts</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
        </div>
        <table className="w-full text-sm">
          <tbody>
            {SHORTCUTS.map(s => (
              <tr key={s.key} className="border-b last:border-0" style={{ borderColor: nightMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)" }}>
                <td className="py-2 pr-4 font-mono font-bold whitespace-nowrap">
                  <span
                    className="inline-block px-1.5 py-0.5 rounded text-xs"
                    style={{ background: nightMode ? "rgba(255,255,255,0.1)" : "#f3f4f6" }}
                  >
                    {s.key}
                  </span>
                </td>
                <td className="py-2" style={{ color: nightMode ? "#a89070" : "#6b7280" }}>{s.action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
