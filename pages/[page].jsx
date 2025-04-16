import React from "react";
import GameLogo from "../components/GameLogo";

function Page() {
  const games = [
    { name: "Game 1", logo: "/path/to/logo1.png" },
    { name: "Game 2", logo: "/path/to/logo2.png" },
  ];

  return (
    <div className="space-y-4">
      {games.map((game) => (
        <GameLogo key={game.name} gameName={game.name} logoUrl={game.logo} />
      ))}
    </div>
  );
}

export default Page;
