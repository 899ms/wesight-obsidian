import { resolveEditorSelectionHighlightRange } from '../src/ui/editorSelectionHighlight';

describe('editor selection highlight', () => {
  test('keeps a visible selection while the matching context and chat are visible', () => {
    expect(resolveEditorSelectionHighlightRange('selected text', 12, 25, true, true)).toEqual({
      from: 12,
      to: 25,
    });
  });

  test('does not highlight empty or unrelated editor selections', () => {
    expect(resolveEditorSelectionHighlightRange('   ', 12, 25, true, true)).toBeNull();
    expect(resolveEditorSelectionHighlightRange('selected text', 12, 25, false, true)).toBeNull();
  });

  test('removes the highlight when the chat view is hidden', () => {
    expect(resolveEditorSelectionHighlightRange('selected text', 12, 25, true, false)).toBeNull();
  });

  test('ignores collapsed or reversed editor ranges', () => {
    expect(resolveEditorSelectionHighlightRange('selected text', 12, 12, true, true)).toBeNull();
    expect(resolveEditorSelectionHighlightRange('selected text', 25, 12, true, true)).toBeNull();
  });
});
