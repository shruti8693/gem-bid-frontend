const RISK_TIERS = [
  {
    key: "LOW",
    label: "Low",
    barColor: "#60A5FA",
    textColor: "text-blue-700",
    bgColor: "bg-blue-50",
  },
  {
    key: "MEDIUM",
    label: "Medium",
    barColor: "#FBBF24",
    textColor: "text-amber-700",
    bgColor: "bg-amber-50",
  },
  {
    key: "HIGH",
    label: "High",
    barColor: "#F87171",
    textColor: "text-red-700",
    bgColor: "bg-red-50",
  },
];

export default function RiskDistributionChart({ bids = [] }) {
  const counts = RISK_TIERS.map((tier) => ({
    ...tier,
    count: bids.filter(
      (b) => b.riskLevel === tier.key
    ).length,
  }));

  const maxCount = Math.max(
    ...counts.map((c) => c.count),
    1
  );

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4 h-full min-w-0 overflow-hidden">

      {/* HEADER */}
      <div>
        <h3 className="text-[16px] font-bold text-slate-900">
          Risk Distribution
        </h3>

        <p className="mt-1 text-[11px] text-slate-500">
          Number of bidders per risk level for this tender.
        </p>
      </div>

      {/* CHART */}
      <div className="mt-3 h-[145px] flex items-end justify-center gap-14">

        {counts.map((tier) => {
          const barHeight =
            tier.count > 0
              ? Math.max(
                  (tier.count / maxCount) * 115,
                  14
                )
              : 5;

          return (
            <div
              key={tier.key}
              className="h-full flex flex-col items-center justify-end"
            >

              {/* COUNT */}
              <div
                className={`mb-1.5 min-w-[32px] px-2 py-1 rounded-md text-center text-[11px] font-bold ${tier.bgColor} ${tier.textColor}`}
              >
                {tier.count}
              </div>

              {/* BAR */}
              <div
                className="w-[56px] rounded-t-lg transition-all duration-300"
                style={{
                  height: `${barHeight}px`,
                  backgroundColor: tier.barColor,
                  opacity: tier.count > 0 ? 1 : 0.25,
                }}
              />

              {/* LABEL */}
              <div className="mt-1.5 text-center">
                <span className="text-[10px] font-semibold text-slate-600">
                  {tier.label}
                </span>

                <span className="block text-[9px] text-slate-400">
                  {tier.count === 1 ? "bidder" : "bidders"}
                </span>
              </div>

            </div>
          );
        })}

      </div>

      {/* LEGEND */}
      <div className="mt-2 pt-2.5 border-t border-slate-100 flex items-center justify-center gap-6">

        {counts.map((tier) => (
          <div
            key={tier.key}
            className="flex items-center gap-1.5"
          >
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{
                backgroundColor: tier.barColor,
              }}
            />

            <span className="text-[9px] font-medium text-slate-500">
              {tier.label}
            </span>
          </div>
        ))}

      </div>

    </div>
  );
}