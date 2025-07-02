type TransformationTreeData = {
  id: number;
  parentId: number | null;
  [key: string]: any;
};

export function transformationTree<T extends TransformationTreeData>(
  data: T[],
  parentId: number | null,
): (T & { children: T[] })[] {
  return data
    .filter((dept) => dept.parentId === parentId)
    .sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0))
    .map((dept) => ({
      ...dept,
      children: transformationTree(data, dept.id),
    }));
}
