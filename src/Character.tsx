import { FunctionComponent } from "react";
import { Link } from "react-router-dom";
import { Character as CharacterType } from "./APIResponsesTypes";

const Character: FunctionComponent<CharacterType> = props => {
  const { id, name, status, species, gender, image } = props;

  let hero = "http://pets-images.dev-apis.com/pets/none.jpg";
  if (image) {
    hero = image;
  }

  return (
    <Link to={`/details/${id}`} className="character">
      <div className="image-container">
        <img src={hero} alt={name} />
      </div>
      <div className="info">
        <h1>{name}</h1>
        <h2>{`${status} — ${species} — ${gender}`}</h2>
      </div>
    </Link>
  );
};

export default Character;
