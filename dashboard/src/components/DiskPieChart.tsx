import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type DiskData = {
  disk_name: string;
  used: number; // GB
  free: number; // GB
};

type Props = {
  diskData: DiskData[];
};

const COLORS = ["#FF8042", "#0088FE"];

export default function DiskPieChart({ diskData }: Props) {
  return (
    <div className="flex flex-wrap gap-4 justify-center p-4">
      {diskData.map(({ disk_name, used, free }) => {
        const pieData = [
          { name: "Used (GB)", value: used },
          { name: "Free (GB)", value: free },
        ];

        return (
          <div
            key={disk_name}
            className="w-80 h-auto bg-white shadow rounded p-4 flex flex-col items-center"
          >
            <h3 className="text-center font-semibold mb-2">{disk_name}</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  label
                >
                  {pieData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
            <div className="text-sm mt-4 w-full text-center space-y-1">
              <p><strong>Used:</strong> {used.toFixed(2)} GB</p>
              <p><strong>Free:</strong> {free.toFixed(2)} GB</p>
              <p><strong>Total:</strong> {(used + free).toFixed(2)} GB</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}