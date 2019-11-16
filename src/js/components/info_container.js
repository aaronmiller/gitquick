import $ from 'jquery';
import state from './state';
import render from './render';
import { infoIcon, infoContainer, welcomeContainer, header, main } from './dom_elements';

// Info Container
(() => {
  infoIcon.on('click', () => {
    render.removeClassName(infoContainer, 'opacity-hide no-pointer-events');
    render.addClassName(infoIcon, 'opacity-hide');
    render.addClassName(welcomeContainer, 'no-pointer-events');
    render.addClassName(header, 'no-pointer-events');
    render.addClassName(main, 'no-pointer-events');

    // Set info container to true.
    state.infoContainer = true;
  });

  infoContainer.on('click', () => {
    render.addClassName(infoContainer, 'opacity-hide no-pointer-events');
    render.removeClassName(infoIcon, 'opacity-hide');
    render.removeClassName(welcomeContainer, 'no-pointer-events');
    render.removeClassName(header, 'no-pointer-events');
    render.removeClassName(main, 'no-pointer-events');

    // Set info container to false.
    state.infoContainer = false;
  });

  $(document).keyup(e => {
    if (state.infoContainer === true) {
      if (e.keyCode === 27) {
        render.addClassName(infoContainer, 'opacity-hide no-pointer-events');
        render.removeClassName(infoIcon, 'opacity-hide');
        render.removeClassName(welcomeContainer, 'no-pointer-events');
        render.removeClassName(header, 'no-pointer-events');
        render.removeClassName(main, 'no-pointer-events');

        // Set info container to false.
        state.infoContainer = false;
      }
    }
  });
})();
