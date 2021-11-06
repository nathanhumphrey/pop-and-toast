const popAndToast=(()=>{var t={popup:{target:"body",el:null,content:"",refresh:0,defaultStyle:!0,onClick:null,onClose:null,closed:!0},toast:{content:"",duration:3e3,el:null,defaultStyle:!0},init:function(t){if(!s){if(t&&(Object.assign(this.popup,t.popup||{}),Object.assign(this.toast,t.toast||{})),this.popup.el=i(this.popup.content),this.popup.el.querySelector(".pop__close").addEventListener("click",t=>{this.closePopup()}),this.popup.onClick&&this.popup.el.querySelector(".pop__content").addEventListener("click",this.popup.onClick),this.popup.defaultStyle){const o=document.createElement("style");o.innerHTML=n,document.head.appendChild(o)}if(this.toast.el=p(this.toast.content),this.toast.defaultStyle){const e=document.createElement("style");e.innerHTML=r,document.head.appendChild(e)}s=!0}return this},showPopup:function(t){if(!s)throw Error("PopAndToastError: must init before use.");var o;return e=!0,(o=localStorage.getItem("popAndToast"))&&(o=+JSON.parse(o).date,Date.now()-o<=this.popup.refresh&&(console.info("PopAndToastInfo: too soon to show popup again."),e=!1)),e&&(localStorage.setItem("popAndToast",JSON.stringify({date:Date.now()})),t&&(this.popup.el.querySelector(".pop__content").innerHTML=t),requestAnimationFrame(()=>document.querySelector(this.popup.target).firstElementChild?document.querySelector(this.popup.target).insertBefore(this.popup.el,document.querySelector(this.popup.target).firstElementChild):document.querySelector(this.popup.target).append(this.popup.el)),this.popup.closed=!1),this},closePopup:function(){if(!s)throw Error("PopAndToastError: must init before use.");return this.popup.closed||(this.popup.el.remove(),this.popup.closed,this.popup.onClose&&this.popup.onClose()),this},showToast:function(t){if(!s)throw Error("PopAndToastError: must init before use.");return t&&(this.toast.el.querySelector(".toast__content").innerHTML=t),document.body.append(this.toast.el),this.toast.el.classList.add("toast-show"),setTimeout(()=>{requestAnimationFrame(()=>{this.toast.el.classList.remove("toast-show"),this.toast.el.remove()})},this.toast.duration),this}};let s=!1,e=!1;const i=t=>{const o=document.createElement("div");return o.classList.add("pop"),o.innerHTML=`
    <div class="pop__wrapper">
      <div class="pop__close">
        <a href="#" aria-label="Close Modal Popup">&times;</a>
      </div>
      <div class="pop__content">${t}</div>
    </div>`,o},p=t=>{const o=document.createElement("div");return o.className="toast",o.innerHTML=`
    <div class="toast__wrapper">
      <div class="toast__content">${t}</div>
    </div>`,o},n=`
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
  }`,r=`
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
  }`;return t})();"undefined"!=typeof exports&&(exports.popAndToast=popAndToast);