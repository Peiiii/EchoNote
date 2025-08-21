
```tsx
import { ZenmarkEditor } from "zenmark-editor";
import { markdownExample } from "./markdown-example";
// import { markdownExampleZh } from "./markdown-example.zh";
import { useState } from "react";
function App() {
  const [content, setContent] = useState(markdownExample);
  const [listeners, setListeners] = useState<((content: string) => void)[]>([]);
  const onChange = (content: string) => {
    setContent(content);
    listeners.forEach((listener) => listener(content));
  };
  return (
    <ZenmarkEditor
      readContent={() => Promise.resolve(content)}
      writeContent={(content) => {
        onChange(content);
        return Promise.resolve();
      }}
      subscribeContent={(cb) => {
        setListeners((listeners) => [...listeners, cb]);
        return () => {
          setListeners((listeners) => listeners.filter((l) => l !== cb));
        };
      }}
    />
  );
}

export default App;

```