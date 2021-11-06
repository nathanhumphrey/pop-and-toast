/**
 * @jest-environment jsdom
 */
const { expect } = require('@jest/globals');
let p; // isolate module

// TODO: mock localStorage

beforeEach(() => {
  jest.isolateModules(() => {
    let { popAndToast } = require('../src/pop-and-toast');
    p = popAndToast;
  });
  document.body.innerHTML = `<div class="test-div"></div>`;
  document.head.innerHTML = '';
});

describe('=== INIT TESTS', () => {
  test('init({ opts }) overrides defaults', () => {
    expect(p.popup.target).toEqual('body');
    expect(p.toast.defaultStyle).toEqual(true);

    p.init({
      popup: { target: 'foo' },
      toast: { defaultStyle: false },
    });

    expect(p.popup.target).toEqual('foo');
    expect(p.toast.defaultStyle).toEqual(false);
  });

  test('init() creates the popup element', () => {
    expect(p.popup.el).toBe(null);

    p.init();

    expect(p.popup.el).not.toBe(null);
    expect(p.popup.el.classList.contains('pop')).toEqual(true);
  });

  test('init() popup.content is correctly inserted', () => {
    p.init({ popup: { content: '<p>foo bar baz</p>' } });
    expect(p.popup.el.querySelector('.pop__content').innerHTML).toEqual(
      '<p>foo bar baz</p>'
    );
  });

  test('init() creates the toast element', () => {
    expect(p.toast.el).toBe(null);

    p.init();
    expect(p.toast.el).not.toBe(null);
    expect(p.toast.el.classList.contains('toast')).toEqual(true);
  });

  test('init() toast.content is correctly inserted', () => {
    p.init({ toast: { content: '<p>foo bar baz</p>' } });
    expect(p.toast.el.querySelector('.toast__content').innerHTML).toEqual(
      '<p>foo bar baz</p>'
    );
  });

  test('init() injects the default styles when required', () => {
    expect(document.head.querySelectorAll('style').length).toEqual(0);

    p.init();

    expect(document.head.querySelectorAll('style').length).toEqual(2);
  });

  test('init() skips injecting the default styles when required', () => {
    expect(document.head.querySelectorAll('style').length).toEqual(0);

    p.init({ popup: { defaultStyle: false }, toast: { defaultStyle: false } });

    expect(document.head.querySelectorAll('style').length).toEqual(0);
  });

  test('init() assigns popAndClose.closePopup() listener for .pop__close click', () => {
    jest.spyOn(p, 'closePopup');
    p.init();
    p.popup.el.querySelector('.pop__close').click();

    expect(p.closePopup).toHaveBeenCalledTimes(1);
  });

  test('init() assigns opts.popup.onClick() listener for .pop__content click', () => {
    const mock = jest.fn();
    p.init({
      popup: {
        onClick: mock,
      },
    });
    p.popup.el.querySelector('.pop__content').click();

    expect(mock).toHaveBeenCalledTimes(1);
  });
});

describe('=== POPUP TESTS', () => {
  beforeEach(() => {
    jest
      .spyOn(window, 'requestAnimationFrame')
      .mockImplementation((cb) => cb());
  });

  afterEach(() => {
    window.requestAnimationFrame.mockRestore();
  });

  test('must init() before first use', () => {
    expect(() => p.showPopup()).toThrowError(
      'PopAndToastError: must init before use.'
    );
    expect(() => p.closePopup()).toThrowError(
      'PopAndToastError: must init before use.'
    );

    expect(typeof p.init).toBe('function');
    p.init();

    expect(() => p.showPopup()).not.toThrowError(
      'PopAndToastError: must init before use.'
    );
    expect(() => p.closePopup()).not.toThrowError(
      'PopAndToastError: must init before use.'
    );
  });

  test('showPopup() inserts popup element into the body by default', () => {
    p.init();
    p.showPopup();

    expect(document.body.firstElementChild).toEqual(p.popup.el);
    expect(p.popup.closed).toEqual(false);
  });

  test('showPopup() inserts popup element into the desired target element', () => {
    p.init({ popup: { target: '.test-div' } });
    p.showPopup();

    expect(document.querySelector('.test-div').firstElementChild).toEqual(
      p.popup.el
    );
    expect(p.popup.closed).toEqual(false);
  });

  test('showPopup(content) content param is correctly inserted', () => {
    p.init({ popup: { content: '<p>foo</p>' } });
    p.showPopup('<p>bar</p>');

    expect(p.popup.el.querySelector('.pop__content').innerHTML).toEqual(
      '<p>bar</p>'
    );
  });

  test('closePopup() removes the popup element from the document', () => {
    p.init();
    document.body.appendChild(p.popup.el);
    p.popup.closed = false;

    expect(document.body.contains(p.popup.el)).toEqual(true);

    p.closePopup();

    expect(document.body.contains(p.popup.el)).toEqual(false);
  });

  test.skip('showPopup() refresh prevents popup element insertion', () => {
    expect(popAndToast).not.toBe(null);
  });
});

describe('=== TOAST TESTS', () => {
  test('must init() before first use', () => {
    expect(() => p.showToast()).toThrowError(
      'PopAndToastError: must init before use.'
    );

    expect(typeof p.init).toBe('function');
    p.init();

    expect(() => p.showToast()).not.toThrowError(
      'PopAndToastError: must init before use.'
    );
  });

  test.skip('showToast() inserts toast element into the document', () => {
    expect(popAndToast).not.toBe(null);
  });

  test('showToast(content) content param is correctly inserted', () => {
    p.init({ toast: { content: '<p>foo</p>' } });
    p.showToast('<p>bar</p>');

    expect(p.toast.el.querySelector('.toast__content').innerHTML).toEqual(
      '<p>bar</p>'
    );
  });

  test.skip('showToast() respects the desired duration', () => {});
});
