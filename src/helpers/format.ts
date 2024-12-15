export function format(template: string, ...args: unknown[]): string {
  let result = template;

  args.forEach((arg, i) => {
    result = result.replace(`{${i}}`, String(arg));
  });

  return result;
}