import EthPriceChartWss from "@/components/BinancePriceWssChart";
import BithumbPriceWssChart from "@/components/BithumbPriceWssChart";
import UpbitPriceWssChart from "@/components/UpbitPriceWssChart";

export default function ChartPage() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* background accents */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-[40rem] w-[40rem] rounded-full bg-emerald-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-[40rem] w-[40rem] rounded-full bg-indigo-500/20 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
        {/* hero */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-foreground/80">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            Live Crypto Charts
          </div>
          <h1 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            BTC Live Charts Across Exchanges
          </h1>
          <p className="mt-3 text-sm sm:text-base text-foreground/70">
            Compare price action from Binance, Upbit, and Bithumb in one place.
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-6">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5 shadow-lg shadow-black/20 backdrop-blur">
            <EthPriceChartWss />
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5 shadow-lg shadow-black/20 backdrop-blur">
            <UpbitPriceWssChart />
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5 shadow-lg shadow-black/20 backdrop-blur">
            <BithumbPriceWssChart />
          </div>
        </div>

        {/* footer note */}
        <div className="mt-10 text-center text-xs text-foreground/50">
          Data is fetched in real time from each exchange's public API/WebSocket.
        </div>
      </div>
    </div>
  );
}
