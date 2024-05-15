// vscode icon
import '@vscode/codicons/dist/codicon.css';

import {
  provideVSCodeDesignSystem,
  vsCodeButton,
  vsCodePanelTab,
  vsCodePanelView,
  vsCodePanels,
  vsCodeTextField,
  vsCodeDropdown,
  vsCodeOption,
  vsCodeProgressRing
} from '@vscode/webview-ui-toolkit';

provideVSCodeDesignSystem().register(
  vsCodeButton(),
  vsCodePanelTab(),
  vsCodePanelView(),
  vsCodePanels(),
  vsCodeTextField(),
  vsCodeDropdown(),
  vsCodeOption(),
  vsCodeProgressRing()
);
