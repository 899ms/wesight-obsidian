import {
  resolveWeChatPreviewRefreshControlState,
  resolveWeChatPreviewSourcePath,
  WeChatPreviewRequestCoordinator,
} from '../src/ui/wechatPreviewRefresh';

describe('WeChat preview refresh control', () => {
  test('exposes an enabled refresh action while idle', () => {
    expect(resolveWeChatPreviewRefreshControlState(false, false)).toEqual({
      icon: 'refresh-cw',
      label: '刷新左侧当前文件预览',
      disabled: false,
      loading: false,
    });
  });

  test('shows a disabled loading state while refreshing', () => {
    expect(resolveWeChatPreviewRefreshControlState(true, false)).toEqual({
      icon: 'loader-circle',
      label: '正在刷新左侧当前文件预览',
      disabled: true,
      loading: true,
    });
  });

  test('disables refresh while another preview operation is running', () => {
    expect(resolveWeChatPreviewRefreshControlState(false, true).disabled).toBe(true);
  });

  test('refreshes the active Markdown file instead of the stale preview file', () => {
    expect(resolveWeChatPreviewSourcePath(
      'articles/b.md',
      'articles/b.md',
      'articles/a.md',
      'articles/a.md',
    )).toBe('articles/b.md');
  });

  test('uses the most recently active file after focus moves to the preview', () => {
    expect(resolveWeChatPreviewSourcePath(
      null,
      'articles/b.md',
      'articles/b.md',
      'articles/a.md',
    )).toBe('articles/b.md');
  });

  test('falls back to the tracked editor file when Obsidian has no active file', () => {
    expect(resolveWeChatPreviewSourcePath(
      null,
      null,
      'articles/b.md',
      'articles/a.md',
    )).toBe('articles/b.md');
  });

  test('commits only the latest request during rapid A to B to C switching', () => {
    const coordinator = new WeChatPreviewRequestCoordinator();
    const requestA = coordinator.begin('articles/a.md');
    const requestB = coordinator.begin('articles/b.md');
    const requestC = coordinator.begin('articles/c.md');

    expect(coordinator.isCurrent(requestA)).toBe(false);
    expect(coordinator.isCurrent(requestB)).toBe(false);
    expect(coordinator.isCurrent(requestC)).toBe(true);
  });

  test('does not let an older completion clear the latest pending file', () => {
    const coordinator = new WeChatPreviewRequestCoordinator();
    const requestA = coordinator.begin('articles/a.md');
    const requestB = coordinator.begin('articles/b.md');

    coordinator.finish(requestA);

    expect(coordinator.isPending('articles/b.md')).toBe(true);
    expect(coordinator.isCurrent(requestB)).toBe(true);
  });
});
