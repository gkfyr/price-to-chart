import EthPriceChartWss from "@/components/BinancePriceWssChart";
import RealTimePrice from "@/components/RealTimePrice";
import RealTimePriceUpbit from "@/components/RealTimePriceUpbit";
import UpbitPriceWssChart from "@/components/UpbitPriceWssChart";

export default function ChartPage() {
  return (
    <div className="w-full">
      <div className="mx-auto w-[800px] mt-20">
        <div className="w-full justify-between flex ">
          <h1 className="font-bold">BTC 가격 차트 (Binance) (1h)</h1>
          <RealTimePrice />
        </div>

        <div className="">
          <EthPriceChartWss />
        </div>
      </div>
      <div className="mx-auto w-[800px] mt-20">
        <div className="w-full justify-between flex ">
          <h1 className="font-bold">BTC 가격 차트 (Upbit) (1d)</h1>
          <RealTimePriceUpbit />
        </div>
        <UpbitPriceWssChart />
      </div>
    </div>
  );
}
