import { ResponsiveContainer, AreaChart, Area, Tooltip } from 'recharts';

interface TrendAreaChartProps {
  data: Array<Record<string, number | string>>;
  dataKey: string;
  stroke?: string;
  fill?: string;
  height?: number;
}

function TrendAreaChart({
  data,
  dataKey,
  stroke = '#0D9488',
  fill = 'rgba(13, 148, 136, 0.12)',
  height = 140,
}: TrendAreaChartProps) {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <Tooltip
            cursor={{ stroke: stroke, strokeDasharray: '4 4' }}
            contentStyle={{
              background: '#ffffff',
              border: '1px solid #E2E8F0',
              borderRadius: '12px',
              fontSize: '12px',
            }}
          />
          <Area type="monotone" dataKey={dataKey} stroke={stroke} fill={fill} strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default TrendAreaChart;
