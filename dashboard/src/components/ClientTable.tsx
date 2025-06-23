import Link from "next/link"

type Props = {
  ips: string[]
}

export default function ClientTable({ ips }: Props) {
  return (
    <table className="w-full border text-sm">
      <thead>
        <tr className="bg-gray-100 text-left">
          <th className="p-2">IP Address</th>
        </tr>
      </thead>
      <tbody>
        {ips.map(ip => (
          <tr key={ip} className="border-t hover:bg-gray-50">
            <td className="p-2">
              <Link href={`/clients/${ip}`} className="text-blue-600 underline">
                {ip}
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
