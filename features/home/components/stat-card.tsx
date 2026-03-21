import { Card } from "@/components/ui/card";
import { Text, View } from "react-native";

interface StatCardProps {
  icon: React.ReactNode;
  indicator?: React.ReactNode;
  value: string | number;
  label: string;
  containerClassName: string;
  valueClassName: string;
  labelClassName: string;
}

export function StatCard({
  icon,
  indicator,
  value,
  label,
  containerClassName,
  valueClassName,
  labelClassName,
}: StatCardProps) {
  return (
    <Card className={`flex-1 p-4 ${containerClassName}`}>
      <View className="flex-row justify-between items-center">
        {icon}
        {indicator}
      </View>
      <Text className={`text-[36px] mt-3 leading-none font-manrope-extrabold ${valueClassName}`}>
        {value}
      </Text>
      <Text className={`text-[13px] mt-1 leading-[18px] font-inter-medium ${labelClassName}`}>
        {label}
      </Text>
    </Card>
  );
}
