// Custom render object.
const render = {
  emptyContents: (component) => {
    component.empty();
  },

  addClassName: (component, className) => {
    component.addClass(className);
  },

  removeClassName: (component, className) => {
    component.removeClass(className);
  },

  removeElement: (component) => {
    component.remove();
  }
};

export default render;
