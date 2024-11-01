# react-fitter

In a project of mine I had to fit some text of unknown length to a container
without it wrapping. This utility component does exactly that, regardless of
whether if it sits inline, in a flexbox, grid or table. It just works.

> [!IMPORTANT]
> 
> At the moment the fitter can have some issues adjusting to containers that
> resize based on their content. A feeback loop occurs where the fitter never
> settles because the size changes with every change in font size. I have some
> ideas on how to fix this but haven't tried implemented any them yet. If this
> is an issue for your use case, please don't hesitate to open an issue.

```bash
npm install react-fitter
```

Usage:
```jsx
import { Fitter } from 'react-fitter'

// ...

<div className="my-text">
  <Fitter>
    This is some text that will perfectly fit in the container
  </Fitter>
</div>
```

And your CSS can be whatever you want. The Fitter component will never make the
text larger than what's set by your styles. It will only ever make it smaller.
```css
.my-text {
  width: 400px;
  font-size: 24px;
  border: 1px solid hotpink;
}
```

Which would look like this:

![Example with react-fitter](./docs/with-fitter.png)


In contrast to how it would look without react-fitter:

![Example without react-fitter](./docs/without-fitter.png)
