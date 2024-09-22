// https://developer.mozilla.org/zh-CN/docs/Web/API/Window/queryLocalFonts
type FontData = {
  family: string;
  fullName: string;
  postscriptName: string;
  style: string;
};

declare global {
  interface Window {
    // vscode
    vscode: any;
    acquireVsCodeApi: any;
    _acquireVsCodeApi: any;
    __vscode$initialize_page: string;

    // utools
    $AnyReader: any;

    queryLocalFonts: () => Promise<FontData[]>;
  }
}

export {};
