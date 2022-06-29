// @ts-nocheck
import React, { useEffect, useState, useRef } from "react";
import { init, dispose } from "klinecharts";
// import Layout from "../Layout";

const generatedKLineDataList = (
  baseTimestamp = Date.now(),
  basePrice = 5000,
  dataSize = 800
) => {
  const dataList = [];
  let timestamp = Math.floor(baseTimestamp / 60 / 1000) * 60 * 1000;
  let baseValue = basePrice;
  const prices = [];
  for (let i = 0; i < dataSize; i++) {
    baseValue = baseValue + Math.random() * 20 - 10;
    for (let j = 0; j < 4; j++) {
      prices[j] = (Math.random() - 0.5) * 12 + baseValue;
    }
    prices.sort();
    const openIdx = +Math.round(Math.random() * 3).toFixed(0);
    let closeIdx = +Math.round(Math.random() * 2).toFixed(0);
    if (closeIdx === openIdx) {
      closeIdx++;
    }
    const volume = Math.random() * 50 + 10;
    const kLineModel = {
      open: prices[openIdx],
      low: prices[0],
      high: prices[3],
      close: prices[closeIdx],
      volume,
      timestamp,
    };
    timestamp -= 60 * 1000;
    kLineModel.turnover =
      ((kLineModel.open + kLineModel.close + kLineModel.high + kLineModel.low) /
        4) *
      volume;
    dataList.unshift(kLineModel);
  }
  return dataList;
};

const mainTechnicalIndicatorTypes = [
  "MA",
  "EMA",
  "SMA",
  "VOL",
  "MACD",
  "RSI",
  "BBI",
  "BOLL",
  "KDJ",
];

export default function TechnicalIndicatorKLineChart({ stock }) {
  const chart = useRef();
  const paneId = useRef();
  const [mounted, setMounted] = useState(false);
  const [rerender, setRerender] = useState(false);

  useEffect(() => {
    //   const { chart, pane } = init_chart();
    // setKLineChart(chart);
    // setPaneTag(pane);
    chart.current = init("technical-indicator-k-line");
    chart?.current?.setStyleOptions({
      candle: {
        tooltip: {
          labels: [
            "Time: ",
            "Open: ",
            "Close: ",
            "High: ",
            "Low: ",
            "Volumn: ",
          ],
        },
      },
    });
    // chart.current.addTechnicalIndicatorTemplate(emojiTechnicalIndicator);
    // paneId.current = chart.current.createTechnicalIndicator("VOL", false);
    chart.current.applyNewData(generatedKLineDataList());
    setMounted(true);
    return () => {
      dispose("technical-indicator-k-line");
    };
  }, [rerender]);

  return (
    <div className="w-full">
      <div className="layout">
        <div className="flex items-center justify-end w-full">
          {mounted && (
            <div className="mx-4">
              <div className="mb-10">
                <select
                  className="p-3 mt-3 font-bold transition-all border rounded-md bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 focus:outline-none"
                  name="indicator"
                  onChange={(e) => {
                    setRerender(!rerender);
                  }}
                >
                  {stock?.map((type) => {
                    return (
                      <option key={type["STOCK NAME"]} value={type}>
                        {type["STOCK NAME"]}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
          )}
          {mounted && (
            <div className="space-x-4">
              <div className="mb-10">
                <select
                  className="p-3 mt-3 font-bold transition-all border rounded-md bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 focus:outline-none"
                  name="indicator"
                  onChange={(e) => {
                    chart.current &&
                      chart.current.createTechnicalIndicator(
                        e.target.value,
                        false,
                        {
                          id: "candle_pane",
                        }
                      );
                  }}
                >
                  {mainTechnicalIndicatorTypes.map((type) => {
                    return (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
          )}
        </div>
      </div>
      <div id="technical-indicator-k-line" className="w-full layout h-[65vh]" />
    </div>
  );
}
