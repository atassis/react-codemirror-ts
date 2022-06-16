import React, { useEffect, useRef, useState } from 'react';

import classname from 'classnames';
import CodeMirror, {
  EditorFromTextArea,
  ScrollInfo,
  EditorConfiguration,
  Editor,
  EditorChange,
} from 'codemirror';
import isEqual from 'fast-deep-equal';

export type CodemirrorProps = {
  autoFocus?: boolean;
  className?: string;
  codeMirrorInstance?: typeof CodeMirror;
  name?: string;
  onChange?: (value: string, options: EditorChange) => void;
  onCursorActivity?: (editor: Editor) => void;
  onFocusChange?: (
    focused: boolean,
    instance: Editor,
    event: FocusEvent,
  ) => void;
  onScroll?: (scrollInfo: ScrollInfo) => void;
  options?: EditorConfiguration;
  value?: string;
  preserveScrollPosition?: boolean;
};

export const Codemirror = (props: CodemirrorProps) => {
  const {
    autoFocus,
    className,
    codeMirrorInstance = CodeMirror,
    name,
    options,
    onChange,
    onCursorActivity,
    onFocusChange,
    onScroll,
    preserveScrollPosition = false,
    value = '',
  } = props;
  const codemirrorInstance = useRef<EditorFromTextArea | null>(null);
  const [isFocused, setFocused] = useState<boolean>(false);
  const textareaNode = useRef<HTMLTextAreaElement | null>(null);
  const editorClassName = classname(
    'ReactCodeMirror',
    isFocused ? 'ReactCodeMirror--focused' : null,
    className,
  );

  function setOptionIfChanged(
    optionName: keyof EditorConfiguration,
    newValue: EditorConfiguration[keyof EditorConfiguration],
  ) {
    const codeMirror = codemirrorInstance.current;
    if (!codeMirror) {
      return;
    }
    const oldValue = codeMirror.getOption(optionName);
    if (!isEqual(oldValue, newValue)) {
      codeMirror.setOption(optionName, newValue);
    }
  }
  function focusChanged(focused: boolean, instance: Editor, event: FocusEvent) {
    setFocused(focused);
    if (onFocusChange) {
      onFocusChange(focused, instance, event);
    }
  }
  function cursorActivity(cm: Editor) {
    if (onCursorActivity) {
      onCursorActivity(cm);
    }
  }
  function scrollChanged(cm: Editor) {
    if (onScroll) {
      onScroll(cm.getScrollInfo());
    }
  }
  function codemirrorValueChanged(
    instance: Editor,
    changeObj: EditorChange,
  ): void {
    if (onChange && changeObj.origin !== 'setValue') {
      onChange(instance.getValue(), changeObj);
    }
  }
  useEffect(() => {
    if (textareaNode.current instanceof HTMLTextAreaElement) {
      codemirrorInstance.current = codeMirrorInstance.fromTextArea(
        textareaNode.current,
        options,
      );
      const codeMirror = codemirrorInstance.current;
      if (!codeMirror) {
        return () => null;
      }
      codeMirror.on('change', codemirrorValueChanged);
      codeMirror.on('cursorActivity', cursorActivity);
      codeMirror.on('focus', focusChanged.bind(null, true));
      codeMirror.on('blur', focusChanged.bind(null, false));
      codeMirror.on('scroll', scrollChanged);
    }
    return () => {
      const codeMirror = codemirrorInstance.current;
      if (!codeMirror) {
        return;
      }
      if (codeMirror) {
        codeMirror.toTextArea();
      }
    };
  }, [textareaNode.current]);

  useEffect(() => {
    const codeMirror = codemirrorInstance.current;
    if (!codeMirror) {
      return;
    }
    codeMirror.setValue(value);
  }, [value]);

  useEffect(() => {
    const codeMirror = codemirrorInstance.current;
    if (!codeMirror) {
      return;
    }
    if (preserveScrollPosition) {
      const prevScrollPosition = codeMirror.getScrollInfo();
      codeMirror.setValue(value);
      codeMirror.scrollTo(prevScrollPosition.left, prevScrollPosition.top);
    }
    if (typeof options === 'object') {
      Object.entries(options).forEach(([optionName, optionValue]) =>
        // @ts-ignore
        setOptionIfChanged(optionName, optionValue),
      );
    }
  }, [value, JSON.stringify(options)]);

  return (
    <div className={editorClassName}>
      <textarea
        ref={textareaNode}
        name={name}
        defaultValue={value}
        autoComplete="off"
        autoFocus={autoFocus}
      />
    </div>
  );
};
