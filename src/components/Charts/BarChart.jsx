import { useLayoutEffect } from 'react';
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { green, amber
 } from '@mui/material/colors';

function BarChart(props) {
  useLayoutEffect(() => {
    let root = am5.Root.new("chartdivbar");

    root.setThemes([
      am5themes_Animated.new(root)
    ]);

    let chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panY: false,
        layout: root.verticalLayout
      })
    );

     // Hide amCharts logo
     root._logo.dispose();
     
    // Define data
    let data = [{
      category: "Project A",
      value1: 1000,
      value2: 588
    }, {
      category: "Project B",
      value1: 1200,
      value2: 180
    }];

    // Create Y-axis
    let yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {})
      })
    );

    // Create X-Axis
    let xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
    renderer: am5xy.AxisRendererX.new(root, {}),
        categoryField: "category"
      })
    );
    xAxis.data.setAll(data);

    // Create series
    let series1 = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        name: "Approved",
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "value1",
        categoryXField: "category"
      })
    );
    series1.data.setAll(data);
       // Set color for the "Approved" series
       series1.columns.template.setAll({
        fill: green[400], // Approved color (green)
        stroke: green[600],
      });

    let series2 = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        name: "Rejected",
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "value2",
        categoryXField: "category"
      })
    );
    series2.data.setAll(data);

    series2.columns.template.setAll({
        fill: amber[400], // Rejected color
        stroke: amber[600],
      });

    // Add legend
    let legend = chart.children.push(am5.Legend.new(root, {}));
    legend.data.setAll(chart.series.values);

    // Add cursor
    chart.set("cursor", am5xy.XYCursor.new(root, {}));

    return () => {
      root.dispose();
    };
  }, []);

  return (
    <div id="chartdivbar" style={{ width: "100%", height: "100%" }}></div>
  );
}
export default BarChart;