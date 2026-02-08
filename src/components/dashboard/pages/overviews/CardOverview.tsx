import { Card, CardContent } from "@/components/ui/card";

interface CardOverviewProps {
  title: string;
  numberInfo: string | number;
  trend?: string;
  isUp?: boolean;
  icon?: React.ReactNode;
}

const CardOverview: React.FC<CardOverviewProps> = ({
  title,
  numberInfo,
  trend,
  // isUp,
  icon,
}) => {
  return (
    <Card className="flex-1 min-w-[300px] border-lg shadow-base rounded-xl overflow-hidden bg-white">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-[#343A40] font-bold text-sm uppercase tracking-wider opacity-80">
            {title}
          </h3>
          {icon && <div className="p-2 bg-orange-50 rounded-lg">{icon}</div>}
        </div>

        <div className="flex justify-between items-end">
          <div className="space-y-3">
            <div className="text-4xl font-extrabold text-[#111827]">
              {numberInfo}
            </div>
            {trend && (
              <div className="text-sm font-medium text-gray-500 mt-1">
                Last month
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CardOverview;
