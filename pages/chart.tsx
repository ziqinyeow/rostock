import type { GetServerSideProps, NextPage } from "next";
// import Link from "next/link";
// import { useState } from "react";
// import { getBond } from "lib/data";
import data from "@/data/dummy";
import BasicLayout from "@/layouts/BasicLayout";
import TechnicalIndicatorKLineChart from "@/components/KLineChart";

const meta = {
  title: "Robond - Analytics",
  description:
    "This page display the TOP 100 bond predicted by our artificial intelligence machine learning model. Users can search the bond to identify the next month trend",
  image: "https://robond.vercel.app/static/Home.jpg",
};

interface Props {
  processedMonth?: string;
  result?: DataType[];
}

type DataType = {
  RANK?: string;
  "STOCK CODE"?: string;
  "ISIN CODE"?: string;
  "STOCK NAME"?: string;
  RATING?: string;
  "EVAL MID PRICE"?: string;
  "MATURITY DATE"?: string;
  "NEXT COUPON RATE"?: string;
  PREDICTION?: string;
  "BOND RETURN"?: string;
  VOLATILITY?: string;
  RATIO?: string;
};

const Chart: NextPage<Props> = ({ result }) =>
  // { processedMonth, result }
  {
    //   const [searchValue, setSearchValue] = useState("");

    //   const filterData = result?.filter(
    //     (d) =>
    //       d?.RATING?.toLowerCase().includes(searchValue.toLowerCase()) ||
    //       d?.["STOCK CODE"]?.toLowerCase().includes(searchValue.toLowerCase()) ||
    //       d?.["STOCK NAME"]?.toLowerCase().includes(searchValue.toLowerCase())
    //   );

    return (
      <BasicLayout meta={meta}>
        <div className="">
          <TechnicalIndicatorKLineChart stock={result} />
        </div>
      </BasicLayout>
    );
  };

export default Chart;

export const getServerSideProps: GetServerSideProps = async () => {
  // const { processedMonth, result }: any = await getBond(100);
  return {
    props: { processedMonth: "July 2022", result: data },
  };
};
