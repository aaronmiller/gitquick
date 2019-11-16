require('./vendors/vendors');
require('../less/index.less');
require('./components/app');

// Accept Webpack Hot Module Replacement
if (module.hot) {
    const hotEmitter = require('webpack/hot/emitter');

    // Recompile CSS/Less/Sass
    const DEAD_CSS_TIMEOUT = 2000;

    hotEmitter.on('webpackHotUpdate', () => {
        document.querySelectorAll('link[href][rel=stylesheet]').forEach((link) => {
            const nextStyleHref = link.href.replace(/(\?\d+)?$/, '');
            const newLink = link.cloneNode();
            newLink.href = nextStyleHref;

            link.parentNode.appendChild(newLink);
            setTimeout(() => {
                link.parentNode.removeChild(link);
            }, DEAD_CSS_TIMEOUT);
        });
    });
}
