import {
  CANGHE_TITLE_SKILL_PROMPT,
  resolveWeChatTitleSystemPrompt,
} from '../src/wechat/bundledCangheTitle';

describe('bundled Canghe title prompt', () => {
  test('only enables the bundled prompt for Canghe-style generation', () => {
    expect(resolveWeChatTitleSystemPrompt(false)).toBeUndefined();
    expect(resolveWeChatTitleSystemPrompt(true)).toBe(CANGHE_TITLE_SKILL_PROMPT);
  });
});
