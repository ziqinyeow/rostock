import type { NextPage } from "next";
import { ChangeEvent, useState } from "react";
import BasicLayout from "@/layouts/BasicLayout";

const meta = {
  title: "Rostock - Predict",
  description:
    "Test our artificial intelligence model with machine learning model running at the background to serve you accurate result",
  image: "https://rostock.vercel.app/static/Home.jpg",
};

interface Form {
  HIGH: number;
  LOW: number;
  OPEN: number;
  VOLUME: number;
  EMA_30: number;
  SMA_10: number;
  MACD: number;
  RSI: number;
}

const Robot: NextPage = () => {
  // const now = new Date();
  // let current;
  // if (now.getMonth() === 11) {
  //   current = new Date(now.getFullYear() + 1, 0, 1 + 1);
  // } else {
  //   current = new Date(now.getFullYear(), now.getMonth() + 1, 1 + 1);
  // }

  const [form, setForm] = useState<Form>();
  const [nextMonthStockPrice, setNextMonthStockPrice] = useState(0);

  const handleChange = (e: ChangeEvent<HTMLElement>) => {
    // @ts-ignore
    const { name, value } = e.target;
    // @ts-ignore
    setForm({
      ...form,
      [name]: Number(value),
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const fetcher = await fetch("/api/predict", {
      method: "POST",
      body: JSON.stringify([form]),
    });
    const { result } = await fetcher.json();
    // const result = JSON.parse(predictedResult?.result);
    setNextMonthStockPrice(result);

    e.target.reset();
  };

  return (
    <BasicLayout meta={meta}>
      <div className="relative layout">
        <h3 className="font-bold">Predict</h3>
        <h4 className="mb-10">
          your{" "}
          <span className="text-primary-100 dark:text-primary-300">
            stock price
          </span>
        </h4>
        <form onSubmit={handleSubmit} className="grid w-full grid-cols-2 gap-4">
          {/* <div className="mb-10">
            <h4 className="font-bold text-gray-600 dark:text-gray-300">
              Rating
            </h4>
            <select
              className="w-full p-3 mt-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-700 dark:focus:ring-gray-500 dark:border-gray-700 dark:bg-gray-900"
              name="RATING"
              onChange={handleChange}
            >
              <option value="A+IS">A+IS</option>
              <option value="A1">A1</option>
              <option value="AA+">AA+</option>
              <option value="AA1">AA1</option>
              <option value="AA2">AA2</option>
              <option value="AA3">AA3</option>
              <option value="AAA">AAA</option>
              <option value="AAA IS">AAA IS</option>
            </select>
          </div> */}
          <div className="mb-10">
            <h4 className="font-bold text-gray-600 dark:text-gray-300">High</h4>
            <input
              className="w-full p-3 mt-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-700 dark:focus:ring-gray-500 dark:border-gray-700 dark:bg-gray-900"
              type="number"
              name="HIGH"
              step=".0001"
              placeholder="Input a number"
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-10">
            <h4 className="font-bold text-gray-600 dark:text-gray-300">Low</h4>
            <input
              className="w-full p-3 mt-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-700 dark:focus:ring-gray-500 dark:border-gray-700 dark:bg-gray-900"
              type="number"
              name="LOW"
              step=".0001"
              placeholder="Input a number"
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-10">
            <h4 className="font-bold text-gray-600 dark:text-gray-300">Open</h4>
            <input
              className="w-full p-3 mt-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-700 dark:focus:ring-gray-500 dark:border-gray-700 dark:bg-gray-900"
              type="number"
              name="OPEN"
              step=".0001"
              placeholder="Input a number"
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-10">
            <h4 className="font-bold text-gray-600 dark:text-gray-300">
              Volume
            </h4>
            <input
              className="w-full p-3 mt-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-700 dark:focus:ring-gray-500 dark:border-gray-700 dark:bg-gray-900"
              type="number"
              name="VOLUME"
              step=".0001"
              placeholder="Input a number"
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-10">
            <h4 className="font-bold text-gray-600 dark:text-gray-300">
              EMA 30
            </h4>
            <input
              className="w-full p-3 mt-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-700 dark:focus:ring-gray-500 dark:border-gray-700 dark:bg-gray-900"
              type="number"
              name="EMA_30"
              step=".0001"
              placeholder="Input a number"
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-10">
            <h4 className="font-bold text-gray-600 dark:text-gray-300">
              SMA 10
            </h4>
            <input
              className="w-full p-3 mt-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-700 dark:focus:ring-gray-500 dark:border-gray-700 dark:bg-gray-900"
              type="number"
              name="SMA_10"
              step=".0001"
              placeholder="Input a number"
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-10">
            <h4 className="font-bold text-gray-600 dark:text-gray-300">MACD</h4>
            <input
              className="w-full p-3 mt-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-700 dark:focus:ring-gray-500 dark:border-gray-700 dark:bg-gray-900"
              type="number"
              name="MACD"
              step=".0001"
              placeholder="Input a number"
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-10">
            <h4 className="font-bold text-gray-600 dark:text-gray-300">RSI</h4>
            <input
              className="w-full p-3 mt-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-700 dark:focus:ring-gray-500 dark:border-gray-700 dark:bg-gray-900"
              type="number"
              name="RSI"
              step=".0001"
              placeholder="Input a number"
              onChange={handleChange}
              required
            />
          </div>

          <div className="w-full col-span-2">
            <button
              disabled
              className="w-full px-4 py-2 text-white border rounded-md dark:border-gray-700 bg-primary-100 hover:bg-primary-300 hover:text-black"
              type="submit"
            >
              Predict
            </button>
          </div>
        </form>
        {nextMonthStockPrice !== 0 && (
          <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-gray-200 bg-opacity-30 dark:bg-black dark:bg-opacity-25">
            <div className="relative flex items-center justify-center p-20 text-center bg-black rounded-lg shadow-2xl text-gray-50 dark:bg-gray-50 dark:text-black">
              <h3>
                {nextMonthStockPrice > 0
                  ? `Predicted Stock Price: RM ${
                      Math.round(
                        (Number(nextMonthStockPrice) + Number.EPSILON) * 10000
                      ) / 10000
                    }`
                  : "Please input a valid data"}
              </h3>
              <button
                type="button"
                onClick={() => setNextMonthStockPrice(0)}
                className="absolute top-0 right-0 px-3 py-1 bg-primary-100 hover:bg-primary-300 text-gray-50"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="m16.192 6.344-4.243 4.242-4.242-4.242-1.414 1.414L10.535 12l-4.242 4.242 1.414 1.414 4.242-4.242 4.243 4.242 1.414-1.414L13.364 12l4.242-4.242z"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </BasicLayout>
  );
};

export default Robot;
