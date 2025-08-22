import React, { useLayoutEffect } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import dayjs from "dayjs";

function MonthlySalesBarChart({ data }) {
  useLayoutEffect(() => {
    if (!data || data.length === 0) return;

    let root = am5.Root.new("chartdivbar");
    root.setThemes([am5themes_Animated.new(root)]);
    root._logo.dispose();

    // Chart
    let chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        wheelX: "panX",
        wheelY: "zoomX",
        layout: root.verticalLayout
      })
    );

    // Title
    chart.children.unshift(
      am5.Label.new(root, {
        text: "Day-wise Sales Performance",
        fontSize: 20,
        fontWeight: "700",
        textAlign: "center",
        x: am5.percent(50),
        centerX: am5.percent(50),
        paddingTop: 10,
        paddingBottom: 10,
        fill: am5.color(0x2c3e50)
      })
    );

    const chartData =
      data.map((x) => ({
        category: dayjs(x.date).format("DD MMM"),
        totalSales: Number(x.totalSum || 0)
      })) || [];

    // Y Axis
    let yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {
          strokeOpacity: 0.1
        })
      })
    );
    yAxis.get("renderer").labels.template.setAll({
      fontSize: 12,
      fill: am5.color(0x7f8c8d)
    });

    // X Axis
    let xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        renderer: am5xy.AxisRendererX.new(root, {
          minGridDistance: 30,
          cellStartLocation: 0.2,
          cellEndLocation: 0.8,
          minorGridEnabled: true
        }),
        categoryField: "category"
      })
    );

    xAxis.get("renderer").labels.template.setAll({
      rotation: -45,
      centerY: am5.p50,
      centerX: am5.p100,
      paddingRight: 10,
      fontSize: 11,
      fill: am5.color(0x2c3e50)
    });

    xAxis.data.setAll(chartData);

    // Series
    let totalSalesSeries = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        name: "Total Sales",
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "totalSales",
        categoryXField: "category",
        tooltip: am5.Tooltip.new(root, {
          labelText: "Rs. {valueY.formatNumber('#,###.##')}"
        })
      })
    );

    // Modern Bar Style
    totalSalesSeries.columns.template.setAll({
      strokeOpacity: 0,
    
      shadowColor: am5.color(0x000000),
      shadowBlur: 6,
      shadowOffsetY: 3,
      tooltipY: 0,
      fillGradient: am5.LinearGradient.new(root, {
        stops: [
          { color: am5.color(0x27ae60) }, // green top
          { color: am5.color(0x2ecc71) } // light green bottom
        ]
      })
    });

    // Hover effect
    totalSalesSeries.columns.template.states.create("hover", {
      scale: 1.05,
      shadowBlur: 10,
      shadowColor: am5.color(0x16a085)
    });

    totalSalesSeries.data.setAll(chartData);

    // Cursor
    chart.set(
      "cursor",
      am5xy.XYCursor.new(root, {
        behavior: "zoomX",
        lineY: { visible: false }
      })
    );

    // Intro animation
    totalSalesSeries.appear(1000);
    chart.appear(1000, 100);

    return () => {
      root.dispose();
    };
  }, [data]);

  return <div id="chartdivbar" style={{ width: "100%", height: "420px" }}></div>;
}

export default MonthlySalesBarChart;
