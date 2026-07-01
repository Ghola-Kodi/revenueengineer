"use client"

import { useMemo, useState } from "react"

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value)

export function LeakageCalculator() {
  const [mrrAtRisk, setMrrAtRisk] = useState(12000)
  const [recoveryRate, setRecoveryRate] = useState(25)
  const [auditCost, setAuditCost] = useState(1800)

  const recoveredRevenue = useMemo(() => (mrrAtRisk * recoveryRate) / 100, [mrrAtRisk, recoveryRate])
  const roi = useMemo(() => (recoveredRevenue - auditCost) / auditCost, [recoveredRevenue, auditCost])

  return (
    <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
      <div className="max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-widest text-[#635bff]">
          Leakage calculator
        </p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-[#0a2540] lg:text-4xl">
          Revenue leakage calculator
        </h1>
        <p className="mt-4 text-base leading-relaxed text-[#3b5a82]">
          Use this tool to estimate how much payment recovery is available from failed Stripe charges and whether an audit makes sense.
        </p>
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-3xl border border-[#d7e5fc] bg-white p-8 shadow-sm">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-[#0a2540]">Monthly MRR at risk</label>
              <input
                type="number"
                min={0}
                value={mrrAtRisk}
                onChange={(event) => setMrrAtRisk(Number(event.target.value))}
                className="mt-3 w-full rounded-3xl border border-[#d7e5fc] bg-[#f8fbff] px-4 py-3 text-sm text-[#0a2540] focus:border-[#635bff] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#0a2540]">Estimated recovery rate</label>
              <input
                type="range"
                min={5}
                max={50}
                value={recoveryRate}
                onChange={(event) => setRecoveryRate(Number(event.target.value))}
                className="mt-4 w-full"
              />
              <div className="mt-2 flex items-center justify-between text-sm text-[#3b5a82]">
                <span>Recovery rate</span>
                <span>{recoveryRate}%</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#0a2540]">Project or audit cost</label>
              <input
                type="number"
                min={0}
                value={auditCost}
                onChange={(event) => setAuditCost(Number(event.target.value))}
                className="mt-3 w-full rounded-3xl border border-[#d7e5fc] bg-[#f8fbff] px-4 py-3 text-sm text-[#0a2540] focus:border-[#635bff] focus:outline-none"
              />
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-[#d7e5fc] bg-[#eff6ff] p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-[#0a2540]">Estimated impact</h2>
          <div className="mt-8 space-y-5">
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <p className="text-sm text-[#3b5a82]">Potential recovered revenue</p>
              <p className="mt-3 text-3xl font-semibold text-[#0a2540]">{formatCurrency(recoveredRevenue)}</p>
            </div>
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <p className="text-sm text-[#3b5a82]">ROI on the audit/project</p>
              <p className="mt-3 text-3xl font-semibold text-[#0a2540]">{roi.toFixed(1)}x</p>
            </div>
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <p className="text-sm text-[#3b5a82]">Recovery ratio</p>
              <p className="mt-3 text-3xl font-semibold text-[#0a2540]">{Math.round((recoveredRevenue / mrrAtRisk) * 100)}%</p>
            </div>
          </div>
        </section>
      </div>

      <div className="mt-12 rounded-3xl border border-[#c7daf5] bg-[#f5faff] p-8 shadow-sm">
        <p className="text-sm leading-7 text-[#3b5a82]">
          This calculator is a lightweight way to start quantifying your revenue recovery opportunity. A deep audit will refine the numbers and surface the exact failure patterns that are costing your business.
        </p>
      </div>
    </div>
  )
}
