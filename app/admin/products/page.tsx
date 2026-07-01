"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useTestMode } from "@/lib/test-auth"
import { getFakeAuthSession } from "@/lib/fake-data"

export default function AdminProductsPage() {
  const router = useRouter()
  const testMode = useTestMode()
  const [products, setProducts] = useState<any[]>([])
  const [authorized, setAuthorized] = useState(true)
  const [form, setForm] = useState({
    name: "",
    description: "",
    price_cents: "0",
    delivery_type: "digital_download",
    download_asset_url: "",
  })
  const [message, setMessage] = useState("")

  useEffect(() => {
    if (!testMode) {
      router.replace("/dashboard")
      return
    }

    const session = getFakeAuthSession()
    if (!session || session.role !== "admin") {
      setAuthorized(false)
      return
    }

    fetch("/api/products")
      .then((response) => response.json())
      .then((data) => setProducts(data.products ?? []))
      .catch(() => setProducts([]))
  }, [router, testMode])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const response = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
    const data = await response.json()
    setMessage(`Created ${data.product?.name ?? "product"}`)
    setProducts((current) => [data.product, ...current])
    setForm({
      name: "",
      description: "",
      price_cents: "0",
      delivery_type: "digital_download",
      download_asset_url: "",
    })
  }

  if (!authorized) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-16 lg:px-8">
        <h1 className="text-3xl font-semibold text-[#0a2540]">Admin access required</h1>
        <p className="mt-3 text-sm text-[#3b5a82]">Only simulated admin accounts can create products.</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-16 lg:px-8">
      <h1 className="text-3xl font-semibold text-[#0a2540]">Admin products</h1>
      <p className="mt-3 text-sm text-[#3b5a82]">Simulated admin-only product creation for local development.</p>

      <form onSubmit={handleSubmit} className="mt-8 rounded-3xl border border-[#d7e5fc] bg-white p-8 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2">
          <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Product name" className="rounded-lg border border-[#d7e5fc] px-4 py-2" required />
          <input value={form.price_cents} onChange={(event) => setForm({ ...form, price_cents: event.target.value })} type="number" placeholder="Price cents" className="rounded-lg border border-[#d7e5fc] px-4 py-2" required />
          <select value={form.delivery_type} onChange={(event) => setForm({ ...form, delivery_type: event.target.value })} className="rounded-lg border border-[#d7e5fc] px-4 py-2">
            <option value="digital_download">Digital download</option>
            <option value="service">Service</option>
          </select>
          <input value={form.download_asset_url} onChange={(event) => setForm({ ...form, download_asset_url: event.target.value })} placeholder="Download asset URL" className="rounded-lg border border-[#d7e5fc] px-4 py-2" />
        </div>
        <textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Description" className="mt-4 min-h-28 w-full rounded-lg border border-[#d7e5fc] px-4 py-2" required />
        <button type="submit" className="mt-6 rounded-full bg-[#635bff] px-6 py-2.5 text-sm font-semibold text-white">Create product</button>
      </form>

      {message ? <p className="mt-4 text-sm text-[#635bff]">{message}</p> : null}

      <div className="mt-10 space-y-4">
        {products.map((product) => (
          <div key={product.id} className="rounded-2xl border border-[#d7e5fc] bg-white p-6">
            <h2 className="text-lg font-semibold text-[#0a2540]">{product.name}</h2>
            <p className="mt-2 text-sm text-[#3b5a82]">{product.description}</p>
            <p className="mt-3 text-sm font-semibold text-[#635bff]">${(product.price_cents / 100).toFixed(2)} · {product.delivery_type}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
