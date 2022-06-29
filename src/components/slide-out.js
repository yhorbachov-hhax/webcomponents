function createOffCanvas(id) {
  const canvas = document.createElement("div");

  canvas.classList.add("off-canvas-absolute", "position-right", "viewer-content");
  canvas.setAttribute("id", id);
  canvas.setAttribute("data-off-canvas", "");
  canvas.setAttribute("data-trap-focus", "true");
  canvas.setAttribute("data-transition-time", ".2s");
  canvas.setAttribute("data-transition", "slide");

  return canvas;
}

function createOffCanvasContent() {
  const canvasContent = document.createElement("div");

  canvasContent.classList.add("off-canvas-content");

  return canvasContent;
}

function createHeader(headerTitle, id) {
  const fragment = document.createDocumentFragment();
  const header = document.createElement("h2");
  const title = document.createElement("span");
  const closeButton = document.createElement("button");
  const closeButtonContent = document.createElement("span");

  header.classList.add("title");

  title.classList.add("pageTitle");
  title.innerText = headerTitle;

  closeButton.classList.add("close-button");
  closeButton.type = "button";
  closeButton.ariaLabel = "Close Panel";

  closeButtonContent.ariaHidden = "true";
  closeButtonContent.innerText = "x";

  attachToggle(closeButtonContent, id);

  header.appendChild(title);
  closeButton.appendChild(closeButtonContent);

  fragment.appendChild(header);
  fragment.appendChild(closeButton);

  return fragment;
}

function createViewer(historyUrl, queryParameters) {
  const container = document.createElement("div");

  container.classList.add("padding-1");

  const iframe = document.createElement("iframe");

  iframe.classList.add("frame-content");

  container.appendChild(iframe);

  // Combine query params and concat to URL

  console.log(queryParameters);

  iframe.src = historyUrl;

  return container;
}

function attachToggle(element, id) {
  $(element).attr("data-toggle", id);
}

function createContainer(options) {
  const { id, headerTitle, historyUrl, queryParameters } = options;
  const container = document.createDocumentFragment();
  const header = createHeader(headerTitle, id);
  const viewer = createViewer(historyUrl, queryParameters);
  const canvas = createOffCanvas(id);
  const canvasContent = createOffCanvasContent();

  canvas.appendChild(header);
  canvas.appendChild(viewer);
  container.appendChild(canvas);
  container.appendChild(canvasContent);

  return container;
}

function connectSlideOut(triggerElement, options) {
  attachToggle(triggerElement, options.id);

  const canvasContainer = createContainer(options);

  $(canvasContainer).foundation();

  document.body.appendChild(canvasContainer);
}

/* 
Example of options parameter

options = {
  id: "uniqTriggerButtonId",
  headerTitile: "Patient History",
  historyUrl: "http://development.hhaexchange.com/history",
  queryParameters: {
    SectionName: "HisPatientGeneral",
    tblPatientMaster: "14906340",
    PatientInfo: "14141710",
    VendorPatients: 3574391
  }
}
*/
export function createHistoryViewerWidget(jQuery) {
  jQuery.fn.connectHistoryViewer = function (options) {
    if (!this.length) {
      console.error("Empty trigger element");

      return;
    }

    const isInvalidOptions = [options.id, options.historyUrl, options.queryParameters].some((value) => !value);

    if (isInvalidOptions) {
      console.error("id, historyUrl and queryParameters is mandatory options");

      return;
    }

    const settings = jQuery.extend(
      {
        headerTitle: "History",
      },
      options
    );

    connectSlideOut(this, settings);
  };
}
