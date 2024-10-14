import EthPriceChart from "@/components/BinancePriceChart";
import EthPriceChartWss from "@/components/BinancePriceWssChart";
import RealTimePrice from "@/components/RealTimePrice";

export default function ChartPage() {
  return (
    <div className="w-full">
      <div className="mx-auto w-[800px] mt-20">
        <div className="w-full justify-between flex ">
          <h1 className="font-bold">BTC 가격 차트 (Binance)</h1>
          <RealTimePrice />
        </div>

        <div className="">
          <EthPriceChartWss />
        </div>
      </div>
    </div>
  );
}
