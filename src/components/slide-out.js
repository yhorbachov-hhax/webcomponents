import { getDocumentBody, getHtml } from "./jquery";

class SlideOutManager {
  constructor(jQuery) {
    this.jQuery = jQuery;
    this.$offCanvasContainer = null;
  }

  connectSlideOut($triggerElement, options) {
    const canvasContainer = this.createMainContainer(options);

    this.attachToBody(canvasContainer);
    this.attachToggle($triggerElement);

    const $container = this.jQuery(canvasContainer);
    const offCanvasContainer = new Foundation.OffCanvas($container, {
      trapFocus: true,
      transitionTime: ".2s",
      transition: "slide",
    });

    this.$offCanvasContainer = offCanvasContainer;

    $container.foundation();

    this.attachListeners();
  }

  createMainContainer(options) {
    const { headerTitle, historyUrl, queryParameters } = options;
    // const header = this.createHeader(headerTitle);
    const viewer = this.createViewer(historyUrl, queryParameters);
    const canvas = this.createCanvas();

    // canvas.appendChild(header);
    canvas.appendChild(viewer);

    return canvas;
  }

  createCanvas() {
    const canvas = document.createElement("div");

    canvas.classList.add("off-canvas", "position-right", "viewer-content");

    canvas.style.width = "50%";
    canvas.style.zIndex = "1010";

    return canvas;
  }

  createHeader(headerTitle) {
    const headerFragment = document.createDocumentFragment();
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

    headerFragment.appendChild(header);
    headerFragment.appendChild(closeButton);

    return headerFragment;
  }

  createViewer(historyUrl, queryParameters) {
    const viewer = document.createElement("div");

    viewer.classList.add("frame-content");

    const iframe = document.createElement("iframe");

    iframe.classList.add("frame-content");

    viewer.appendChild(iframe);

    // Combine query params and concat to opening iframe URL

    console.log(queryParameters);

    iframe.src = historyUrl;

    return viewer;
  }

  attachToggle(element) {
    this.jQuery(element).on("click", () => {
      this.$offCanvasContainer.toggle();
    });
  }

  toggleHideScroll() {
    getDocumentBody().classList.toggle("hide-scroll");
    getHtml().classList.toggle("hide-scroll");
  }

  attachListeners() {
    ["closed.zf.offCanvas", "opened.zf.offCanvas"].map((eventType) => {
      this.$offCanvasContainer.$element.on(eventType, () => {
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

    const isInvalidOptions = [options.historyUrl, options.queryParameters].some(
      (value) => !value
    );

    if (isInvalidOptions) {
      console.error("historyUrl and queryParameters is mandatory options");

      return;
    }

    const settings = jQuery.extend(
      {
        headerTitle: "History",
      },
      options
    );

    const manager = new SlideOutManager(jQuery);

    manager.connectSlideOut(this, settings);
  };
}
