import state from './state';
import render from './render';
import { gitUrl } from './api';
import { getData, postOptions } from './ajax';
import { form, header, formInput, reposContainer, repoTitleContainer, codeContainer, branchNameContainer } from './dom_elements';

// Form submit handler.
(() => {
  form.on('submit', (e) => {
    e.preventDefault();

    // Check if current user state matches input. If so, cancel the request.
    if (formInput.val() === state.currentUser) {
      return false;
    }
    
    // Reset state for source code.
    state.hasSourceCode = false;

    // Render content.
    render.emptyContents(codeContainer);
    render.emptyContents(reposContainer);
    render.addClassName(header, 'to-top');
    render.addClassName(branchNameContainer, 'hidden');
    render.addClassName(codeContainer, 'hidden');
    render.removeClassName(reposContainer, 'hidden opacity-hide');
    render.removeClassName(repoTitleContainer, 'hidden');

    postOptions.url = `${gitUrl}${formInput.val()}/repos`;

    getData();
  });
})();
