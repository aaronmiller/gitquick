import $ from 'jquery';
import state from './state';
import render from './render';
import { gitUrl, gitRepos } from './api';
import { reposContainer, formInput, errorMessage, repoMasterContainer } from './dom_elements';

export let postOptions = {
  error: () => {
    console.log('Could not retrieve data');

    // Show error message and hide repo container if ajax fails.
    render.removeClassName(errorMessage, 'hidden');
    render.addClassName(repoMasterContainer, 'hidden');
    state.currentUser = '';
    
    return;
  },
  success: (data) => {
    // Hide error message and show repo container if ajax is successful.
    render.addClassName(errorMessage, 'hidden');
    render.removeClassName(repoMasterContainer, 'hidden');

    // Declare and set counter to iterate through repositories.
    let i = 0;

    state.currentUser = formInput.val();
    state.currentApi = gitUrl;
    state.currentApiRepo = gitRepos;

    for (i; i < data.length; i += 1) {
      reposContainer.append(`<a href="${data[i].url}" class="repos">${data[i].name}</a>`);
    }

    // Reset counter to 0 for future repository iteration.
    i = 0;
  }
};

export const getData = () => {
  $.ajax(postOptions);
};
