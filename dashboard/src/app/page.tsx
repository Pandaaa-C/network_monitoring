'use client';

import { useEffect, useState } from "react"
import ClientTable from "../components/ClientTable"
import {fetchClientIPs} from "@/lib/api";

export default function Home() {
  const [ips, setIps] = useState<string[]>([])

  useEffect(() => {
    fetchClientIPs().then(setIps)
  }, [])

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Monitored Clients</h1>
      <ClientTable ips={ips} />
    </main>
  )
}
