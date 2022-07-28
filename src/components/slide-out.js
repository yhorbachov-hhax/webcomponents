import { IFRAME_HEADER_CLOSE_EVENT_NAME } from "../constants";
import { getDocumentBody, getHtml } from "./jquery";

class SlideOutManager {
  constructor(jQuery) {
    this.jQuery = jQuery;
    this.$offCanvasContainer = null;
  }

  connectSlideOut($triggerElement, options) {
    const canvasContainer = this.createCanvasContainer(options);

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

    this.attachListeners(options);
  }

  createCanvasContainer(options) {
    const { historyUrl, queryParameters } = options;
    const viewer = this.createViewer(historyUrl, queryParameters);
    const canvas = this.createCanvas();

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

  createViewer(historyUrl, queryParameters) {
    const viewer = document.createElement("div");

    viewer.classList.add("frame-wrap");

    const iframe = document.createElement("iframe");

    iframe.classList.add("frame-content");

    const formattedHistoryUrl = this.formatHistoryUrl(historyUrl, queryParameters);

    iframe.src = formattedHistoryUrl;

    viewer.appendChild(iframe);

    // Ad-hoc solution for trap focus
    // const trapFocusElement = document.createElement("input");

    // trapFocusElement.style.opacity = 0;

    // viewer.appendChild(trapFocusElement);

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

  toggleCanvas() {
    this.$offCanvasContainer.toggle();
  }

  attachListeners(options) {
    this.attachCanvasListeners();
    this.attachIframeCloseListener(options);
  }

  attachCanvasListeners() {
    ["closed.zf.offCanvas", "opened.zf.offCanvas"].map((eventType) => {
      this.$offCanvasContainer.$element.on(eventType, () => {
        this.toggleHideScroll();
      });
    });
  }

  attachIframeCloseListener(options) {
    window.top.addEventListener("message", (event) => {
      const targetEvent = [IFRAME_HEADER_CLOSE_EVENT_NAME, options.queryParameters.SectionName].join("_");

      if (event.data === targetEvent) {
        this.toggleCanvas();
        this.toggleHideScroll();
      }
    });
  }

  attachToBody(container) {
    getDocumentBody().appendChild(container);
  }

  formatHistoryUrl(historyUrl, queryParameters) {
    const formattedQueryParameters = this.formatQueryParameters(queryParameters);
    const urlParams = new URLSearchParams(formattedQueryParameters);

    return historyUrl + "?" + urlParams.toString();
  }

  formatQueryParameters(queryParameters) {
    const compositeKey = queryParameters["CompositeKey"];

    if (!compositeKey) {
      return queryParameters;
    }

    const rawParameters = compositeKey.split("&");
    const compositeParameters = rawParameters.reduce((baseParameters, rawPair) => {
      const [key, value] = rawPair.split("=");

      return { ...baseParameters, [key]: value };
    }, {});

    return { ...queryParameters, ...compositeParameters };
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

    const isInvalidOptions = [options.historyUrl, options.queryParameters].some((value) => !value);

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
