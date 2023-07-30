export const useInputQuestion = () => useState<string>('inputQuestion', () => '');
export const useIsChatOpened = () => useState<boolean>('isChatOpened', () => false);