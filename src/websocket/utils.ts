export const frameHandler = (type: string, data: {}) => {
  return JSON.stringify({
    type,
    data: JSON.stringify(data),
    id: 0
  })
}

export function dataParser(data: string) {
  try {
    return JSON.parse(data);
  } catch {
    return 
  }
}