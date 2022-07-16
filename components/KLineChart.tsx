// @ts-nocheck
import React, { useEffect, useState, useRef } from "react";
import { init, dispose } from "klinecharts";
import { checkCoordinateOnSegment } from "klinecharts/lib/shape/shapeHelper";
// import Layout from "../Layout";

// predicted - rsi - macd

// const generatedKLineDataList = (
//   baseTimestamp = Date.now(),
//   basePrice = 5000,
//   dataSize = 800
// ) => {
//   const dataList = [];
//   let timestamp = Math.floor(baseTimestamp / 60 / 1000) * 60 * 1000;
//   let baseValue = basePrice;
//   const prices = [];
//   for (let i = 0; i < dataSize; i++) {
//     baseValue = baseValue + Math.random() * 20 - 10;
//     for (let j = 0; j < 4; j++) {
//       prices[j] = (Math.random() - 0.5) * 12 + baseValue;
//     }
//     prices.sort();
//     const openIdx = +Math.round(Math.random() * 3).toFixed(0);
//     let closeIdx = +Math.round(Math.random() * 2).toFixed(0);
//     if (closeIdx === openIdx) {
//       closeIdx++;
//     }
//     const volume = Math.random() * 50 + 10;
//     const kLineModel = {
//       open: prices[openIdx],
//       low: prices[0],
//       high: prices[3],
//       volume,
//       timestamp,
//       close: prices[closeIdx],
//     };
//     timestamp -= 60 * 1000;
//     kLineModel.turnover =
//       ((kLineModel.open + kLineModel.close + kLineModel.high + kLineModel.low) /
//         4) *
//       volume;
//     dataList.unshift(kLineModel);
//   }

//   return dataList;
// };

