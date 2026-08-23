import { resolveWeChatPreviewRefreshControlState } from '../src/ui/wechatPreviewRefresh';

describe('WeChat preview refresh control', () => {
  test('exposes an enabled refresh action while idle', () => {
    expect(resolveWeChatPreviewRefreshControlState(false, false)).toEqual({
      icon: 'refresh-cw',
      label: '刷新当前预览',
      disabled: false,
      loading: false,
    });
  });

  test('shows a disabled loading state while refreshing', () => {
    expect(resolveWeChatPreviewRefreshControlState(true, false)).toEqual({
      icon: 'loader-circle',
      label: '正在刷新当前预览',
      disabled: true,
      loading: true,
    });
  });

  test('disables refresh while another preview operation is running', () => {
    expect(resolveWeChatPreviewRefreshControlState(false, true).disabled).toBe(true);
  });
});
