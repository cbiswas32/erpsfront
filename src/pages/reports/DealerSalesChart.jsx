import React, { useLayoutEffect } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

function DealerSalesChart({ dealerData = {} }) {
  useLayoutEffect(() => {
    if (!dealerData || Object.keys(dealerData).length === 0) return;

    let root = am5.Root.new("dealerChartDiv");
    root.setThemes([am5themes_Animated.new(root)]);
    root._logo.dispose();

    let chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        wheelX: "none",
        wheelY: "none",
        layout: root.verticalLayout
      })
    );

    // Convert dealerData to array
    const chartData = Object.entries(dealerData).map(([dealer, stats]) => ({
      dealer,
      orders: stats.orders,
      totalSales: stats.totalSales
    }));

    // X Axis (Dealers)
    const xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: "dealer",
        renderer: am5xy.AxisRendererX.new(root, {
          minGridDistance: 50,
          cellStartLocation: 0.1,
          cellEndLocation: 0.9
        })
      })
    );
    xAxis.data.setAll(chartData);
    xAxis.get("renderer").labels.template.setAll({
      rotation: -45,
      centerY: am5.p50,
      fontSize: 14
    });

    // Y Axis (Total Sales)
    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {
          minGridDistance: 50,
          strokeOpacity: 0.2
        })
      })
    );

    // Gradient Column Series (Total Sales)
    const salesSeries = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        name: "Total Sales",
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "totalSales",
        categoryXField: "dealer",
        sequencedInterpolation: true,
        tooltip: am5.Tooltip.new(root, {
          labelText:
            "[bold]{dealer}[/]\nOrders: {orders}\nSales: ₹{totalSales.formatNumber('#,###.00')}"
        })
      })
    );

    salesSeries.columns.template.setAll({
      width: am5.percent(70),
      cornerRadiusTL: 12,
      cornerRadiusTR: 12,
      fillGradient: am5.LinearGradient.new(root, {
        rotation: 90,
        stops: [
          { color: am5.color(0xff9a9e) },
          { color: am5.color(0xfad0c4) }
        ]
      }),
      strokeOpacity: 0,
      tooltipY: 0,
      shadowColor: am5.color(0x000000),
      shadowBlur: 10,
      shadowOffsetY: 4
    });

    salesSeries.data.setAll(chartData);

    // Cursor
    chart.set(
      "cursor",
      am5xy.XYCursor.new(root, {
        behavior: "none",
        lineY: { visible: false },
        lineX: { visible: false }
      })
    );

    // Title Label (Full Width)
    chart.children.unshift(
      am5.Label.new(root, {
        text: "Dealer-wise Total Sales",
        fontSize: 26,
        fontWeight: "700",
        x: am5.percent(50),
        centerX: am5.percent(50),
        paddingBottom: 20
      })
    );

    // Animate appearance
    chart.appear(1000, 100);
    salesSeries.appear(1000);

    return () => {
      root.dispose();
    };
  }, [dealerData]);

  return (
    <div
      id="dealerChartDiv"
      style={{ width: "100%", height: "600px", margin: "0 auto" }}
    ></div>
  );
}

export default DealerSalesChart;
