import React from "react";
import marked from "marked";

marked.setOptions({
  gfm: true,
});

// Override function

const tokenizer = {
  blockquote(src) {
    const match = src.match(/^<([a-zA-Z'?.?\s?:]+)>/);
    if (match) {
      return {
        type: "blockquote",
        raw: match[0],
        text: match[1].trim(),
      };
    }

    // return false to use original quote tokenizer
    return false;
  },
};

const renderer = {
  heading(text, level) {
    let className = "";
    switch (level) {
      case 1:
        className = "heading note__title";
        break;
      case 2:
        className = "note__subTitle";
        break;
    }

    const reducedLevel = level + 2; // h1 will be h3

    return `
            <h${reducedLevel} class="${className}">
              ${text}
            </h${reducedLevel}>`;
  },
  blockquote(text) {
    if (!text) {
      return "";
    }

    const { 1: quote, 2: cite } = text.match(/<p>([^]+):([^]+)/);

    return `
            <blockquote class="quote">
              <p class="quote__text">${quote.trim()}</p>
              <cite class="quote__cite">${cite.trim()}</cite>
            </blockquote>`;
  },
  paragraph(text) {
    const isDefinition = text.match(/dfn:\s?([^]+)/);
    if (isDefinition) {
      return `<p class="definition">${isDefinition[1].trim()}</p>`;
    }

    // TODO: parse word-meaning
    // const hasMeaning = text.match(/(\[[a-zA-Z\s]+\]\[[a-zA-Z\s]+\])/g);
    // if(hasMeaning){
    //   const {1:word, 2:meaning} = k.match(/\[([a-zA-Z\s?]+)\]\s?\[([a-zA-Z\s?]+)\]/);

    // }

    return `<p>${text}</p>`;
  },
  list(text, ordered) {
    if (text.includes("<li>")) {
      const listType = ordered ? "ol" : "ul";

      return `
      <${listType}>
        ${text}
      </${listType}>
    `;
    }

    return text;
  },
  listitem(text) {
    const [summary, description] = text.split(":");

    if (description) {
      return `
      <details class="details">
        <summary class="details__summary">${summary.trim()}</summary>
        <p class="details__content">${description.trim()}</p>
      </details>
    `;
    }

    return `<li>${text}</li>`;
  },
};

marked.use({ tokenizer, renderer });

export default function RenderedNote({ unit }) {
  return (
    <article
      className="note__content"
      dangerouslySetInnerHTML={{ __html: marked(unit.note) }}
    />
  );
}
