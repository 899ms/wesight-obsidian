import { buildTitleGenerationPrompt } from '../src/wechat/titleGenerationPrompt';
import type { WeChatPreviewSnapshot } from '../src/wechat/types';

function createSnapshot(markdown = 'PixVerse R2 让用户走进可互动的 AI 世界。'): WeChatPreviewSnapshot {
  return {
    sourcePath: 'PixVerse R2.md',
    title: 'PixVerse R2 发布',
    author: '',
    digest: '一个能走进去的 AI 世界',
    contentSourceUrl: '',
    markdown,
    contentHash: 'content-hash',
    themeSourceHash: 'theme-hash',
    assets: [],
    warnings: [],
    thumbMediaId: '',
    coverAssetToken: null,
    rendererVersion: 'canghe-style-wechat-v2',
  };
}

describe('buildTitleGenerationPrompt', () => {
  test('adds explicit emotional-hook constraints only for Canghe-style generation', () => {
    const snapshot = createSnapshot();
    const regularPrompt = buildTitleGenerationPrompt(snapshot, '', false);
    const canghePrompt = buildTitleGenerationPrompt(snapshot, '', true);

    expect(regularPrompt).not.toContain('本轮已启用“苍何同款爆款标题”');
    expect(canghePrompt).toContain('至少 3 个必须包含读者一眼能识别的情绪钩子');
    expect(canghePrompt).toContain('钩子放在前半句或明显转折位置');
    expect(canghePrompt).toContain('不计作情绪钩子');
  });

  test('preserves article context and trims the optional requirement', () => {
    const prompt = buildTitleGenerationPrompt(createSnapshot(), '  突出世界模型  ', true);

    expect(prompt).toContain('当前标题（可作为参考）：PixVerse R2 发布');
    expect(prompt).toContain('额外要求：突出世界模型');
    expect(prompt).toContain('PixVerse R2 让用户走进可互动的 AI 世界。');
  });
});
