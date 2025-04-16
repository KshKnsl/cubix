import React from "react";

function GameLogo({ gameName, logoUrl }) {
  return (
    <div className="bg-card text-card-foreground p-4 rounded-lg shadow-md flex items-center space-x-4">
      {/* Apply consistent background and text colors */}
      <img src={logoUrl} alt={`${gameName} Logo`} className="h-10 w-10 object-contain" />
      <span className="font-semibold">{gameName}</span>
    </div>
  );
}

export default GameLogo;
