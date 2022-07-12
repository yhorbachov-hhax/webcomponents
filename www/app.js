function main() {
  webcomponents.connectComponents(jQuery);

  $("#trigger1").connectHistoryViewer({
    historyUrl: "https://uat.hhaexchange.com/history/",
    queryParameters: { testKey: "testValue" },
  });
}

main();
