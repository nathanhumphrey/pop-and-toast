/**
 * The popAndToast object allows for displaying a modal popup or toast
 * notification in the browser.
 *
 * @author Nathan Humphrey
 */
const popAndToast = (() => {
  const obj = {
    popup: {
      // defaults
      target: 'body', // where to insert
      el: null, // popup element, must init to build
      content: '', // modal content
      refresh: 0, // always
      defaultStyle: true, // set to false to implement custom style
      onClick: null, // content click callback
      onClose: null, // popup closed callback
      closed: true, // closed state
    },
    toast: {
      content: '', // toast content
      duration: 3000, // duration to show the toast message
      el: null, // toast element, must init to build
      defaultStyle: true, // set to false to implement custom style
    },
    /**
     * Initialize the popAndToast object for first use.
     * @param {object} options - User-defined options for popup and
     * toast.
     * @returns {object} The initialized popAndToast object.
     */
    init: function (options) {
      // only init once
      if (!_ready) {
        // prep popup and toast options
        if (options) {
          Object.assign(this.popup, options.popup || {});
          Object.assign(this.toast, options.toast || {});
        }

        //--> begin popup init
        this.popup.el = createPopupEl(this.popup.content);

        // add close listener
        this.popup.el
          .querySelector('.pop__close')
          .addEventListener('click', (evt) => {
            this.closePopup();
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

        //--> begin toast init
        this.toast.el = createToastEl(this.toast.content);

        // check for and inject default style
        if (this.toast.defaultStyle) {
          const style = document.createElement('style');
          style.innerHTML = toastStyle;
          document.head.appendChild(style);
        }

        _ready = true;
      }

      return this;
    },
    /**
     * Reveals a modal popup on the screen.
     * @param {string=} content - String value for the innerHTML of
     * the popup element.
     * @returns {object} The popAndToast object.
     */
    showPopup: function (content) {
      if (_ready) {
        let last;
        _showModal = true;

        // check for last showing
        if ((last = localStorage.getItem('popAndToast'))) {
          last = +JSON.parse(last).date;

          // check refresh period for last shown
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

          if (content) {
            this.popup.el.querySelector('.pop__content').innerHTML = content;
          }

          requestAnimationFrame(() =>
            document.querySelector(this.popup.target).firstElementChild
              ? document
                  .querySelector(this.popup.target)
                  .insertBefore(
                    this.popup.el,
                    document.querySelector(this.popup.target).firstElementChild
                  )
              : document.querySelector(this.popup.target).append(this.popup.el)
          );

          this.popup.closed = false;
        }
      } else {
        throw Error('PopAndToastError: must init before use.');
      }
      return this;
    },
    /**
     * Removes the popup element from the document and calls the
     * onClose callback if assigned.
     * @returns {object} The popAndToast object.
     */
    closePopup: function () {
      if (_ready) {
        if (!this.popup.closed) {
          this.popup.el.remove();
          this.popup.closed == true;

          if (this.popup.onClose) {
            this.popup.onClose();
          }
        }
      } else {
        throw Error('PopAndToastError: must init before use.');
      }
      return this;
    },
    /**
     * Reveals a toast notification on the screen. Duration for toast
     * notification is 3 seconds by default.
     * @param {string=} content - String value for the innerHTML of
     * the toast element.
     * @returns {object} The popAndToast object.
     */
    showToast: function (content) {
      if (_ready) {
        if (content) {
          this.toast.el.querySelector('.toast__content').innerHTML = content;
        }

        document.body.append(this.toast.el);
        this.toast.el.classList.add('toast-show');

        setTimeout(() => {
          requestAnimationFrame(() => {
            this.toast.el.classList.remove('toast-show');
            this.toast.el.remove();
          });
        }, this.toast.duration);
      } else {
        throw Error('PopAndToastError: must init before use.');
      }
      return this;
    },
  };

  /**
   * Tracks popAndToast initialization. The popAndToast object can
   * only be initialized once.
   * @private
   */
  let _ready = false;
  /**
   * Determines whether the modal should be displayed. This variable
   * is updated based on the refresh period that has been set.
   * @private
   */
  let _showModal = false;

  // helper functions

  /**
   * Creates the DOM element for the popup modal.
   * @param {string} content - String value for the innerHTML of
   * the popup element.
   * @returns {HTMLDivElement} HTMLDivElement for popup.
   * @private
   */
  const createPopupEl = (content) => {
    const el = document.createElement('div');
    el.classList.add('pop');
    el.innerHTML = `
    <div class="pop__wrapper">
      <div class="pop__close">
        <a href="#" aria-label="Close Modal Popup">&times;</a>
      </div>
      <div class="pop__content">${content}</div>
    </div>`;
    return el;
  };

  /**
   * Creates the DOM element for the toast notification.
   * @param {string} content - String value for the innerHTML of
   * the toast element.
   * @returns {HTMLDivElement} HTMLDivElement for toast
   * @private
   */
  const createToastEl = (content) => {
    const el = document.createElement('div');
    el.className = 'toast';
    el.innerHTML = `
    <div class="toast__wrapper">
      <div class="toast__content">${content}</div>
    </div>`;
    return el;
  };

  // default CSS styling for popup and toast

  /**
   * Default styling for the popup element.
   * @private
   */
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
  }`;

  /**
   * Default styling for the toast element.
   * @private
   */
  const toastStyle = `
  .toast {
    visibility: hidden;
    display: flex;
    justify-content: center;
    width: 100%;
    color: #fff;
    text-align: center;
    position: fixed;
    z-index: 1;
    bottom: 30px;
  }

  .toast.toast-show {
    visibility: visible;
    animation: toast-fadein 0.5s, toast-fadeout 0.5s 2.5s;
  }

  .toast__wrapper {
    background-color: #666;
    border-radius: 8px;
    padding: 16px;
    min-width: 250px;
  }

  @keyframes toast-fadein {
    from {bottom: 0; opacity: 0;}
    to {bottom: 30px; opacity: 1;}
  }

  @keyframes toast-fadeout {
    from {bottom: 30px; opacity: 1;}
    to {bottom: 0; opacity: 0;}
  }`;

  return obj;
})();

if (typeof exports != 'undefined') {
  exports.popAndToast = popAndToast;
}
