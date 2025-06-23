import axios from 'axios'

const API_BASE = 'http://localhost:9999'

export async function fetchClientIPs(): Promise<string[]> {
  const res = await axios.get(`${API_BASE}/clients`)
  return res.data
}

export async function fetchClientMetrics(ip: string): Promise<any[]> {
  const res = await axios.get(`${API_BASE}/clients/${ip}`)
  return res.data
}

export async function fetchDiskMetrics(ip: string) {
  const res = await fetch(`${API_BASE}/clients/${ip}/disks`)
  return res.json()
}

