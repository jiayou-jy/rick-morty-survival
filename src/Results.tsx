import { FunctionComponent } from "react";
import Character from "./Character";
import { Character as CharacterType } from "./APIResponsesTypes";

const Results: FunctionComponent<{ characters: CharacterType[] }> = ({ characters }) => {
  return (
    <div className="search">
      {!characters.length ? (
        <h1>No Characters Found</h1>
      ) : (
        characters.map((character) => {
          return (
            <Character
            id={character.id}
            name={character.name}
            status={character.status}
            species={character.species}
            gender={character.gender}
            key={character.id}
            image={character.image}
          />
          );
        })
      )}
    </div>
  );
};

export default Results;
