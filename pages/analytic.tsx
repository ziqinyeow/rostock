import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import Link from "next/link";
import { useState } from "react";
import BasicLayout from "@/layouts/BasicLayout";
import getStock from "@/lib/data";

const meta = {
  title: "Rostock - Analytics",
  description:
    "This page display the TOP 100 stock predicted by our artificial intelligence machine learning model. Users can search the bond to identify the next month trend",
  image: "https://rostock.vercel.app/static/Home.jpg",
};

const Analytics: NextPage = ({
  stock,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [searchValue, setSearchValue] = useState("");
  const [viewDay, setViewDay] = useState(30);
  const [sliceNum, setSliceNum] = useState(22);
  const _stock =
    sliceNum === 22
      ? Object.fromEntries(
          Object?.entries(stock)
            .sort(
              ([, a], [, b]) =>
                // @ts-ignore
                b?.[`trend_${viewDay}`] - a?.[`trend_${viewDay}`]
            )
            .filter(([key]) =>
              key?.toLowerCase().includes(searchValue.toLowerCase())
            )
        )
      : Object.fromEntries(
          Object?.entries(stock)
            .sort(
              ([, a], [, b]) =>
                // @ts-ignoreß
                b?.[`trend_${viewDay}`] - a?.[`trend_${viewDay}`]
            )
            .slice(0, sliceNum)
        );

  // const filterData = stock?.filter(
  //   (d) =>
  //     d?.RATING?.toLowerCase().includes(searchValue.toLowerCase()) ||
  //     d?.["STOCK CODE"]?.toLowerCase().includes(searchValue.toLowerCase()) ||
  //     d?.["STOCK NAME"]?.toLowerCase().includes(searchValue.toLowerCase())
  // );

  return (
    <BasicLayout meta={meta}>
      <div className="layout">
        <h3 className="mb-6 font-bold">
          Stock Statistics in next{" "}
          <select
            onChange={(e) => {
              setViewDay(Number(e.target.value));
            }}
          >
            <option value="30">30</option>
            <option value="60">60</option>
            <option value="90">90</option>
          </select>{" "}
          days
        </h3>
        <div className="relative w-full mb-4 group">
          <div className="absolute transition duration-500 rounded-md -inset-0.5 bg-gradient-to-r from-primary-100 to-primary-200 dark:from-primary-400 dark:to-primary-300 opacity-20 group-hover:duration-200 group-hover:opacity-100 blur" />
          <input
            className="relative w-full p-3 bg-white rounded-md dark:bg-gray-900 focus:outline-none focus:ring focus:ring-primary-100"
            type="text"
            placeholder="Search stock name or type 'top 10'"
            onChange={(e) => {
              if (e.target.value.toLowerCase().startsWith("top")) {
                const n = Number(e.target.value.split("top")[1].trim());
                setSliceNum(n);
              } else {
                setSliceNum(22);
                setSearchValue(e.target.value);
              }
            }}
          />
        </div>
        <div className="flex justify-end w-full mb-10 text-gray-500">
          {Object.keys(_stock)?.length}{" "}
          {/* {filterdata?.length && filterData?.length <= 1 ? "bond" : "bonds"} */}
        </div>
        {Object.keys(_stock)?.length === 0 ? (
          <div>
            <div>Stock {searchValue} not found.</div>
            <div>You can try with our API to retrieve the data</div>
          </div>
        ) : (
          <div className="relative w-full mb-10">
            <div className="absolute transition duration-500 rounded-md -inset-0.5 bg-gradient-to-r from-primary-100 to-primary-200 dark:from-primary-400 dark:to-primary-300 opacity-10 blur" />
            <div className="grid w-full grid-cols-11 py-3 text-center">
              <h4 className="col-span-1 font-bold">Rank</h4>
              <h4 className="col-span-2 font-bold">Stock Name</h4>
              <h4 className="col-span-2 font-bold">{viewDay} Days Trend</h4>
              <h4 className="col-span-2 font-bold">{viewDay} Days Average</h4>
              <h4 className="col-span-2 font-bold">Lowest Price at Day</h4>
              <h4 className="col-span-2 font-bold">Highest Price at Day</h4>
            </div>
          </div>
        )}

        {Object.keys(_stock)?.map((key, index) => (
          <Link key={key} href={`/analytics/${key}`}>
            <a className="relative w-full mb-4 group">
              <div className="absolute transition duration-500 rounded-md -inset-0.5 bg-gradient-to-r from-primary-100 to-primary-200 dark:from-primary-400 dark:to-primary-300 opacity-20 group-hover:duration-200 group-hover:opacity-100 blur" />
              <div className="relative grid w-full grid-cols-11 py-5 text-center bg-white rounded-md dark:bg-gray-900">
                <h5 className="break-all">{index + 1}</h5>
                <h5 className="col-span-2 break-all">{key ?? "--"}</h5>
                {/* <h5 className="col-span-2 break-all">
                  <span className="px-2 py-1 text-sm border rounded dark:border-gray-700">
                    {d?.RATING}
                  </span>
                </h5> */}
                <h5 className="col-span-2 break-all">
                  {Math.round(
                    (Number(stock[key]?.[`trend_${viewDay}`]) +
                      Number.EPSILON) *
                      100
                  ) / 100}
                </h5>
                <h5 className="col-span-2 break-all">
                  {Math.round(
                    (Number(stock[key]?.[`average_${viewDay}`]) +
                      Number.EPSILON) *
                      100
                  ) / 100}
                </h5>
                <h5 className="col-span-2 break-all">
                  {stock[key]?.[`bad_index_${viewDay}`]}
                </h5>
                <h5 className="col-span-2 break-all">
                  {stock[key]?.[`best_index_${viewDay}`]}
                </h5>
              </div>
            </a>
          </Link>
        ))}
      </div>
    </BasicLayout>
  );
};

export default Analytics;

export const getServerSideProps: GetServerSideProps = async () => {
  const stock = await getStock("predict");

  return {
    props: { stock },
  };
};
