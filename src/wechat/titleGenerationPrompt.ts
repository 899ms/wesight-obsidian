import type { WeChatPreviewSnapshot } from './types';

const MAX_CONTEXT_CHARS = 6000;

export function buildTitleGenerationPrompt(
  snapshot: WeChatPreviewSnapshot,
  requirement: string,
  useCangheStyle: boolean,
): string {
  const currentTitle = snapshot.title.trim();
  const currentDigest = snapshot.digest.trim();
  let article = snapshot.markdown.trim();
  let truncated = false;
  if (article.length > MAX_CONTEXT_CHARS) {
    article = article.slice(0, MAX_CONTEXT_CHARS);
    truncated = true;
  }

  const sections: string[] = [
    '你是微信公众号爆款标题专家。请根据下面提供的文章内容，生成 5 个适合公众号传播的爆款标题。',
    '要求：',
    '- 只输出一个 JSON 数组，不要解释、不要代码围栏。',
    '- 数组长度必须恰好 5 个字符串。',
    '- 每个标题长度控制在 30 字以内，口语化、有传播力，避免夸张虚假宣传。',
  ];
  if (useCangheStyle) {
    sections.push(
      '本轮已启用“苍何同款爆款标题”，以下要求必须执行：',
      '- 先从正文判断能够成立的不平、反转爽感、焦虑避坑、对比落差或共鸣暖意。',
      '- 5 个标题中至少 3 个必须包含读者一眼能识别的情绪钩子，钩子放在前半句或明显转折位置。',
      '- 情绪钩子可以使用“凭什么”“太离谱了”“我终于”“原来”“千万别”“再不……就晚了”“同样……凭什么”“那一刻”等自然口语，也可使用同等强度的真实表达。',
      '- 只在句尾加“有点猛”“全变了”“回不去了”等口语结论，不计作情绪钩子。',
      '- 带情绪钩子的标题尽量控制在 20 字以内，并尽量覆盖 2～3 种情绪方向，避免重复同一句式。',
      '- 情绪、紧迫感、对比对象和个人经历必须有正文依据，不得虚构。',
    );
  }
  if (currentTitle) {
    sections.push(`当前标题（可作为参考）：${currentTitle}`);
  }
  if (currentDigest) {
    sections.push(`当前摘要（可作为参考）：${currentDigest}`);
  }
  if (requirement.trim()) {
    sections.push(`额外要求：${requirement.trim()}`);
  }
  sections.push('===== 文章内容 START =====');
  sections.push(article);
  if (truncated) {
    sections.push('（后文已省略）');
  }
  sections.push('===== 文章内容 END =====');
  sections.push('请输出 JSON 数组，例如：["标题1", "标题2", "标题3", "标题4", "标题5"]');
  return sections.join('\n');
}
