export interface WordDictionaryGateway {
  isValid(word: string): Promise<boolean>;
}
