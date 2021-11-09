# Pop and Toast

![node.js workflow](https://github.com/nathanhumphrey/pop-and-toast/actions/workflows/node.js.yml/badge.svg)

## Purpose

Display a modal popup or a toast notification.

**TL;DR** - Check out the [demo](demo/popup.html).

## Usage

The helper is distributed as a const variable, so be sure to load it before accessing it directly in your main script:

```html
...
<script src="js/pop-and-toast.js"></script>
<script src="js/main.js"></script>
...
```

Initialize the `popAndToast` object before first use:

```js
popAndToast.init();
```

Initializing will build the required popup and toast elements, and assign the necessary event listeners. Options can be passed to the init method. The `options` parameter is an object with a property for `popup` and `toast`.

```js
popAndToast.init({
  popup: {
    /*popup options*/
  },
  toast: {
    /*toast options*/
  },
});
```

You can initialize with the default options (i.e. no argument), one of the options (i.e. popup or toast), or both.

You can display a modal popup by calling `showPopup()`:

```js
popAndToast.showPopup();
```

You can display a toast notification by calling `showToast()`:

```js
popAndToast.showToast();
```

All methods on the popAndToast object return the object reference, so you can chain calls.

```js
popAndToast.init().showPopup('<h2>Some Content</h2>');
```

## API

#### init([options])

Initializes the popAndToast object: creates the DOM elements for both popup and toast, assigns required event listeners, and provides a means for passing user options.

##### &lt;param&gt; {object} options

_User defined options for popup or toast_

###### {object} popup

The following are the supported popup options with default values:

- {string} `target`: 'body' - where to insert the popup element
- {string} `content`: '' - HTML modal content to be displayed
- {int} `refresh`: 0 - period in ms to wait before displaying the popup again (uses localStorage to set and check the period)
- {boolean} `defaultStyle`: true - set to false to implement custom external CSS (see source for available selectors)
- {function} `onClick`: null - content click callback, accepts no parameters
- {function} `onClose`: null - popup closed callback, accepts no parameters

###### {object} toast

The following are the supported toast options with default values:

- {string} `content`: '' - HTML toast content to be displayed
- {boolean} `defaultStyle`: true - set to false to implement custom external CSS (see source for available selectors)

#### showPopup([content])

Displays a modal popup in the window.

##### &lt;param&gt; {string} content

_Content to be displayed in the popup element_

#### closePopup()

Closes the popup modal.

#### showToast([content])

Displays a toast notification from the bottom of the window.

##### &lt;param&gt; {string} content

_Content to be displayed in the toast element_

### Popup and Toast CSS

There are default styles applied to both popup and toast elements. The styles can be overridden via external CSS (e.g. provide your own using the provided selectors). At this time, there is no way to programmatically update the styling. See the source for the default popup and toast styles.

## Future Features

- Allow for displaying toast until dismissed
- Allow for custom toast duration option (currently 3s)
