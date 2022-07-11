import { getDocumentBody } from "./jquery";

class SlideOutManager {
  constructor(jQuery) {
    this.jQuery = jQuery;
    this.offCanvasContainer = null;
  }

  connectSlideOut(triggerElement, options) {
    const canvasContainer = this.createContainer(options);

    this.attachToBody(canvasContainer);
    this.attachToggle(triggerElement);

    const $container = this.jQuery(canvasContainer);
    const offCanvasContainer = new Foundation.OffCanvas($container, {
      trapFocus: true,
      transitionTime: ".2s",
      transition: "slide",
    });

    this.offCanvasContainer = offCanvasContainer;

    $container.foundation();

    this.attachListeners();
  }

  createContainer(options) {
    const { id, headerTitle, historyUrl, queryParameters } = options;
    const header = this.createHeader(headerTitle, id);
    const viewer = this.createViewer(historyUrl, queryParameters);
    const canvas = this.createOffCanvas();

    canvas.appendChild(header);
    canvas.appendChild(viewer);

    return canvas;
  }

  createOffCanvas() {
    const canvas = document.createElement("div");

    canvas.classList.add("off-canvas", "position-right", "viewer-content");

    return canvas;
  }

  createHeader(headerTitle, id) {
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

    this.attachToggle(closeButtonContent);

    header.appendChild(title);
    closeButton.appendChild(closeButtonContent);

    fragment.appendChild(header);
    fragment.appendChild(closeButton);

    return fragment;
  }

  createViewer(historyUrl, queryParameters) {
    const container = document.createElement("div");

    container.classList.add("padding-1", "frame-content");

    const iframe = document.createElement("iframe");

    iframe.classList.add("frame-content");

    container.appendChild(iframe);

    // Combine query params and concat to opening iframe URL

    console.log(queryParameters);

    iframe.src = historyUrl;

    return container;
  }

  attachToggle(element) {
    this.jQuery(element).on("click", () => {
      this.offCanvasContainer.toggle();
    });
  }

  toggleHideScroll() {
    getDocumentBody().classList.toggle("hide-scroll");
  }

  attachListeners() {
    ["closed.zf.offCanvas", "opened.zf.offCanvas"].map((eventType) => {
      this.offCanvasContainer.$element.on(eventType, () => {
        this.toggleHideScroll();
      });
    });
  }

  attachToBody(container) {
    getDocumentBody().appendChild(container);
  }
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
    // Check if plugin operates over empty element
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
        skipTriggerBinding: true,
      },
      options
    );

    const manager = new SlideOutManager(jQuery);

    manager.connectSlideOut(this, settings);
  };
}