const generatedKLineDataList = (stock) => {
  const dataList = [];

  for (let i = 0; i < stock?.["Date"]?.length; i++) {
    const kLineModel = {
      open: stock["Open"][i],
      low: stock["Low"][i],
      high: stock["High"][i],
      volume: stock["Volume"][i],
      timestamp: new Date(stock["Date"][i]).getTime(),
      close: stock["Close"][i],
    };
    dataList.push(kLineModel);
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

const rect = {
  name: "rect",
  totalStep: 3,
  checkEventCoordinateOnShape: ({ dataSource, eventCoordinate }) => {
    return checkCoordinateOnSegment(
      dataSource[0],
      dataSource[1],
      eventCoordinate
    );
  },
  createShapeDataSource: ({ coordinates }) => {
    if (coordinates.length === 2) {
      return [
        {
          type: "line",
          isDraw: false,
          isCheck: true,
          dataSource: [
            [
              { ...coordinates[0] },
              { x: coordinates[1].x, y: coordinates[0].y },
            ],
            [
              { x: coordinates[1].x, y: coordinates[0].y },
              { ...coordinates[1] },
            ],
            [
              { ...coordinates[1] },
              { x: coordinates[0].x, y: coordinates[1].y },
            ],
            [
              { x: coordinates[0].x, y: coordinates[1].y },
              { ...coordinates[0] },
            ],
          ],
        },
        {
          type: "polygon",
          isDraw: true,
          isCheck: false,
          styles: { style: "fill" },
          dataSource: [
            [
              { ...coordinates[0] },
              { x: coordinates[1].x, y: coordinates[0].y },
              { ...coordinates[1] },
              { x: coordinates[0].x, y: coordinates[1].y },
            ],
          ],
        },
        {
          type: "polygon",
          isDraw: true,
          isCheck: false,
          dataSource: [
            [
              { ...coordinates[0] },
              { x: coordinates[1].x, y: coordinates[0].y },
              { ...coordinates[1] },
              { x: coordinates[0].x, y: coordinates[1].y },
            ],
          ],
        },
      ];
    }
    return [];
  },
};

const circle = {
  name: "circle",
  totalStep: 3,
  checkEventCoordinateOnShape: ({ dataSource, eventCoordinate }) => {
    const xDis = Math.abs(dataSource.x - eventCoordinate.x);
    const yDis = Math.abs(dataSource.y - eventCoordinate.y);
    const r = Math.sqrt(xDis * xDis + yDis * yDis);
    return Math.abs(r - dataSource.radius) < 3;
  },
  createShapeDataSource: ({ coordinates }) => {
    if (coordinates.length === 2) {
      const xDis = Math.abs(coordinates[0].x - coordinates[1].x);
      const yDis = Math.abs(coordinates[0].y - coordinates[1].y);
      const radius = Math.sqrt(xDis * xDis + yDis * yDis);
      return [
        {
          type: "arc",
          isDraw: true,
          isCheck: false,
          styles: { style: "fill" },
          dataSource: [
            { ...coordinates[0], radius, startAngle: 0, endAngle: Math.PI * 2 },
          ],
        },
        {
          type: "arc",
          isDraw: true,
          isCheck: true,
          dataSource: [
            { ...coordinates[0], radius, startAngle: 0, endAngle: Math.PI * 2 },
          ],
        },
      ];
    }
    return [];
  },
};

const drawLines = [
  { key: "priceLine", text: "price" },
  { key: "priceChannelLine", text: "price_channel" },
  { key: "parallelStraightLine", text: "parallel" },
  { key: "fibonacciLine", text: "fibonacci" },
  { key: "rect", text: "rect" },
  { key: "circle", text: "circle" },
];

export default function TechnicalIndicatorKLineChart({ stock, stock_list }) {
  const chart = useRef();
  const paneId = useRef();
  const [mounted, setMounted] = useState(false);
  const [stockName, setStockName] = useState("AHEALTH");

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
    chart.current.addShapeTemplate([rect, circle]);
    chart.current.applyNewData(generatedKLineDataList(stock[stockName]));
    chart.current.createTechnicalIndicator("MA", false, {
      id: "candle_pane",
    });
    setMounted(true);
    return () => {
      dispose("technical-indicator-k-line");
    };
  }, [stockName]);

  return (
    <div className="w-full">
      <div className="layout">
        <div className="w-full">
          {mounted && (
            <div className="flex items-center justify-between w-full mb-10">
              <div className="">
                <button
                  className="p-3 mr-1 transition-all duration-300 bg-gray-100 border-2 rounded-md dark:border-gray-700 dark:hover:border-gray-600 hover:rounded-lg dark:bg-gray-700 border-gray-50 hover:border-gray-800 hover:bg-gray-200"
                  onClick={(_) => {
                    chart.current &&
                      chart.current.createShape(drawLines[0].key);
                  }}
                >
                  <svg className="w-7 h-7" viewBox="0 0 24 24">
                    <rect x="5" y="11.5" width="14" height="1" rx="0.5"></rect>
                    <ellipse cx="6" cy="12" rx="1.5" ry="1.5"></ellipse>
                    <ellipse cx="18" cy="12" rx="1.5" ry="1.5"></ellipse>
                  </svg>
                </button>
                <button
                  className="p-3 mr-1 transition-all duration-300 bg-gray-100 border-2 rounded-md dark:border-gray-700 dark:hover:border-gray-600 hover:rounded-lg dark:bg-gray-700 border-gray-50 hover:border-gray-800 hover:bg-gray-200"
                  onClick={(_) => {
                    chart.current &&
                      chart.current.createShape(drawLines[1].key);
                  }}
                >
                  <svg className="w-7 h-7" viewBox="0 0 24 24">
                    <rect
                      x="5.989593505859375"
                      y="17.303298950195312"
                      width="16"
                      height="1"
                      rx="0.5"
                      transform="matrix(0.7071067690849304,-0.7071067690849304,0.7071067690849304,0.7071067690849304,-10.480968421384205,9.30330124707234)"
                    ></rect>
                    <rect
                      x="5.031974792480469"
                      y="13.607009887695312"
                      width="12"
                      height="1"
                      rx="0.5"
                      transform="matrix(0.7071067690849304,-0.7071067690849304,-0.7071067690849304,-0.7071067690849304,11.095440153447726,26.786762123917924)"
                    ></rect>
                    <rect
                      x="11.40380859375"
                      y="19.303298950195312"
                      width="12"
                      height="1"
                      rx="0.5"
                      transform="matrix(0.7071067690849304,-0.7071067690849304,-0.7071067690849304,-0.7071067690849304,16.98959169711361,41.016502553537975)"
                    ></rect>
                    <ellipse cx="14" cy="10" rx="1.5" ry="1.5"></ellipse>
                    <ellipse cx="10" cy="14" rx="1.5" ry="1.5"></ellipse>
                    <ellipse cx="15" cy="15" rx="1.5" ry="1.5"></ellipse>
                  </svg>
                </button>
                <button
                  className="p-3 mr-1 transition-all duration-300 bg-gray-100 border-2 rounded-md dark:border-gray-700 dark:hover:border-gray-600 hover:rounded-lg dark:bg-gray-700 border-gray-50 hover:border-gray-800 hover:bg-gray-200"
                  onClick={(_) => {
                    chart.current &&
                      chart.current.createShape(drawLines[2].key);
                  }}
                >
                  <svg className="w-7 h-7" viewBox="0 0 24 24">
                    <rect
                      x="7.989593505859375"
                      y="20.303314208984375"
                      width="16"
                      height="1"
                      rx="0.5"
                      transform="matrix(0.7071067690849304,-0.7071067690849304,0.7071067690849304,0.7071067690849304,-12.016513056401891,11.596198947183439)"
                    ></rect>
                    <rect
                      x="3.4586830139160156"
                      y="15.292892456054688"
                      width="16"
                      height="1"
                      rx="0.5"
                      transform="matrix(0.7071067690849304,-0.7071067690849304,0.7071067690849304,0.7071067690849304,-9.800682931907204,6.924842852749634)"
                    ></rect>
                    <ellipse cx="16" cy="13" rx="1.5" ry="1.5"></ellipse>
                    <ellipse cx="12" cy="17" rx="1.5" ry="1.5"></ellipse>
                    <ellipse cx="9.5" cy="10" rx="1.5" ry="1.5"></ellipse>
                  </svg>
                </button>
                <button
                  className="p-3 mr-1 transition-all duration-300 bg-gray-100 border-2 rounded-md dark:border-gray-700 dark:hover:border-gray-600 hover:rounded-lg dark:bg-gray-700 border-gray-50 hover:border-gray-800 hover:bg-gray-200"
                  onClick={(_) => {
                    chart.current &&
                      chart.current.createShape(drawLines[3].key);
                  }}
                >
                  <svg className="w-7 h-7" viewBox="0 0 24 24">
                    <rect x="4" y="6" width="16" height="1" rx="0.5"></rect>
                    <rect x="4" y="9" width="16" height="1" rx="0.5"></rect>
                    <rect x="4" y="15" width="16" height="1" rx="0.5"></rect>
                    <rect x="4" y="18" width="16" height="1" rx="0.5"></rect>
                    <rect x="4" y="12" width="16" height="1" rx="0.5"></rect>
                    <ellipse cx="12" cy="18.5" rx="1.5" ry="1.5"></ellipse>
                    <ellipse cx="16" cy="6.5" rx="1.5" ry="1.5"></ellipse>
                    <ellipse cx="8" cy="6.5" rx="1.5" ry="1.5"></ellipse>
                  </svg>
                </button>
                <button
                  className="p-3 mr-1 transition-all duration-300 bg-gray-100 border-2 rounded-md dark:border-gray-700 dark:hover:border-gray-600 hover:rounded-lg dark:bg-gray-700 border-gray-50 hover:border-gray-800 hover:bg-gray-200"
                  onClick={(_) => {
                    chart.current &&
                      chart.current.createShape(drawLines[4].key);
                  }}
                >
                  <svg
                    // className="w-7 h-7"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                  >
                    <path d="M20 3H4a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1zm-1 16H5V5h14v14z"></path>
                  </svg>
                </button>
                <button
                  className="p-3 mr-1 transition-all duration-300 bg-gray-100 border-2 rounded-md dark:border-gray-700 dark:hover:border-gray-600 hover:rounded-lg dark:bg-gray-700 border-gray-50 hover:border-gray-800 hover:bg-gray-200"
                  onClick={(_) => {
                    chart.current &&
                      chart.current.createShape(drawLines[5].key);
                  }}
                >
                  <svg
                    // className="w-7 h-7"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                  >
                    <path d="M12 2C6.486 2 2 6.486 2 12c.001 5.515 4.487 10.001 10 10.001 5.514 0 10-4.486 10.001-10.001 0-5.514-4.486-10-10.001-10zm0 18.001c-4.41 0-7.999-3.589-8-8.001 0-4.411 3.589-8 8-8 4.412 0 8.001 3.589 8.001 8-.001 4.412-3.59 8.001-8.001 8.001z"></path>
                  </svg>
                </button>
                <button
                  className="p-3 mr-1 transition-all duration-300 bg-gray-100 border-2 rounded-md dark:border-gray-700 dark:hover:border-gray-600 hover:rounded-lg dark:bg-gray-700 border-gray-50 hover:border-gray-800 hover:bg-gray-200"
                  onClick={(_) => {
                    chart.current && chart.current.removeShape();
                  }}
                >
                  <svg viewBox="0 0 1024 1024" className="w-7 h-7">
                    <path d="M256 333.872a28.8 28.8 0 0 1 28.8 28.8V768a56.528 56.528 0 0 0 56.544 56.528h341.328A56.528 56.528 0 0 0 739.2 768V362.672a28.8 28.8 0 0 1 57.6 0V768a114.128 114.128 0 0 1-114.128 114.128H341.328A114.128 114.128 0 0 1 227.2 768V362.672a28.8 28.8 0 0 1 28.8-28.8zM405.344 269.648a28.8 28.8 0 0 0 28.8-28.8 56.528 56.528 0 0 1 56.528-56.544h42.656a56.528 56.528 0 0 1 56.544 56.544 28.8 28.8 0 0 0 57.6 0 114.128 114.128 0 0 0-112.64-114.128h-45.648a114.144 114.144 0 0 0-112.64 114.128 28.8 28.8 0 0 0 28.8 28.8z"></path>
                    <path d="M163.2 266.672a28.8 28.8 0 0 1 28.8-28.8h640a28.8 28.8 0 0 1 0 57.6H192a28.8 28.8 0 0 1-28.8-28.8zM426.672 371.2a28.8 28.8 0 0 1 28.8 28.8v320a28.8 28.8 0 0 1-57.6 0V400a28.8 28.8 0 0 1 28.8-28.8zM597.344 371.2a28.8 28.8 0 0 1 28.8 28.8v320a28.8 28.8 0 0 1-57.6 0V400a28.8 28.8 0 0 1 28.8-28.8z"></path>
                  </svg>
                </button>
              </div>

              <div className="flex items-center">
                <div className="mr-4">
                  <select
                    className="p-3 font-bold transition-all border rounded-md bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 focus:outline-none"
                    name="indicator"
                    onChange={(e) => {
                      setStockName(e.target.value);
                    }}
                  >
                    {stock_list?.map((type) => {
                      return (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      );
                    })}
                  </select>
                </div>
                {mounted && (
                  <div className="space-x-4">
                    <div className="">
                      <select
                        className="p-3 font-bold transition-all border rounded-md bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 focus:outline-none"
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
                          paneId.current =
                            chart.current.createTechnicalIndicator(
                              e.target.value,
                              false,
                              {
                                id: "candle_pane_id",
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
          )}
        </div>
      </div>
      <div id="technical-indicator-k-line" className="w-full layout h-[65vh]" />
    </div>
  );
}
