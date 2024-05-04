/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import ChatBot, { Loading } from 'react-simple-chatbot';

const WikiSearch = ({ steps, triggerNextStep }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [wikiLink, setWikiLink] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const previousStepsRef = useRef(steps);

  useEffect(() => {

    const hasRelevantStepsChanged =
      steps &&
      previousStepsRef.current &&
      steps.search.value === previousStepsRef.current.search.value;

    if (!steps || !hasRelevantStepsChanged) return;

    const searchTerm = encodeURIComponent(steps.search.value);
    const urlContenido = `https://es.wikipedia.org/w/api.php?action=parse&page=${searchTerm}&format=json&prop=text&origin=*`;
    const url = `https://es.wikipedia.org/w/api.php?action=opensearch&search=${searchTerm}&format=json&origin=*`;

    setLoading(true);

    fetch(urlContenido)
      .then(response => response.json())
      .then(data => {
        const parser = new DOMParser();
        const articleHTML = parser.parseFromString(data.parse.text['*'], 'text/html');
        const paragraphs = articleHTML.querySelectorAll('p');

        let excerpt = '';
        for (let i = 0; i < Math.min(paragraphs.length, 3); i++) {
          excerpt += paragraphs[i].textContent + '\n\n';
        }

        setExcerpt(excerpt);
      })
      .catch(error => {
        console.error('Error parsing Wikipedia content:', error);
      });

    fetch(url)
      .then(response => response.json())
      .then(data => {
        const [searchSuggestion, ...searchResults] = data;
        const resultText = searchResults.length > 0 ? searchResults[2][0] : 'No se encontraron resultados.';
        const wikiLinkText = searchResults.length > 0 ? `https://es.wikipedia.org/wiki/${searchResults[0][0]}` : '';

        setResult(resultText);
        setWikiLink(wikiLinkText);
      })
      .catch(error => {
        console.error('Error fetching Wikipedia data:', error);
        setResult('Error al buscar en Wikipedia.');
      })
      .finally(() => setLoading(false));

    previousStepsRef.current = steps;
  }, [steps]);

  const handleNext = () => {
    triggerNextStep();
  };

  return (
    <div className="wiki-search">
      {loading  ? (
        <Loading />
      ) : (
        <div>
          {result && (
            <div>
              <p>{excerpt}</p>
              {wikiLink && (
                <div style={{ textAlign: 'center', marginTop: 20 }}>
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
            <div style={{ textAlign: 'center', marginTop: 20 }}>
              {result && (
                <button onClick={handleNext}>Buscar nuevamente</button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

WikiSearch.propTypes = {
  steps: PropTypes.object,
  triggerNextStep: PropTypes.func,
};

export default WikiSearch;