import React from "react";

const LoadingIndicator: React.FC = () => (
  <div className="flex justify-center items-center py-8">
    <p className="text-gray-500">データを読み込んでいます...</p>
  </div>
);

export default LoadingIndicator;