function main() {
  webcomponents.connectComponents(jQuery);

  $("#trigger1").connectHistoryViewer({
    historyUrl: "http://localhost:4200",
    queryParameters: { SectionName: "HisBatchDate" },
  }); 
  
  $("#trigger2").connectHistoryViewer({
    historyUrl: "http://localhost:4200",
    queryParameters: { SectionName: "HisReferralProfileInfo" },
  });
}

main();
