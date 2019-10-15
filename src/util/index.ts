export function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function isRectEqual(r1, r2) {
  return (
    r1 &&
    r2 &&
    r1.left === r2.left &&
    r1.top === r2.top &&
    r1.width === r2.width &&
    r1.height === r2.height
  );
}
