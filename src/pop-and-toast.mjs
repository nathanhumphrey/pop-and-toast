export const popAndToast = {
  popup: {
    // defaults
    target: 'body', // where to insert
    el: null, // popup element, must init to build
    content: '', // modal content
    refresh: 0, // always
    defaultStyle: true, // set to false to implement custom style
    onClick: null, // content click callback
    closed: true, // closed state
  },
  toast: {
    content: '', // modal content
    duration: 3000, // duration to show the toast message
    el: null, // toast element, must init to build
    defaultStyle: true, // set to false to implement custom style
  },
  init: function (opts) {
    // only init once
    if (!_ready) {
      let _this = this; // for event listeners

      // prep popup and toast options
      if (opts) {
        opts.popup = opts.popup || {};
        opts.toast = opts.toast || {};

        // mixin/override options
        for (const [key, value] of Object.entries(opts.popup)) {
          this.popup[key] = value;
        }

        for (const [key, value] of Object.entries(opts.toast)) {
          this.toast[key] = value;
        }
      }

      // popup init
      this.popup.el = createPopupEl(this.popup.content);

      // add close and copy listeners
      this.popup.el
        .querySelector('.pop__close')
        .addEventListener('click', (evt) => {
          _this.closePopup();
        });

      // check for content click callback
      if (this.popup.onClick) {
        this.popup.el
          .querySelector('.pop__content')
          .addEventListener('click', this.popup.onClick);
      }

      // check for and inject default style
      if (this.popup.defaultStyle) {
        const style = document.createElement('style');
        style.innerHTML = popupStyle;
        document.head.appendChild(style);
      }

      // toast init
      this.toast.el = createToastEl(this.toast.content);

      // check for and inject default style
      if (this.toast.defaultStyle) {
        const style = document.createElement('style');
        style.innerHTML = toastStyle;
        document.head.appendChild(style);
      }

      _ready = true; // only init once
    }

    // return obj for chaining
    return this;
  },
  showPopup: function (content) {
    let last;
    _showModal = true;

    // check for previous popup showing
    if ((last = localStorage.getItem('popAndToast'))) {
      last = +JSON.parse(last).date;

      // check refresh period for last shown date
      if (Date.now() - last <= this.popup.refresh) {
        console.info('PopAndToastInfo: too soon to show popup again.');
        _showModal = false;
      }
    }

    if (_showModal) {
      // set/update the last shown date
      localStorage.setItem('popAndToast', JSON.stringify({ date: Date.now() }));

      const _this = this;

      if (content) {
        this.popup.el.querySelector('.pop__content').innerHTML = content;
      }

      requestAnimationFrame(() =>
        document.querySelector(_this.popup.target).firstElementChild
          ? document
              .querySelector(_this.popup.target)
              .insertBefore(
                _this.popup.el,
                document.querySelector(_this.popup.target).firstElementChild
              )
          : document.querySelector(_this.popup.target).append(_this.popup.el)
      );

      this.popup.closed = false;
    } else if (!_ready) {
      throw Error('PopAndToastError: must init before use.');
    }
    return this;
  },
  closePopup: function () {
    if (!this.popup.closed) {
      document.querySelector(this.popup.target).removeChild(this.popup.el);
      this.popup.closed == true;
    }
    return this;
  },
  showToast: function (content) {
    if (_ready) {
      const _this = this;

      if (content) {
        this.toast.el.querySelector('.toast__content').innerHTML = content;
      }

      document.body.append(_this.toast.el);

      setTimeout(() => {
        requestAnimationFrame(() => {
          _this.toast.el.classList.remove('toast-show');
        });
      }, this.toast.duration);
    } else {
      throw Error('PopAndToastError: must init before use.');
    }
    return this;
  },
};

// encapsulated state vars
let _ready = false;
let _showModal = false;

// helper functions
const createPopupEl = (content) => {
  const el = document.createElement('div');
  el.classList.add('pop');
  el.innerHTML = `
    <div class="pop__wrapper">
    <div class="pop__close">
        <a href="#" aria-label="Close Modal Popup">&times;</a>
    </div>
    <div class="pop__content">
        ${content}
    </div>
    </div>`;
  return el;
};

const createToastEl = (content) => {
  const el = document.createElement('div');
  el.className = 'toast toast-show';
  el.innerHTML = `
    <div class="toast__content">
        ${content}
    </div>`;
  return el;
};

// default CSS styling for popup and toast
const popupStyle = `
.pop {
      z-index: 10000;
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background-color: rgba(0, 0, 0, 0.7);
      display: flex;
      align-items: start;
      justify-content: center;
  }

  .pop__wrapper {
      box-sizing: border-box;
      margin-top: 10vh;
      max-width: 600px;
      width: 90vw;

  }

  .pop__content {
    border-radius: .5rem;
    padding: 1rem;
    background-color: white;
  }

  .pop__content img {
      width: 100%;
      border-radius: .5rem;
  }

  .pop__content h2 {
      margin: 0;
      padding: 0;
  }

  .pop__close {
      position: relative;
      display: flex;
      justify-content: flex-end;
      font-weight: bold;
      font-size: 2rem;
  }

  .pop__close a {
      color: white;
      text-decoration: none;
      padding: .25rem .5rem;
  }
`;

const toastStyle = `
  .toast {
    visibility: hidden;
    min-width: 250px;
    margin-left: -125px;
    background-color: #333;
    color: #fff;
    text-align: center;
    border-radius: 2px;
    padding: 16px;
    position: fixed;
    z-index: 1;
    left: 50%;
    bottom: 30px;
    font-size: 17px;
  }

  .toast.toast-show {
    visibility: visible;
    -webkit-animation: toast-fadein 0.5s, toast-fadeout 0.5s 2.5s;
    animation: toast-fadein 0.5s, toast-fadeout 0.5s 2.5s;
  }

  @-webkit-keyframes toast-fadein {
    from {bottom: 0; opacity: 0;} 
    to {bottom: 30px; opacity: 1;}
  }

  @keyframes toast-fadein {
    from {bottom: 0; opacity: 0;}
    to {bottom: 30px; opacity: 1;}
  }

  @-webkit-keyframes toast-fadeout {
    from {bottom: 30px; opacity: 1;} 
    to {bottom: 0; opacity: 0;}
  }

  @keyframes toast-fadeout {
    from {bottom: 30px; opacity: 1;}
    to {bottom: 0; opacity: 0;}
  }
`;
