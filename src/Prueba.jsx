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
    const searchTerm = steps.search.value;

    // Codificar el término de búsqueda para la API de Wikipedia
    const encodedSearch = encodeURIComponent(searchTerm);

    // Construir la URL de la API de Wikipedia en español
    const url = `https://es.wikipedia.org/w/api.php?action=opensearch&search=${encodedSearch}&format=json&origin=*`;
    const urlContenido = `https://es.wikipedia.org/w/api.php?action=parse&page=${encodedSearch}&format=json&prop=text&origin=*`;

    fetch(urlContenido)
      .then((response) => response.json())
      .then((data) => {
        const parser = new DOMParser();
        const articleHTML = parser.parseFromString(
          data.parse.text["*"],
          "text/html"
        );

        const paragraphs = articleHTML.querySelectorAll("p");
        let excerpt = "";

        for (let i = 0; i < Math.min(paragraphs.length, 3); i++) {
          excerpt += paragraphs[i].textContent + "\n\n";
        }

        const excerptElement = document.createElement("div");
        excerptElement.textContent = excerpt;
        this.setState({ loading: false, excerpt });

        console.log(excerpt);
        /* document.body.appendChild(excerptElement); */
      });

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const [searchSuggestion, ...searchResults] = data;
        const result =
          searchResults.length > 0
            ? searchResults[2][0]
            : "No se encontraron resultados.";
        /* console.log(searchResults); */
        const wikiLink =
          searchResults.length > 0
            ? `https://es.wikipedia.org/wiki/${searchResults[0][0]}`
            : "";
        this.setState({ loading: false, result, wikiLink });
      })
      .catch((error) => {
        console.error("Error al buscar en Wikipedia:", error);
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
    const { trigger, loading, result, wikiLink, excerpt } = this.state;
    return (
      <div className="wiki-search">
        {loading ? (
          <Loading />
        ) : (
          <div>
            {result && (
              <div>
                <p>{excerpt}</p>
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
