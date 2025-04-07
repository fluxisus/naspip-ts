export function biggerThanZero(value: string | number) {
  return parseFloat(value.toString()) > 0;
}

export function biggerThanOrEqualZero(value: string) {
  return parseFloat(value) >= 0;
}
