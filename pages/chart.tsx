import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
// import Link from "next/link";
// import { useState } from "react";
// import { getBond } from "lib/data";
import BasicLayout from "@/layouts/BasicLayout";
import TechnicalIndicatorKLineChart from "@/components/KLineChart";
import getStock from "@/lib/data";

const meta = {
  title: "Rostock - Analytics",
  description:
    "This page display the detailed chart predicted by our artificial intelligence machine learning model. Users can search the bond to identify the next month trend",
  image: "https://rostock.vercel.app/static/Home.jpg",
};

const Chart: NextPage = ({
  stock,
  stock_list,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <BasicLayout meta={meta}>
      <div className="">
        <TechnicalIndicatorKLineChart stock={stock} stock_list={stock_list} />
      </div>
    </BasicLayout>
  );
};

export default Chart;

export const getServerSideProps: GetServerSideProps = async () => {
  const stock = await getStock("ori");
  const stock_list = Object.keys(stock);

  return {
    props: { stock, stock_list },
  };
};
