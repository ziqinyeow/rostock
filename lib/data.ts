// @ts-nocheck
import AWS from "aws-sdk";
import { parse } from "papaparse";

const s3 = new AWS.S3({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID || "",
    secretAccessKey: process.env.ECRET_ACCESS_KEY || "",
  },
});

type Stock = {
  Date: String;
  Open: String;
  High: String;
  Low: String;
  Close: String;
  Volume: String;
  Stock: String;
};

const groupStock = (list, key) => {
  return list.reduce((rv, x) => {
    // eslint-disable-next-line no-param-reassign
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

const _process = (stock: Stock[]) => {
  // const day = [30, 60, 90];
  const feature = Object.keys(stock[0]);
  const group: Object = groupStock(stock, "Stock");
  const stockName: [] = Object.keys(group);

  const process = {};
  for (let i = 0; i < stockName.length - 1; i += 1) {
    if (!process[stockName[i]]) {
      process[stockName[i]] = {
        trend_30: 0, // 30 days trend = 30rd - 1st day
        trend_60: 0,
        trend_90: 0,
        average_30: 0, // 30 days average
        average_60: 0,
        average_90: 0,
        best_index_30: 0, // best stock price in 30 days
        best_index_60: 0,
        best_index_90: 0,
        bad_index_30: 0, // bad stock price in 30 days
        bad_index_60: 0,
        bad_index_90: 0,
      };
      feature.forEach((p) => {
        if (p === "Date") {
          process[stockName[i]][p] = group[stockName[i]].map((g) => g?.[p]);
        } else if (p === "Stock") {
          // continue;
        } else if (p === "Close" || p === "Predicted_Close") {
          process[stockName[i]][p] = group[stockName[i]].map((g) =>
            Number(g?.[p])
          );
          const price: Number[] = process[stockName[i]][p];
          const price_30 = price.slice(0, 30);
          const price_60 = price.slice(0, 60);
          const price_90 = price;
          process[stockName[i]]["trend_30"] =
            price_30[price_30.length - 1] - price_30[0];
          process[stockName[i]]["trend_60"] =
            price_60[price_60.length - 1] - price_60[0];
          process[stockName[i]]["trend_90"] =
            price_90[price_90.length - 1] - price_90[0];

          process[stockName[i]]["average_30"] =
            price_30.reduce((a, b) => a + b, 0) / price_30.length;
          process[stockName[i]]["average_60"] =
            price_60.reduce((a, b) => a + b, 0) / price_60.length;
          process[stockName[i]]["average_90"] =
            price_90.reduce((a, b) => a + b, 0) / price_90.length;

          process[stockName[i]]["best_index_30"] = price_30.indexOf(
            Math.max(...price_30)
          );
          process[stockName[i]]["best_index_60"] = price_60.indexOf(
            Math.max(...price_60)
          );
          process[stockName[i]]["best_index_90"] = price_90.indexOf(
            Math.max(...price_90)
          );
          process[stockName[i]]["bad_index_30"] = price_30.indexOf(
            Math.min(...price_30)
          );
          process[stockName[i]]["bad_index_60"] = price_60.indexOf(
            Math.min(...price_60)
          );
          process[stockName[i]]["bad_index_90"] = price_90.indexOf(
            Math.min(...price_90)
          );
        } else {
          process[stockName[i]][p] = group[stockName[i]].map((g) =>
            Number(g?.[p])
          );
        }
      });
    }
  }
  return process;
};

const getStock = async (type: String) => {
  const params = {
    Bucket: "jomstockdata",
    Key:
      type === "ori"
        ? `stock_toweb/ori/stock_ori.csv`
        : `stock_toweb/output/stock_output.csv`,
  };

  const obj = await s3.getObject(params).promise();

  // @ts-ignore
  const text = obj.Body.toString("utf-8");
  const { data: csv } = parse(text, { header: true });
  const process = _process(csv);
  return process;
};

export default getStock;
