# react-codemirror-ts

[![npm][npm]][npm-url]
[![node][node]][node-url]
[![deps][deps]][deps-url]
[![licenses][licenses]][licenses-url]
[![downloads][downloads]][downloads-url]
[![size][size]][size-url]

> Codemirror react wrapper made with typescript


### Installation
```shell
npm i react-codemirror-ts
```

### Usage
```typescript jsx
import { Codemirror } from 'react-codemirror-ts';
import React, { useState } from 'react';

import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/lib/codemirror.css';

function CodemirrorExample() {
  const [value, setValue] = useState<string>('');
  return (
    <Codemirror
      defaultValue=""
      value=""
      name="example"
      path="example"
      options={{
        lineNumbers: true,
        lineWrapping: true,
        matchBrackets: true,
        mode: 'javascript',
        tabSize: 2,
      }}
      onChange={(value, options) => {
        setValue(value);
      }}
    />
  );
}

export { CodemirrorExample };
```

### License

> Refer to [LICENSE](LICENSE) file

[npm]: https://img.shields.io/npm/v/react-codemirror-ts.svg
[npm-url]: https://npmjs.com/package/react-codemirror-ts
[node]: https://img.shields.io/node/v/react-codemirror-ts.svg
[node-url]: https://nodejs.org
[deps]: https://img.shields.io/david/atassis/react-codemirror-ts.svg
[deps-url]: https://david-dm.org/atassis/react-codemirror-ts
[licenses-url]: http://opensource.org/licenses/MIT
[licenses]: https://img.shields.io/npm/l/react-codemirror-ts.svg
[downloads-url]: https://npmcharts.com/compare/react-codemirror-ts?minimal=true
[downloads]: https://img.shields.io/npm/dm/react-codemirror-ts.svg
[size-url]: https://packagephobia.com/result?p=react-codemirror-ts
[size]: https://packagephobia.com/badge?p=react-codemirror-ts
