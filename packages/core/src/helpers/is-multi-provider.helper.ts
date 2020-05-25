export function isMultiProvider(provider: any): provider is { multi: boolean } {
  return typeof provider === 'object' && provider?.multi === true;
}
