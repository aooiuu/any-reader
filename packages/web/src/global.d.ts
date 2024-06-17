declare global {
  interface Window {
    vscode: any;
    acquireVsCodeApi: any;
    _acquireVsCodeApi: any;

    __vscode$initialize_page: string;

    // utools
    $AnyReader: any;
  }
}

export {};
