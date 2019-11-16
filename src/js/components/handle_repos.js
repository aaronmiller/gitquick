import $ from 'jquery';
import state from './state';
import render from './render';
import { reposContainer, codeContainer, branchNameContainer, rootBranch, branch, breadCrumbs } from './dom_elements';

(() => {
  reposContainer.on('click', e => {
    e.stopPropagation();

    // Reset state for source code.
    state.hasSourceCode = false;

    // Empty code container and branch name. Also reset state of branch.
    render.emptyContents(codeContainer);
    render.emptyContents(branch);
    render.emptyContents(breadCrumbs);
    state.currentBranch = '';

    // Set state of current repo and current repo URL from clicked element.
    state.currentRepo = $(e.target).html();
    state.currentRepoUrl = $(e.target).attr('href');

    codeContainer.removeClass('hidden');
    branchNameContainer.removeClass('hidden');

    $('.repos').removeClass('current');
    $(e.target).addClass('current');

    let postOptions = {
      url: `${state.currentRepoUrl}/branches`
    };

    $.ajax({
      url: postOptions.url,
      error: () => {
        console.log('There is an error retrieving data.');
      },
      success: (data) => {

        // Declare and set counter for branch iteration.
        let i = 0;

        state.currentUrl = postOptions.url;
        state.latestCommitSha = data[i].commit.sha;

        for (i; i < data.length; i += 1) {
          codeContainer.append(`<a href="${data[i].commit.url}" data-branch-name="${data[i].name}" class="files">${data[i].name}</a>`);
        }

        rootBranch.attr('data-root-branch', postOptions.url);

        // Reset counter for future branch iterations.
        i = 0;
      }
    });

    return false;
  });
})();
