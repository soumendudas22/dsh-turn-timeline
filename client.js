/**
 * Turn Timeline for DeepSeek Harness — client half.
 *
 * A stylesheet-only skin over the shipped Chat renderers: no slot is replaced,
 * so grouping, folding, find-in-page and per-tool views keep their shipped
 * behaviour. Selectors target stable `data-*` hooks only (CSS-module class
 * names are hashed and not addressable).
 *
 *  - Timeline rail + status dots on every process group body
 *    ([data-step-process-content]) — reasoning, tool calls, sub-agents.
 *  - Calm padded surfaces around process groups and turn triggers.
 *
 * Colours come from theme tokens only (--dsw-alias-*, re-exported as --tl-*).
 * No motion apart from a short dot colour transition, which
 * prefers-reduced-motion disables.
 */
(() => {
  'use strict';

  const PLUGIN_ID = '@soumendudas22/dsh-turn-timeline';

  window.__ModuleLoader__.load({
    id: PLUGIN_ID,
    factory() {
      const CSS = String.raw`
/* Resolve aliases where body theme tokens and content font settings exist. */
[data-step-process] {
  --tl-rail: var(--dsw-alias-border-l2);
  --tl-dot-idle: var(--dsw-alias-label-caption);
  --tl-dot-done: var(--dsw-alias-label-tertiary);
  --tl-dot-live: var(--dsw-alias-label-deep-diving);
  --tl-dot-error: var(--dsw-alias-state-error-primary);
  --tl-dot-stopped: var(--dsw-alias-state-warn-primary);
  --tl-dot-surface: var(--dsw-alias-bg-base);
  /* Vertical centre of a 24px process row at every font-size setting. */
  --tl-row-mid: calc(12px + var(--dsh-content-font-delta, 0px) / 2);
}

/* Searchable hidden roots retain their own box; only visible groups get a
   surface. Inner-body folding keeps the header surface and host fold timing. */
[data-step-process]:not([hidden]),
[data-turn-trigger] {
  padding: 12px;
  border-radius: var(--dsw-radius-lg, 16px);
  background: var(--dsw-alias-bg-layer-1);
  border: 0.5px solid var(--dsw-alias-border-l2);
}
[data-step-process]:not([hidden]) {
  box-sizing: border-box;
  min-width: 0;
}
[data-step-process] > [data-step-process-body] { --dsh-chat-flow-gap: 8px; }
[data-step-process] > div > button[data-process-activity] { line-height: 20px; }
/* ------------------------------------------------------------- rail */

[data-step-process-content] {
  position: relative;
  isolation: isolate;
}

[data-step-process-content]::before {
  content: '';
  position: absolute;
  z-index: 0;
  left: 7px;
  top: var(--tl-row-mid);
  bottom: var(--tl-row-mid);
  width: 1px;
  background: var(--tl-rail);
  pointer-events: none;
}

/* Members sit beside the rail; 22px = the host's leading box + gap rhythm. */
[data-step-process-content] > [data-chat-flow-kind] {
  position: relative;
  padding-left: 22px;
}

/* ------------------------------------------------------------- dots */

[data-step-process-content] > [data-chat-flow-kind]:not(:empty)::after {
  content: '';
  position: absolute;
  z-index: 0;
  left: 4px;
  top: calc(var(--tl-row-mid) - 3.5px);
  width: 7px;
  height: 7px;
  box-sizing: border-box;
  border-radius: 50%; corner-shape: round;
  border: 1.5px solid var(--tl-dot-done);
  background: var(--tl-dot-surface);
  pointer-events: none;
  transition: background-color 200ms ease, border-color 200ms ease;
}

/* Reasoning: a small solid step marker. */
[data-step-process-content] > [data-chat-flow-kind]:has([data-variant="think"])::after {
  left: 5px;
  top: calc(var(--tl-row-mid) - 2.5px);
  width: 5px;
  height: 5px;
  border: 0;
  background: var(--tl-dot-idle);
}

/* Preparing: hollow live ring while arguments stream. */
[data-step-process-content] > [data-chat-flow-kind]:has([data-state="preparing"])::after {
  border-color: var(--tl-dot-live);
}

/* Running (tool or streaming reasoning): solid live dot. */
[data-step-process-content] > [data-chat-flow-kind]:has([data-state="running"])::after {
  border-color: var(--tl-dot-live);
  background: var(--tl-dot-live);
}

/* Root call failed / interrupted (subcall states do not recolour the root). */
[data-step-process-content] > [data-chat-flow-kind="tool-call"]:has(> [data-slot] > [data-chat-call-id] > [data-slot] > [data-state="error"])::after {
  border-color: var(--tl-dot-error);
  background: var(--tl-dot-error);
}
[data-step-process-content] > [data-chat-flow-kind="tool-call"]:has(> [data-slot] > [data-chat-call-id] > [data-slot] > [data-state="stopped"])::after {
  border-color: var(--tl-dot-stopped);
  background: var(--tl-dot-stopped);
}

/* No plugin motion on high-frequency updates or disclosure actions. */
@media (prefers-reduced-motion: reduce) {
  [data-step-process-content] > [data-chat-flow-kind]::after { transition: none; }
}
`;

      return {
        apply(ctx) {
          ctx.effect(() => {
            // Drop a tag left behind by a previous mount (e.g. hot reload).
            for (const stale of document.querySelectorAll(`style[data-plugin="${PLUGIN_ID}"]`)) {
              stale.remove();
            }
            const tag = document.createElement('style');
            tag.dataset.plugin = PLUGIN_ID;
            tag.textContent = CSS;
            document.head.appendChild(tag);
            return () => tag.remove();
          }, 'turn-timeline: styles');
        },
      };
    },
  });
})();
