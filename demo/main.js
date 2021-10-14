import { popAndToast } from '../src/pop-and-toast.mjs';

popAndToast
  .init({
    popup: {
      refresh: 0,
      timeout: 0,
      content: `
      <h2>Some Heading</h2>
      <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. 
      Temporibus, quaerat inventore recusandae culpa nulla beatae soluta perspiciatis 
      tenetur repellendus minima a numquam? Fugiat quaerat repudiandae facilis asperiores 
      quisquam. Maiores, deleniti.Quidem, expedita? Dolores, magnam. Error officia fugit 
      asperiores, provident, exercitationem inventore sit laudantium deleniti voluptatibus 
      iste sapiente perspiciatis neque minima eius, fugiat sed illum laboriosam 
      necessitatibus eaque libero architecto beatae?At voluptatum omnis atque, nam 
      cupiditate quas, nostrum nemo, asperiores necessitatibus dolore distinctio iste 
      quos minus ab quod fugit praesentium explicabo. Aut voluptatum ullam et veniam 
      maxime eligendi ducimus libero.</p>
      <footer>Some footer</footer>`,
      onClick: async (evt) => {
        // copy some content to the clipboard
        if (navigator.clipboard) {
          try {
            await navigator.clipboard.writeText('Something to copy');
            console.log('Successfully copied to clipboard');
          } catch (err) {
            console.error('Error copying to clipboard');
          }
        }
        // close the popup
        document
          .querySelector(popAndToast.options.popup.target)
          .removeChild(popAndToast.options.popup.el);
      },
    },
  })
  .showPopup();
