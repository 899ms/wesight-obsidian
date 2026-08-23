export interface WeChatPreviewRefreshControlState {
  icon: 'loader-circle' | 'refresh-cw';
  label: string;
  disabled: boolean;
  loading: boolean;
}

export function resolveWeChatPreviewRefreshControlState(
  refreshing: boolean,
  blocked: boolean,
): WeChatPreviewRefreshControlState {
  return {
    icon: refreshing ? 'loader-circle' : 'refresh-cw',
    label: refreshing ? '正在刷新当前预览' : '刷新当前预览',
    disabled: refreshing || blocked,
    loading: refreshing,
  };
}
