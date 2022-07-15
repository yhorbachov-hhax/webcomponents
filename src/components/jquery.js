function getWindow() {
  return window.top;
}

export function getJQuery(...args) {
  return getWindow().jQuery(...args);
}

export function getHtml() {
  return getWindow().document.documentElement;
}

export function getDocumentBody() {
  return getWindow().document.body;
}
