var svg = dimple.newSvg("#time", 3000, 550);
      d3.csv("../../data/timeline.csv", function (data) {
        /*data = dimple.filterData(data, "Date", [
          "12/3/2013", "3/19/2014", "3/31/2014",
          "01/10/2012", "01/11/2012", "01/12/2012"]);*/
        var myChart = new dimple.chart(svg, data);
        myChart.setBounds(100, 30, 2900, 450);
        myChart.defaultColors = [
            new dimple.color("#293E6A"), // G
            new dimple.color("#DF9496"), // F
            new dimple.color("#93B1C6"), // E
            new dimple.color("#77BA9B"), // C
            new dimple.color("#B6A754")  // S
        ]; 
        var x = myChart.addCategoryAxis("x", "Date");
        x.addOrderRule("Date");
        var y = myChart.addCategoryAxis("y", "Username");
        myChart.addPctAxis("z", "Price","Price");
        myChart.addSeries("Category", dimple.plot.bubble);
        myChart.addLegend(140, 10, 560, 20, "right");
        myChart.draw();
      });
