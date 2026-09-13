import { useMemo } from "react";

export default function RiskShareDonut({ bids = [] }) {
  const stats = useMemo(() => {
    const low = bids.filter(
      (bid) => bid.riskLevel === "LOW"
    ).length;

    const medium = bids.filter(
      (bid) => bid.riskLevel === "MEDIUM"
    ).length;

    const high = bids.filter(
      (bid) => bid.riskLevel === "HIGH"
    ).length;

    const total = bids.length;

    return {
      low,
      medium,
      high,
      total,
    };
  }, [bids]);

  const lowPercent =
    stats.total > 0
      ? Math.round((stats.low / stats.total) * 100)
      : 0;

  const mediumPercent =
    stats.total > 0
      ? Math.round((stats.medium / stats.total) * 100)
      : 0;

  const highPercent =
    stats.total > 0
      ? Math.round((stats.high / stats.total) * 100)
      : 0;

  /*
   * Build the donut using conic-gradient.
   * Light professional colors:
   * Low    -> blue
   * Medium -> amber
   * High   -> red
   */
  const lowEnd = lowPercent;
  const mediumEnd = lowPercent + mediumPercent;

  const donutBackground =
    stats.total > 0
      ? `conic-gradient(
          #60a5fa 0% ${lowEnd}%,
          #fbbf24 ${lowEnd}% ${mediumEnd}%,
          #f87171 ${mediumEnd}% 100%
        )`
      : "#e2e8f0";

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 h-full min-w-0 overflow-hidden">
      {/* HEADER */}
      <div>
        <h3 className="text-[16px] font-bold text-slate-900">
          Risk Share
        </h3>

        <p className="mt-1 text-[11px] text-slate-500">
          Proportion of bidders by risk level.
        </p>
      </div>

      {/* CONTENT */}
      <div className="mt-5 flex items-center gap-4 min-w-0">
        {/* DONUT */}
        <div className="relative w-[135px] h-[135px] shrink-0">
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: donutBackground,
            }}
          />

          {/* Inner circle */}
          <div className="absolute inset-[22px] rounded-full bg-white flex flex-col items-center justify-center">
            <span className="text-[23px] leading-none font-bold text-slate-900">
              {stats.total}
            </span>

            <span className="mt-1 text-[10px] font-medium text-slate-400">
              Bidders
            </span>
          </div>
        </div>

        {/* LEGEND */}
        <div className="flex-1 min-w-0 space-y-4">
          <RiskLegend
            label="Low Risk"
            count={stats.low}
            percentage={lowPercent}
            dotClass="bg-blue-400"
          />

          <RiskLegend
            label="Medium Risk"
            count={stats.medium}
            percentage={mediumPercent}
            dotClass="bg-amber-400"
          />

          <RiskLegend
            label="High Risk"
            count={stats.high}
            percentage={highPercent}
            dotClass="bg-red-400"
          />
        </div>
      </div>
    </div>
  );
}

function RiskLegend({
  label,
  count,
  percentage,
  dotClass,
}) {
  return (
    <div className="flex items-center gap-2 min-w-0">
      <span
        className={`w-2.5 h-2.5 rounded-full shrink-0 ${dotClass}`}
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] font-semibold text-slate-700 truncate">
            {label}
          </span>

          <span className="text-[10px] font-bold text-slate-500 shrink-0">
            {percentage}%
          </span>
        </div>

        <p className="text-[9px] text-slate-400 mt-0.5">
          {count} bidder{count === 1 ? "" : "s"}
        </p>
      </div>
    </div>
  );
}