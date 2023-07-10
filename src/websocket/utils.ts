export const frameHandler = (type: string, data: {}) => {
  return JSON.stringify({
    type,
    data: JSON.stringify(data),
    id: 0
  })
}