interface VirtualKeyboard extends EventTarget {
  readonly boundingRect: DOMRect;
  overlaysContent: boolean;
  show(): void;
  hide(): void;
  ongeometrychange: ((this: VirtualKeyboard, ev: Event) => unknown) | null;
}

declare global {
  interface Navigator {
    readonly virtualKeyboard?: VirtualKeyboard;
  }

  namespace React {
    interface InputHTMLAttributes<T> {
      virtualkeyboardpolicy?: 'auto' | 'manual';
    }
  }
}

export {};
