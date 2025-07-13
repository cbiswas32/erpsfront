import React, { useEffect } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import { green, amber, red } from "@mui/material/colors";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

const PieChart = () => {
  useEffect(() => {
    // Create root element
    let root = am5.Root.new("chartdiv");

    // Apply theme
    root.setThemes([am5themes_Animated.new(root)]);

    // Hide amCharts logo
    root._logo.dispose();

    // Create chart
    let chart = root.container.children.push(
      am5percent.PieChart.new(root, {
        layout: root.verticalLayout,
        innerRadius: am5.percent(50),
      })
    );

    // Create series
    let series = chart.series.push(
      am5percent.PieSeries.new(root, {
        valueField: "value",
        categoryField: "category",
        alignLabels: false,
      })
    );

    series.labels.template.setAll({
      textType: "circular",
      centerX: 0,
      centerY: 0,
    });

    // Use MUI colors
    series.set(
        "colors",
        am5.ColorSet.new(root, {
        colors: [
            am5.color(green[400]), // Green for Completed
            am5.color(amber[400]), // Amber for In Progress
            am5.color(red[300]),   // Red for Rejected
        ],
        })
    );

    // Set data
    series.data.setAll([
      { value: 10, category: "Completed" },
      { value: 9, category: "In Progress" },
      { value: 2, category: "Rejected" },
    ]);

     // Hide labels
    series.labels.template.setAll({
        forceHidden: true,
    });
    // Create legend
    let legend = chart.children.push(
      am5.Legend.new(root, {
        centerX: am5.percent(50),
        x: am5.percent(50),
        marginTop: 15,
        marginBottom: 15,
      })
    );

    legend.data.setAll(series.dataItems);

    // Play initial series animation
    series.appear(1000, 100);

    // Cleanup on unmount
    return () => {
      root.dispose();
    };
  }, []);

  return <div id="chartdiv" style={{ width: "100%", height: "100%" }}></div>;
};

export default PieChart;
