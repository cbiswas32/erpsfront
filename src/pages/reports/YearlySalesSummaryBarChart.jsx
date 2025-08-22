import React, { useLayoutEffect } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

function YearlySalesSummaryBarChart({ data }) {
  useLayoutEffect(() => {
    if (!data || data.length === 0) return;

    let root = am5.Root.new("chartdivmonthlybar");
    root.setThemes([am5themes_Animated.new(root)]);
    root._logo.dispose();

    // Chart container
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
        text: "Yearly Sales Report",
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
        category: x.month_name,
        totalSales: Number(x.total_sales || 0),
        totalOrders: Number(x.total_orders || 0),
        totalTax: Number(x.total_tax || 0),
        totalSubtotal: Number(x.total_subtotal || 0)
      })) || [];

    // Y Axis
    let yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, { strokeOpacity: 0.1 })
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
      rotation: -30,
      centerY: am5.p50,
      centerX: am5.p100,
      paddingRight: 10,
      fontSize: 12,
      fill: am5.color(0x2c3e50)
    });

    xAxis.data.setAll(chartData);

    // Column Series (Bars)
    let salesSeries = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        name: "Total Sales",
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "totalSales",
        categoryXField: "category",
        tooltip: am5.Tooltip.new(root, {
          labelText:
            "Month: {category}\nOrders: {totalOrders}\nSubtotal: Rs. {totalSubtotal.formatNumber('#,###.##')}\nTax: Rs. {totalTax.formatNumber('#,###.##')}\nSales: Rs. {valueY.formatNumber('#,###.##')}"
        })
      })
    );

    salesSeries.columns.template.setAll({
      strokeOpacity: 0,
      cornerRadiusTL: 6,
      cornerRadiusTR: 6,
      shadowColor: am5.color(0x000000),
      shadowBlur: 6,
      shadowOffsetY: 3,
      tooltipY: 0,
      fillGradient: am5.LinearGradient.new(root, {
        stops: [
          { color: am5.color(0x2980b9) }, // blue
          { color: am5.color(0x3498db) } // light blue
        ]
      })
    });

    salesSeries.columns.template.states.create("hover", {
      scale: 1.05,
      shadowBlur: 10,
      shadowColor: am5.color(0x1abc9c)
    });

    salesSeries.data.setAll(chartData);

    // --- Trend Line Series ---
    let trendSeries = chart.series.push(
      am5xy.LineSeries.new(root, {
        name: "Trend",
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "totalSales",
        categoryXField: "category",
        stroke: am5.color(0xe74c3c), // red trend line
        fill: am5.color(0xe74c3c),
        tooltip: am5.Tooltip.new(root, {
          labelText: "Trend: {valueY.formatNumber('#,###.##')}"
        })
      })
    );

    trendSeries.strokes.template.setAll({
      strokeWidth: 3,
      strokeDasharray: [3, 3] // dashed style
    });

    // Add bullets (points) on trend line
    trendSeries.bullets.push(() =>
      am5.Bullet.new(root, {
        sprite: am5.Circle.new(root, {
          radius: 5,
          fill: am5.color(0xe74c3c),
          stroke: am5.color(0xffffff),
          strokeWidth: 2
        })
      })
    );

    trendSeries.data.setAll(chartData);

    // Cursor
    chart.set(
      "cursor",
      am5xy.XYCursor.new(root, { behavior: "zoomX", lineY: { visible: false } })
    );

    // Animations
    salesSeries.appear(1000);
    trendSeries.appear(1000);
    chart.appear(1000, 100);

    return () => {
      root.dispose();
    };
  }, [data]);

  return (
    <div id="chartdivmonthlybar" style={{ width: "100%", height: "420px" }}></div>
  );
}

export default YearlySalesSummaryBarChart;