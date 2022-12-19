import { FunctionComponent, useState } from "react";
import {Root} from "./Chart";

const Details: FunctionComponent<{datum: Root}> = (datum) => {
    if (!datum) return null;
    const { name, status, species, gender, image, location, episode } = datum.datum;

    return (
      <div className="details">
          <h2>{name}</h2>
          <div className="image-container">
            {image? (<img src={image} alt={name}/>) : null}
          </div>
          <h3>
            Status:{status}
          </h3>
          <h3>
            Species: {species}
          </h3>
          <h3>
            Gender: {gender}
          </h3>
          <h3>
            Location: {location?.name}
          </h3>
          <h3>
            Episodes: {episode?.length}
          </h3>
      </div>
    );
};

export default Details;
