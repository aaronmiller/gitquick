import render from './render';
import { body, header, welcomeContainer, welcomeButton, formInput } from './dom_elements';

// Welcome section.
(() => {
  // Fade in web page when welcome button has been clicked.
  render.removeClassName(welcomeContainer, 'opacity-hide');
  welcomeButton.on('click', e => {
    e.stopPropagation();

    render.addClassName(welcomeContainer, 'opacity-hide');
    setTimeout(() => {
      render.removeElement(welcomeContainer);
      render.removeClassName(body, 'opacity-hide');
      render.removeClassName(header, 'opacity-hide no-pointer-events');
      render.addClassName(body, 'show');
    }, 750);
    formInput.focus();

    return false;
  });
})();
