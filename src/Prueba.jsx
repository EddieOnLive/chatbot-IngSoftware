import React, { Component } from "react";
import PropTypes from "prop-types";
import ChatBot, { Loading } from "react-simple-chatbot";

class WikiSearch extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      result: "",
      wikiLink: "",
      trigger: false,
    };

    this.triggerNext = this.triggerNext.bind(this);
  }

  componentDidMount() {
    const { steps } = this.props;
    const search = steps.search.value;

    // Encode search term for Wikipedia API
    const encodedSearch = encodeURIComponent(search);

    // Construct Wikipedia API URL in Spanish
    const url = `https://es.wikipedia.org/w/api.php?action=opensearch&search=${encodedSearch}&format=json&origin=*`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const [searchSuggestion, ...searchResults] = data;
        const result =
          searchResults.length > 0
            ? searchResults[0]
            : "No se encontraron resultados.";
        const wikiLink =
          searchResults.length > 0
            ? `https://es.wikipedia.org/wiki/${searchResults[0]}`
            : "";
        this.setState({ loading: false, result, wikiLink });
      })
      .catch((error) => {
        console.error("Error fetching Wikipedia data:", error);
        this.setState({
          loading: false,
          result: "Error al buscar en Wikipedia.",
        });
      });
  }

  triggerNext() {
    this.setState({ trigger: true }, () => {
      this.props.triggerNextStep();
    });
  }

  render() {
    const { trigger, loading, result, wikiLink } = this.state;

    return (
      <div className="wiki-search">
        {loading ? (
          <Loading />
        ) : (
          <div>
            {result && (
              <div>
                <p>{result}</p>
                {wikiLink && (
                  <div style={{ textAlign: "center", marginTop: 20 }}>
                    <a
                      href={wikiLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Enlace a la página de Wikipedia
                    </a>
                  </div>
                )}
              </div>
            )}
            {!loading && (
              <div style={{ textAlign: "center", marginTop: 20 }}>
                {!trigger && (
                  <button onClick={() => this.triggerNext()}>
                    Buscar nuevamente
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}

WikiSearch.propTypes = {
  steps: PropTypes.object,
  triggerNextStep: PropTypes.func,
};

WikiSearch.defaultProps = {
  steps: undefined,
  triggerNextStep: undefined,
};

const ExampleWikiSearch = () => (
  <ChatBot
    steps={[
      {
        id: "1",
        message: "Escribe algo para buscar en Wikipedia (en español)",
        trigger: "search",
      },
      {
        id: "search",
        user: true,
        trigger: "3",
      },
      {
        id: "3",
        component: <WikiSearch />,
        waitAction: true,
        trigger: "1",
      },
    ]}
  />
);

export default ExampleWikiSearch;
