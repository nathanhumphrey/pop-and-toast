export const popAndToast = {
  popup: {
    // defaults
    target: 'body', // where to insert
    el: null, // popup element, must init to build
    content: '', // modal content
    timeout: 0, // immediately
    refresh: 0, // always
    copy: '', // copy for clipboard on click
    defaultStyle: true, // set to false to implement custom style
    onClick: null, // content click callback
  },
  toast: {
    el: null, // toast element, must init to build
  },
  init: function (opts) {
    // only init once
    if (!_ready) {
      let _this = this; // for event listeners
      let last;

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
        localStorage.setItem(
          'popAndToast',
          JSON.stringify({ date: Date.now() })
        );

        // build required properties
        this.popup.el = createPopupEl(this.popup.content);

        // add close and copy listeners
        this.popup.el
          .querySelector('.pop__close')
          .addEventListener('click', (evt) => {
            document
              .querySelector(_this.popup.target)
              .removeChild(_this.popup.el);
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
      }

      // toast init
      if (this.popup.toast) {
        this.toastEl = document.createElement('div');

        this.toastEl.innerHTML = `
        <div class="toast-wrapper">Some text some message..</div>
      `;
      }
      _ready = true; // only init once
    }

    // return obj for chaining
    return this;
  },
  showPopup: function () {
    if (_showModal) {
      const _this = this;
      setTimeout(
        () =>
          requestAnimationFrame(() =>
            document.querySelector(_this.popup.target).firstElementChild
              ? document
                  .querySelector(_this.popup.target)
                  .insertBefore(
                    _this.popup.el,
                    document.querySelector(_this.popup.target).firstElementChild
                  )
              : document
                  .querySelector(_this.popup.target)
                  .append(_this.popup.el)
          ),
        this.popup.timeout
      );
    } else if (!_ready) {
      throw Error('PopAndToastError: must init before use.');
    }
  },
  showToast: function () {},
};

// encapsulated state vars
let _ready = false;
let _showModal = false;

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
  #snackbar {
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

  #snackbar.show {
    visibility: visible;
    -webkit-animation: fadein 0.5s, fadeout 0.5s 2.5s;
    animation: fadein 0.5s, fadeout 0.5s 2.5s;
  }

  @-webkit-keyframes fadein {
    from {bottom: 0; opacity: 0;} 
    to {bottom: 30px; opacity: 1;}
  }

  @keyframes fadein {
    from {bottom: 0; opacity: 0;}
    to {bottom: 30px; opacity: 1;}
  }

  @-webkit-keyframes fadeout {
    from {bottom: 30px; opacity: 1;} 
    to {bottom: 0; opacity: 0;}
  }

  @keyframes fadeout {
    from {bottom: 30px; opacity: 1;}
    to {bottom: 0; opacity: 0;}
  }
`;

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
