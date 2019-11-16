const base64 = require('base-64');
const escapeHtml = require('escape-html');
const hljs = require('highlight.js');
import $ from 'jquery';
import state from './state';
import render from './render';
import { codeContainer, branch, rootBranch, branchNameContainer, branchNavigation, breadCrumbs, errorMessage } from './dom_elements';

// Branch submit handler.
(() => {
  codeContainer.on('click', (e) => {
    e.stopPropagation();

    // Set the href to the clicked link of the element.
    let clickedLink = $(e.target).attr('href');

    // Check if branches exist.
    if ($(e.target).attr('data-branch-name')) {
      branch.append(`<span class="branch-navigation" data-nav-url="">: ${$(e.target).attr('data-branch-name')} | </span>`);

      // Set the state of the branch.
      state.currentBranch = $(e.target).attr('data-branch-name');
    }

    // Check for file type.
    if ($(e.target).attr('data-file-type') === 'blob') {

      // If file type === blob, request the file.
      let postOptions = {
        url: clickedLink,
        error: () => {
          console.log('Error retrieving data.');

          // Show error message if ajax fails.
          render.removeClassName(errorMessage, 'hidden');
        },
        success: data => {
          render.emptyContents(codeContainer);

          // Hide error message if ajax is successful.
          render.addClassName(errorMessage, 'hidden');

          // Set up sourceCode.
          let sourceCode;

          // Check for HTM/HTML/XML/XHTML/XUL file type. If so, then escape properly.
          if ($(e.target).attr('data-file-name').includes('.htm') ||
          $(e.target).attr('data-file-name').includes('.html') ||
          $(e.target).attr('data-file-name').includes('.xml') ||
          $(e.target).attr('data-file-name').includes('.xhtml') ||
          $(e.target).attr('data-file-name').includes('.xul')) {
            sourceCode = `<div class="source-code-container"><pre><code class="source-code">${escapeHtml(base64.decode(data.content))}</code></pre></div>`;

            // Append file name to breadcrumb container.
            breadCrumbs.append(`<span class="navigation" data-nav-url="${clickedLink}">/${$(e.target).attr('data-file-name')}</span>`);
            codeContainer.append(sourceCode);
          } else {

            // Decode regular base64 content.
            sourceCode = `<div class="source-code-container"><pre><code class="source-code">${base64.decode(data.content)}</code></pre></div>`;

            // Append file name to breadcrumb container.
            breadCrumbs.append(`<span class="navigation" data-nav-url="${clickedLink}">/${$(e.target).attr('data-file-name')}</span>`);

            // Render regular decoded base64 content.
            codeContainer.append(sourceCode);
          }

          // Syntax highlight parsed source code.
          hljs.initHighlighting();

          // Set source code state to true.
          state.hasSourceCode = true;

          // Add no pointer-events to last class name to prevent from being clicked.
          render.addClassName($('.breadcrumbs .navigation:last-child'), 'no-pointer-events');
        }
      };

      $.ajax(postOptions);

      // If file type !== blob, traverse through folders.
    } else if ($(e.target).attr('data-file-type') === 'tree') {

      // Empty the contents of the code container.
      render.emptyContents(codeContainer);

      let postOptions = {
        url: clickedLink,
        error: () => {
          console.log('Error retrieving data.');

          // Show error message if ajax fails.
          render.removeClassName(errorMessage, 'hidden');
        },
        success: data => {
          // Hide error message if ajax is successful.
          render.addClassName(errorMessage, 'hidden');

          let postOptions = {
            url: data.url,
            error: () => {
              console.log('Error retrieving data.');
            },
            success: data => {
              // Declare and assign 0 to counter for file iteration.
              let i = 0;

              // Append contents from tree to code container.
              for (i; i < data.tree.length; i += 1) {
                codeContainer.append(`<a class="files" data-file-type="${data.tree[i].type}" data-file-name="${data.tree[i].path}" href="${data.tree[i].url}">${data.tree[i].path}</a>`);
              }

              // Append file name to breadcrumb container.
              breadCrumbs.append(`<span class="navigation" data-nav-url="${clickedLink}">/${$(e.target).attr('data-file-name')}</span>`);

              // Reset counter to 0 for future file iterations.
              i = 0;
            }
          };

          $.ajax(postOptions);
        }
      };

      $.ajax(postOptions);

    } else {
      // Check to see if sourcecode is in container. If so, then break execution in order to highlight source code.
      if (state.hasSourceCode === true) {
        return false;
      }

      // Go into the selected branch.
      render.emptyContents(codeContainer);

      let postOptions = {
        url: clickedLink,
        error: () => {
          console.log('Error retrieving data.');

          // Show error message if ajax fails.
          render.removeClassName(errorMessage, 'hidden');
        },
        success: data => {
          // Hide error message if ajax is successful.
          render.addClassName(errorMessage, 'hidden');

          let postOptions = {
            url: data.commit.tree.url,
            error: () => {
              console.log('Error retrieving data.');

              // Show error message if ajax fails.
              render.removeClassName(errorMessage, 'hidden');
            },
            success: data => {
              // Hide error message if ajax is successful.
              render.addClassName(errorMessage, 'hidden');

              // Declare and initialize counter for file iteration.
              let i = 0;

              // Append contents from tree to code container.
              for (i; i < data.tree.length; i += 1) {
                codeContainer.append(`<a class="files" data-file-type="${data.tree[i].type}"
                data-file-name="${data.tree[i].path}" href="${data.tree[i].url}">${data.tree[i].path}</a>`);
              }

              // Reset counter to 0 for further file iterations.
              i = 0;
              if (branchNavigation) {
                state.currentBranchUrl = data.url;
              } else {
                state.currentBranchUrl = '';
              }

              document.querySelector('.branch-navigation').setAttribute('data-nav-url', state.currentBranchUrl);
            }
          };

          $.ajax(postOptions);
        }
      };

      $.ajax(postOptions);
    }

    return false;
  });

  // Handler for breadcrumbs.
  branchNameContainer.on('click', '.navigation', e => {
    e.stopPropagation();

    if ($(e.target).attr('data-nav-url')) {
      if (state.hasSourceCode === true) {
        state.hasSourceCode = false;
      }

      // Remove tree after clicked element.
      $(e.target).nextAll().remove();

      // If file type !== blob, traverse through folders.
      render.emptyContents(codeContainer);

      let clickedLink = $(e.target).attr('data-nav-url');

      let postOptions = {
        url: clickedLink,
        error: () => {
          console.log('Error retrieving data.');

          // Show error message if ajax fails.
          render.removeClassName(errorMessage, 'hidden');
        },
        success: data => {
          // Hide error message if ajax is successful.
          render.addClassName(errorMessage, 'hidden');

          let postOptions = {
            url: data.url,
            error: () => {
              console.log('Error retrieving data.');

              // Show error message if ajax fails.
              render.removeClassName(errorMessage, 'hidden');
            },
            success: data => {

              // Declare and set counter for file iteration.
              let i = 0;

              // Append contents from tree to code container.
              for (i; i < data.tree.length; i += 1) {
                codeContainer.append(`<a class="files" data-file-type="${data.tree[i].type}" data-file-name="${data.tree[i].path}" href="${data.tree[i].url}">${data.tree[i].path}</a>`);
              }

              // Reset counter to 0 for further file iterations.
              i = 0;
            }
          };

          $.ajax(postOptions);
        }
      };

      $.ajax(postOptions);
    }

    return false;
  });

  // Set click handler for root branches.
  rootBranch.on('click', e => {
    // Set state of source code false to continue tree navigation.
    state.hasSourceCode = false;

    let url = $(e.target).attr('data-root-branch');
    let postOptions = {
      url: url,
      error: () => {
        console.log('There was an error retrieving data.');

        // Show error message if ajax fails.
        render.removeClassName(errorMessage, 'hidden');
      },
      success: data => {
        // Hide error message if ajax is successful.
        render.addClassName(errorMessage, 'hidden');

        // Empty all content within breadcrumbs, branch, and code container.
        render.emptyContents(breadCrumbs);
        render.emptyContents($('.branch'));
        render.emptyContents(codeContainer);

        // Declare and assign counter for file iteration.
        let i = 0;

        // Append contents from tree to code container.
        for (i; i < data.length; i += 1) {
          codeContainer.append(`<a href="${data[i].commit.url}" data-branch-name="${data[i].name}" class="files">${data[i].name}</a>`);
        }

        // Reset counter to 0 for future file iterations.
        i = 0;
      }
    };

    $.ajax(postOptions);
  });

  // Set click handler for top branches.
  branch.on('click', e => {
    e.stopPropagation();

    // Set state of source code false to continue tree navigation.
    state.hasSourceCode = false;

    let url = $(e.target).attr('data-nav-url');
    let postOptions = {
      url: url,
      error: () => {
        console.log('There was an error retrieving data.');

        // Show error message if ajax fails.
        render.removeClassName(errorMessage, 'hidden');
      },
      success: data => {
        // Hide error message if ajax is successful.
        render.addClassName(errorMessage, 'hidden');

        // Empty all content within breadcrumbs, branch, and code container.
        render.emptyContents(breadCrumbs);
        render.emptyContents(codeContainer);

        // Declare and assign counter for file iteration.
        let i = 0;

        // Append contents from tree to code container.
        for (i; i < data.tree.length; i += 1) {
          codeContainer.append(`<a class="files" data-file-type="${data.tree[i].type}" data-file-name="${data.tree[i].path}" href="${data.tree[i].url}">${data.tree[i].path}</a>`);
        }

        // Reset counter to 0 for future file iterations.
        i = 0;
      }
    };

    $.ajax(postOptions);
  });
})();
