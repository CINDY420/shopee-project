Common progress bar:

```jsx
<ProgressBar
  used={100}
  capacity={200}
  status={'Healthy'}
  unit={'Bit'}
/>
```

Progress bar with style:

```jsx
<ProgressBar
  used={100}
  capacity={200}
  status={'Healthy'}
  unit={'Bit'}
  style={{ width: '12em' }}
/>
```

Progress bar with data format function:

```jsx
<ProgressBar
  used={100}
  capacity={200}
  status={'Healthy'}
  unit={'KBit'}
  formatDataFn={(num) => num/1000}
/>
```
