/**
 * 读取文件
 * @param file
 * @returns
 */
export function readFile(file: Blob): Promise<any[]> {
  if (file.type !== 'application/json') return Promise.resolve([]);
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsText(file, 'UTF-8');
    reader.onload = function (e) {
      let data = [];
      try {
        data = JSON.parse(e!.target!.result as string);
      } catch (error) {
        console.warn(error);
      }
      resolve(data);
    };
  });
}
