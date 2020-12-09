import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import classname from 'classnames';
import isEqual from 'lodash.isequal';
import CodeMirror, {
  EditorFromTextArea,
  EditorChangeLinkedList,
  ScrollInfo,
  EditorConfiguration,
  Editor,
} from 'codemirror';

type CodemirrorProps = {
  autoFocus?: boolean;
  className?: string;
  // @ts-ignore
  codeMirrorInstance?: any;
  defaultValue: string;
  name: string;
  onChange?: (value: string, options: EditorChangeLinkedList) => void;
  onCursorActivity?: (EditorFromTextArea: Editor) => void;
  onFocusChange?: (
    focused: boolean,
    instance: Editor,
    event: FocusEvent,
  ) => void;
  onScroll?: (scrollInfo: ScrollInfo) => void;
  options?: EditorConfiguration;
  path: string;
  value: string;
  preserveScrollPosition?: boolean;
};

const Codemirror: FunctionComponent<CodemirrorProps> = ({
  autoFocus,
  className,
  codeMirrorInstance = CodeMirror,
  name,
  path,
  defaultValue,
  options,
  preserveScrollPosition = false,
  value,
  children,
  onChange,
  onCursorActivity,
  onFocusChange,
  onScroll,
}) => {
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
    onFocusChange && onFocusChange(focused, instance, event);
  }
  function cursorActivity(cm: Editor) {
    onCursorActivity && onCursorActivity(cm);
  }
  function scrollChanged(cm: Editor) {
    onScroll && onScroll(cm.getScrollInfo());
  }
  function codemirrorValueChanged(
    instance: Editor,
    changeObj: EditorChangeLinkedList,
  ): void {
    // @ts-ignore
    if (onChange && instance.origin !== 'setValue') {
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
        return;
      }
      codeMirror.on('change', codemirrorValueChanged);
      codeMirror.on('cursorActivity', cursorActivity);
      codeMirror.on('focus', focusChanged.bind(null, true));
      codeMirror.on('blur', focusChanged.bind(null, false));
      codeMirror.on('scroll', scrollChanged);
      codeMirror.setValue(defaultValue || value || '');
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
  }, [textareaNode.current, defaultValue, value]);
  useEffect(
    function () {
      const codeMirror = codemirrorInstance.current;
      if (!codeMirror) {
        return;
      }
      if (preserveScrollPosition) {
        const prevScrollPosition = codeMirror.getScrollInfo();
        codeMirror.setValue(value);
        codeMirror.scrollTo(prevScrollPosition.left, prevScrollPosition.top);
      } else {
        codeMirror.setValue(value);
      }
      if (typeof options === 'object') {
        Object.entries(options).forEach(([optionName, optionValue]) =>
          // @ts-ignore
          setOptionIfChanged(optionName, optionValue),
        );
      }
    },
    [value, JSON.stringify(options)],
  );

  return (
    <div className={editorClassName}>
      <textarea
        ref={(ref) => {
          textareaNode.current = ref;
        }}
        name={name || path}
        defaultValue={value}
        autoComplete="off"
        autoFocus={autoFocus}
      />
    </div>
  );
};

export { Codemirror };