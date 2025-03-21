import * as Icons from "lucide-react";

const FeatureCard = ({ title, description, iconName = "FileText"}) => {
  const IconComponent = Icons[iconName] || Icons.FileText;
  return (
    <div className="inline-block">
      <div className="relative w-72 bg-gray-800 rounded-xl overflow-hidden transition-all duration-300 ease-in-out shadow-md hover:shadow-xl hover:-translate-y-2 border border-gray-700 group">
        {/* Card Header with Dynamic Icon */}
        <div className="h-60 flex flex-col items-center justify-center bg-gray-800 w-full">
          <IconComponent className="w-20 h-20 text-white opacity-80 mb-4" />
          <div className="text-center w-full p-4 text-white">
            <h2 className="text-xl font-bold">{title}</h2>
            <p className="text-sm text-gray-300">{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureCard;