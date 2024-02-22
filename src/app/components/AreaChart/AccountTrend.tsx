import { ButtonProps } from "@/app/constants/types";
import { generateChartData } from "@/app/lib/chartFormatter";
import { valueFormatter, valueFormatterNGN } from "@/app/lib/currencyFormater";
import { AreaChart } from "@tremor/react";
import { useSelector } from "react-redux";
import { user } from "@/app/store";
import React from "react";

const AccountTrend = ({ data }: ButtonProps) => {
  const userr = useSelector(user);
  return (
    <AreaChart
      className="mt-4 sm:h-72 h-40"
      data={
        data && data?.length > 2 ? data : [...generateChartData(10), ...data]
      }
      index="date"
      showAnimation
      showGridLines={false}
      showLegend={false}
      yAxisWidth={65}
      categories={["AIRTIME", "CHI", "MOMO"]}
      colors={["indigo", "cyan", "rose"]}
      valueFormatter={
        userr.prefferedCurrency === "USD" ? valueFormatter : valueFormatterNGN
      }
    />
  );
};

export default React.memo(AccountTrend);
