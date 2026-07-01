import type { Metadata } from "next"
import { LeakageCalculator } from "./leakage-calculator"

export const metadata: Metadata = {
  title: "Revenue Leakage Calculator | RevEng",
  description:
    "Estimate how much revenue you can recover from Stripe payment failures and compare it to the cost of an audit.",
}

export default function LeakageCalculatorPage() {
  return <LeakageCalculator />
}
