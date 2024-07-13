import { Star } from "lucide-react";
import { FC } from "react";

const OneStar: FC<{ percentage: number }> = ({ percentage }) => {
  return (
    <div className="relative bg-secondary overflow-hidden text-white flex items-center justify-center h-10 w-10 p-0 rounded-xl">
      <div
        className="absolute inset-0 h-full bg-primary"
        style={{
          width: `${percentage}%`,
        }}
      />

      <Star className="w-5 h-5 z-10" />
    </div>
  );
};

export const Stars: FC<{ percent: number }> = ({ percent }) => {
  // Calculate percentage for each star
  const fullStars = Math.floor(percent / 20);
  const partialStarPercentage = (percent % 20) * 5; // Each star represents 20%, so we multiply the remainder by 5

  const starPercentages = Array.from({ length: 5 })
    .fill(0)
    .map((_, index) => {
      if (index < fullStars) {
        return 100;
      } else if (index === fullStars) {
        return partialStarPercentage;
      } else {
        return 0;
      }
    });

  return (
    <div className="flex gap-2">
      {starPercentages.map((percentage, index) => (
        <OneStar key={index} percentage={percentage} />
      ))}
    </div>
  );
};
