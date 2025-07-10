import fs from 'fs';

export function transformPdfData(data: string[]) {
  // 通过 标签名 'HART 标签名称' 进行分组
  const indexes = data
    .map((item, index) =>
      ['HART 标签名称', 'HART Tag Name'].includes(item) ? index : -1,
    )
    .filter((index) => index !== -1);

  const result = indexes.map((start, i) => {
    const end = indexes[i + 1] ?? data.length;
    return data.slice(start - 3, end - 3);
  });
  const pdfName = `pdf-${Date.now()}.json`;
  console.log('PDF解析结果', pdfName);
  fs.writeFileSync(pdfName, JSON.stringify(result, null, 2));
}
