popAndToast
  .init({
    popup: {
      refresh: 6000, // 6 seconds for a refresh
      content: `
      <h2>Some Heading</h2>
      <p>
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. 
        Temporibus, quaerat inventore recusandae culpa nulla beatae
        soluta perspiciatis tenetur repellendus minima a numquam?
      </p>
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
        popAndToast.closePopup();
      },
      onClose: () => {
        console.log('Popup closed');
      },
    },
  })
  .showPopup()
  .showToast('First Toast!');

// will be called too soon, look for message in console
setTimeout(
  () => requestAnimationFrame(() => popAndToast.showPopup('Too soon!')),
  3000
);

setTimeout(
  () => requestAnimationFrame(() => popAndToast.showToast('Second toast!')),
  5000
);
