import { Component } from "react";
import { useParams } from "react-router-dom";
import ErrorBoundary from "./ErrorBoundary";
import { Character as CharacterType, Status as StatusType } from "./APIResponsesTypes";

class Details extends Component<{ params: { id?: string }}> {
  state = {
    loading: true,
    status: "" as StatusType,
    name: "",
    species: "",
    gender: "",
    image: "",
  };

  async componentDidMount() {
    const res = await fetch(
      `https://rickandmortyapi.com/api/character/${this.props.params.id}`
    );
    const character = (await res.json()) as CharacterType;
    this.setState(Object.assign({ loading: false }, character));
  }

  render() {
    if (this.state.loading) {
      return <h2>loading … </h2>;
    }

    const { name, status, species, gender, image } =
      this.state;

    return (
      <div className="details">
        <div className="details">
        <div>
          <h1>{name}</h1>
          <div className="image-container">
          <img src={image} alt={name} />
        </div>
          <h2>
            {status} — {species} — {gender}
          </h2>
        </div>
      </div>
      </div>
    );
  }
}

const WrappedDetails = () => {
  const params = useParams<{ id: string }>();
  return (
    <ErrorBoundary>
      <Details params={params} />
    </ErrorBoundary>
  );
};

export default WrappedDetails;
