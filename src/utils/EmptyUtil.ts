export function isEmpty(str: string | null | undefined) {
  if (str === null || str === undefined || str === "") {
    return true;
  }
  return false;
}
