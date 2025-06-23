import {
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from 'recharts'

type Props = {
  data: any[]
}

export default function ClientGraph({ data }: Props) {
  return (
    <div className="w-full h-96">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="created_at" tickFormatter={(t) => new Date(t).toLocaleTimeString()} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="cpu_usage" stroke="#8884d8" name="CPU (%)" />
          <Line type="monotone" dataKey="memory_usage" stroke="#82ca9d" name="RAM (%)" />
          <Line type="monotone" dataKey="storage_usage" stroke="#ff7300" name="Disk (%)" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
