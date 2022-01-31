In this project I create css utility tailwindcss like css framework.
that provided css utility classes to quickly create Uniq UI Design without write separate css.


@apply directive to extract repeated utility patterns into custom CSS classes.

something like that...


```html
<div class="bg-primary text-info flex">
  <h1>H1 Tag</h1>
  <h2>H2 Tag</h2>
</div>
```

### @apply directive

```css
/* input.css */
/* @apply directive */

.bg {
  @apply bg-primary text-danger m-8 flex;
}
```


```css
/* output.css */
/* @apply directive */

.bg {
  background-color: #877EFF;
  color: #ff363c;
  margin: 2rem;
  display: flex
}


```

NB: This Project is Under Development. So there are missed a lot of implementation.