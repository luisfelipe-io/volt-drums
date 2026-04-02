// FeedbackModal.jsx — User feedback form via Formspree
// Email is never exposed to the user. Formspree forwards to the configured address.
// Setup: create free account at formspree.io, create a form, replace FORM_ID below.
// ⚠️  IMPORTANT: Replace REPLACE_WITH_FORMSPREE_ID with your actual Formspree form ID
//     after creating a free account at https://formspree.io

const FORMSPREE_ID = "xbdpknpo";

const CATEGORIES = [
  { value: "bug", label: "🐛 Bug report" },
  { value: "feature", label: "💡 Feature request" },
  { value: "sound", label: "🥁 Sound quality" },
  { value: "ui", label: "🎨 UI / Design" },
  { value: "other", label: "💬 Other" },
];

export default function FeedbackModal({ open, onClose }) {
  if (!open) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const btn = form.querySelector("[type=submit]");
    btn.disabled = true;
    btn.textContent = "SENDING...";

    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form),
      });
      if (res.ok) {
        btn.textContent = "✓ SENT — THANK YOU!";
        setTimeout(onClose, 1800);
      } else {
        throw new Error("Form submit failed");
      }
    } catch {
      btn.textContent = "✗ ERROR — TRY AGAIN";
      btn.disabled = false;
    }
  }

  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal" style={{ width: 500 }}>
        <h2>SEND FEEDBACK</h2>
        <div className="modal-sub">HELP US IMPROVE DRUM SESSIONS</div>

        <form onSubmit={handleSubmit} className="feedback-form">
          {/* Category */}
          <div className="fb-field">
            <label className="fb-label">CATEGORY</label>
            <div className="fb-categories">
              {CATEGORIES.map((cat) => (
                <label key={cat.value} className="fb-cat-option">
                  <input
                    type="radio"
                    name="category"
                    value={cat.value}
                    defaultChecked={cat.value === "bug"}
                    required
                  />
                  <span>{cat.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Message */}
          <div className="fb-field">
            <label className="fb-label" htmlFor="fb-message">
              MESSAGE
            </label>
            <textarea
              id="fb-message"
              name="message"
              className="fb-textarea"
              placeholder="Describe the bug, feature idea, or anything you'd like to share..."
              rows={5}
              required
              minLength={10}
            />
          </div>

          {/* Optional email for reply */}
          <div className="fb-field">
            <label className="fb-label" htmlFor="fb-email">
              YOUR EMAIL{" "}
              <span style={{ color: "var(--text-dim)", fontWeight: "normal" }}>
                (optional — only if you want a reply)
              </span>
            </label>
            <input
              id="fb-email"
              type="email"
              name="email"
              className="fb-input"
              placeholder="your@email.com"
            />
          </div>

          {/* Hidden metadata */}
          <input
            type="hidden"
            name="kit"
            value={
              typeof window !== "undefined" ? document.title : "Drum Sessions"
            }
          />
          <input
            type="hidden"
            name="_subject"
            value="[Drum Sessions] New Feedback"
          />

          <div className="modal-footer">
            <div className="modal-hint">
              Your feedback goes directly to the developer
            </div>
            <button type="button" className="m-btn" onClick={onClose}>
              CANCEL
            </button>
            <button type="submit" className="m-btn primary">
              SEND FEEDBACK
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
