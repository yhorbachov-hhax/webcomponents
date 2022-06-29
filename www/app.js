function main() {
  webcomponents.connectComponents(jQuery);

  $("#trigger1").connectHistoryViewer({
    id: "trigger_element1",
    historyUrl:
      "https://www.openstreetmap.org/export/embed.html?bbox=-0.004017949104309083%2C51.47612752641776%2C0.00030577182769775396%2C51.478569861898606&layer=mapnik",
    queryParameters: { testKey: "testValue" },
  });

  // listeners();

  $("#trigger_element1").on("opened.zf.offCanvas", function (event) {
    //$('.pagination').css('display','block');
    console.log("Off-canvas menu was closed.");
  });
  $("#trigger1").on("opened.zf.offCanvas", function (event) {
    //$('.pagination').css('display','block');
    console.log("Off-canvas menu was closed.");
  });
}

main();
