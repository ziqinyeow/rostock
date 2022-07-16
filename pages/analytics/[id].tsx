import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import { useTheme } from "next-themes";
import getStock from "@/lib/data";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import BasicLayout from "@/layouts/BasicLayout";
import CircularProgressBar from "@/components/CircularProgressBar";
import { useState } from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Analytics: NextPage = ({
  stock,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const meta = {
    title: `Robond - ${stock?.["Stock"]}`,
    description: `Rank bond with insightful and relavant information display to you dynamically`,
    image: "https://robond.vercel.app/static/Home.jpg",
  };
  const { resolvedTheme } = useTheme();
  const [viewDay, setViewDay] = useState(30);
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
    scales: {
      ticks: { beginAtZero: true },
    },
  };

  const data = {
    labels: stock["Date"].slice(0, viewDay),
    datasets: [
      {
        label: "Actual",
        data: stock["Actual_Close"].slice(0, viewDay),
        backgroundColor: `${resolvedTheme === "light" ? "#8833ff" : "#2BEBC8"}`,
      },
      {
        label: "Prediction",
        data: stock["Predicted_Close"].slice(0, viewDay),
        backgroundColor: `${resolvedTheme === "light" ? "#2BEBC8" : "#8833ff"}`,
      },
    ],
  };

  return (
    <BasicLayout meta={meta}>
      <div className="layout">
        <div className="flex items-center justify-between w-full">
          <h1 className="mb-2 font-bold">{stock?.["Stock"]}</h1>
          {/* <h4 className="px-4 py-2 font-semibold border-2 rounded dark:border-gray-700">
            Rank {stock?.RANK}
          </h4> */}
        </div>
        <div className="grid w-full gap-3 mt-10 mb-4 md:gap-4 sm:grid-cols-3">
          <div className="flex flex-col justify-between p-6 border rounded-md theme_card sm:col-span-2 dark:border-gray-700">
            <h3 className="mb-3 font-semibold">
              Predicted Stock Price for tomorrow:
            </h3>
            <h1>
              <span className="text-2xl font-bold md:text-3xl">RM </span>
              {Math.round(
                (Number(stock["Predicted_Close"][0]) + Number.EPSILON) * 100
              ) / 100}
            </h1>
            <h6>
              {Math.round(
                (Math.abs(
                  Number(stock?.["Predicted_Close"][0]) -
                    Number(stock?.["Actual_Close"][0])
                ) +
                  Number.EPSILON) *
                  1000
              ) / 1000}{" "}
              compared to actual
            </h6>
          </div>
          <div className="flex flex-col justify-between p-6 text-white border rounded-md dark:border-gray-700 from-primary-100 to-primary-200 dark:from-primary-400 dark:to-primary-300 bg-gradient-to-l">
            <h3 className="font-semibold">Average Price for Next 90 Days:</h3>
            <h2>
              RM{" "}
              {Math.round(
                (Number(stock?.["average_90"]) + Number.EPSILON) * 100
              ) / 100}
              {/* <span className="text-xl md:text-2xl">%</span> */}
            </h2>
          </div>
        </div>

        <div className="grid w-full grid-cols-1 gap-3 mb-4 md:gap-4 sm:grid-cols-2">
          <div className="p-6 border rounded-md dark:border-gray-700">
            <h3 className="mb-3 font-semibold text-center">Best Time to Buy</h3>
            <div className="flex items-center justify-center">
              <div className="flex flex-col items-center justify-center p-3 rounded">
                <h1>
                  {
                    // @ts-ignore
                    new Date(stock?.["Date"][stock?.["bad_index_90"]]).getDate()
                  }
                </h1>
                <h5>
                  {new Date(
                    // @ts-ignore
                    stock?.["Date"][stock?.["bad_index_90"]]
                  ).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                  })}
                </h5>
              </div>
            </div>
          </div>
          <div className="p-6 border rounded-md dark:border-gray-700">
            <h3 className="mb-3 font-semibold text-center">
              Best Time to Sell
            </h3>
            <div className="flex items-center justify-center">
              <div className="flex flex-col items-center justify-center p-3 rounded">
                <h1>
                  {
                    // @ts-ignore
                    new Date(
                      stock?.["Date"][stock?.["best_index_90"]]
                    ).getDate()
                  }
                </h1>
                <h5>
                  {new Date(
                    // @ts-ignore
                    stock?.["Date"][stock?.["best_index_90"]]
                  ).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                  })}
                </h5>
              </div>
            </div>
          </div>
        </div>
        <div className="grid w-full grid-cols-1 gap-3 mb-4 md:gap-4 sm:grid-cols-3">
          <div className="p-6 border rounded-md dark:border-gray-700">
            <h3 className="mb-4 font-semibold text-center">
              Stock Next 30 Days
            </h3>
            <div className="flex items-center justify-center w-full mt-5 dark:text-gray-50">
              <div className="flex items-center justify-center w-48">
                <CircularProgressBar
                  percentage={
                    Math.round(
                      (Number(stock?.["trend_30"]) + Number.EPSILON) * 10000
                    ) / 100
                  }
                />
              </div>
            </div>
          </div>
          <div className="p-6 border rounded-md dark:border-gray-700">
            <h3 className="mb-4 font-semibold text-center">
              Stock Next 60 Days
            </h3>
            <div className="flex items-center justify-center w-full mt-5 dark:text-gray-50">
              <div className="flex items-center justify-center w-48">
                <CircularProgressBar
                  percentage={
                    Math.round(
                      (Number(stock?.["trend_60"]) + Number.EPSILON) * 10000
                    ) / 100
                  }
                />
              </div>
            </div>
          </div>
          <div className="p-6 border rounded-md dark:border-gray-700">
            <h3 className="mb-4 font-semibold text-center">
              Stock Next 90 Days
            </h3>
            <div className="flex items-center justify-center w-full mt-5 dark:text-gray-50">
              <div className="flex items-center justify-center w-48">
                <CircularProgressBar
                  percentage={
                    Math.round(
                      (Number(stock?.["trend_90"]) + Number.EPSILON) * 10000
                    ) / 100
                  }
                />
              </div>
            </div>
          </div>
        </div>
        <div className="w-full p-6 border rounded-md sm:col-span-2 dark:border-gray-700">
          <h3 className="mb-4 font-semibold">
            Predicted vs Actual Stock in{" "}
            <select
              onChange={(e) => {
                setViewDay(Number(e.target.value));
              }}
            >
              <option value="30">30</option>
              <option value="60">60</option>
              <option value="90">90</option>
            </select>{" "}
            Days
          </h3>
          <div className="w-full">
            <Line options={options} data={data} />
          </div>
        </div>
      </div>
    </BasicLayout>
  );
};

export default Analytics;

// export const getStaticPaths: GetStaticPaths = async () => {
//   const { result }: any = await getBond(100);

//   return {
//     // @ts-ignore
//     paths: result.map((res) => ({
//       // eslint-disable-next-line prefer-template
//       params: { id: res["STOCK CODE"]?.toString() },
//     })),
//     fallback: true,
//   };
// };

// export const getServerSideProps: GetServerSideProps = async ({ params }) => {
//   // const { result, bondPriceHistory, bondReturnHistory }: any =
//   //   // @ts-ignore
//   //   await getBondByStockCode(params?.id);
//   const result = data.find((d) => params?.id === d["STOCK CODE"]);

//   return {
//     props: { result, bondPriceHistory: null, bondReturnHistory: null },
//   };
// };

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const stock = await getStock("predict");
  // @ts-ignore
  let _stock = stock[params?.id];
  _stock["Stock"] = params?.id;

  return {
    props: { stock: _stock },
  };
};
