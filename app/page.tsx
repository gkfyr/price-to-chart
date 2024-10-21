import EthPriceChartWss from "@/components/BinancePriceWssChart";
import BithumbPriceWssChart from "@/components/BithumbPriceWssChart";
import UpbitPriceWssChart from "@/components/UpbitPriceWssChart";

export default function ChartPage() {
  return (
    <div className="w-full">
      <div className="mx-auto w-[800px] mt-20">
        <EthPriceChartWss />
      </div>
      <div className="mx-auto w-[800px] mt-20">
        <UpbitPriceWssChart />
      </div>
      <div className="mx-auto w-[800px] mt-20">
        <BithumbPriceWssChart />
      </div>
    </div>
  );
}
