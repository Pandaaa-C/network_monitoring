'use client'

import {useEffect, useState} from "react"
import {fetchClientMetrics, fetchDiskMetrics} from "@/lib/api";
import ClientGraph from "@/components/ClientGraph";
import {LeftArrow} from "next/dist/client/components/react-dev-overlay/ui/icons/left-arrow";
import {useRouter} from "next/navigation";
import DiskPieChart from "@/components/DiskPieChart";

export default function ClientDetail({ip}: { ip: string }) {
    const [data, setData] = useState<any[]>([])
    const [diskData, setDiskData] = useState<any[]>([])
    const router = useRouter();

    useEffect(() => {
        if (typeof ip !== "string") return

        const fetchData = async () => {
            const [_data, disks] = await Promise.all([
                fetchClientMetrics(ip),
                fetchDiskMetrics(ip)
            ])

            setData(_data.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()))

            const diskMap: Record<string, { used: number, free: number, count: number }> = {}

            disks.forEach(({disk_name, disk_usage, disk_space}: {disk_name: string, disk_usage: string, disk_space: string}) => {
                const used = parseFloat(disk_usage)
                const total = parseFloat(disk_space)
                if (!disk_name || !used || !total || total === 0) return

                if (!diskMap[disk_name]) {
                    diskMap[disk_name] = {used: 0, free: 0, count: 0}
                }

                diskMap[disk_name].used += used
                diskMap[disk_name].free += total - used
                diskMap[disk_name].count += 1
            })

            const disksProcessed = Object.entries(diskMap).map(([disk_name, {used, free, count}]) => ({
                disk_name,
                used: parseFloat((used / count / (1024 ** 3)).toFixed(2)),
                free: parseFloat((free / count / (1024 ** 3)).toFixed(2)),
            }))

            setDiskData(disksProcessed)
        }

        fetchData()
        const interval = setInterval(fetchData, 1000 * 10) // Fetch every 10 seconds
        return () => clearInterval(interval)
    }, [ip])


    return (
        <main className="p-8 max-w-6xl mx-auto">
            <div className={'flex flex-row gap-3'}>
                <div onClick={() => router.push('/')}>
                    <LeftArrow className={"w-8 h-8 hover:cursor-pointer"}/>
                </div>
                <h1 className="text-2xl font-bold mb-4">Metrics for {ip}</h1>
            </div>
            {data.length > 0 ? <ClientGraph data={data}/> : <p>Loading data...</p>}
            <h2 className="text-xl font-semibold mt-10 mb-4">Disk Usage</h2>
            {diskData.length > 0 ? <DiskPieChart diskData={diskData}/> : <p>Loading disk data...</p>}
        </main>
    )
}
