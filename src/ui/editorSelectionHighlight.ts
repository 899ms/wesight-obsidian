import { StateEffect, StateField, type Extension } from '@codemirror/state';
import { Decoration, EditorView, ViewPlugin, type DecorationSet } from '@codemirror/view';

export interface EditorSelectionHighlightRange {
  from: number;
  to: number;
}

const editorViews = new WeakMap<HTMLElement, EditorView>();
const setEditorSelectionHighlightEffect = StateEffect.define<EditorSelectionHighlightRange | null>({
  map: (value, changes) => value
    ? {
      from: changes.mapPos(value.from),
      to: changes.mapPos(value.to),
    }
    : null,
});

const editorSelectionHighlightField = StateField.define<DecorationSet>({
  create: () => Decoration.none,
  update: (decorations, transaction) => {
    let next = decorations.map(transaction.changes);
    for (const effect of transaction.effects) {
      if (!effect.is(setEditorSelectionHighlightEffect)) continue;
      const range = effect.value;
      next = range && range.from < range.to
        ? Decoration.set([
          Decoration.mark({ class: 'wesight-editor-selection-highlight' })
            .range(range.from, range.to),
        ])
        : Decoration.none;
    }
    return next;
  },
  provide: field => EditorView.decorations.from(field),
});

const editorViewRegistry = ViewPlugin.fromClass(class {
  constructor(private readonly view: EditorView) {
    editorViews.set(view.dom, view);
  }

  destroy(): void {
    editorViews.delete(this.view.dom);
  }
});

export const editorSelectionHighlightExtension: Extension = [
  editorSelectionHighlightField,
  editorViewRegistry,
];

export function resolveEditorSelectionHighlightRange(
  selection: string,
  from: number,
  to: number,
  contextVisible: boolean,
  chatVisible: boolean,
): EditorSelectionHighlightRange | null {
  if (!chatVisible || !contextVisible || !selection.trim() || from >= to) return null;
  return { from, to };
}

export function setEditorSelectionHighlight(
  markdownViewContainer: HTMLElement,
  range: EditorSelectionHighlightRange | null,
): boolean {
  const editorDom = markdownViewContainer.querySelector<HTMLElement>('.cm-editor');
  const editorView = editorDom ? editorViews.get(editorDom) : null;
  if (!editorView) return false;

  const docLength = editorView.state.doc.length;
  const clampedRange = range
    ? {
      from: Math.max(0, Math.min(range.from, docLength)),
      to: Math.max(0, Math.min(range.to, docLength)),
    }
    : null;
  editorView.dispatch({
    effects: setEditorSelectionHighlightEffect.of(
      clampedRange && clampedRange.from < clampedRange.to ? clampedRange : null,
    ),
  });
  return true;
}
