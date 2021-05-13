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
    console.log({ quote, cite });

    return `
            <blockquote class="quote">
              <p class="quote__text">${quote.trim()}</p>
              <cite class="quote__cite">${cite.trim()}</cite>
            </blockquote>`;
  },
  paragraph(text) {
    const match = text.match(/dfn:\s?([^]+)/);
    if (match) {
      return `<p class="definition">${match[1].trim()}</p>`;
    }

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
      <details>
        <summary>${summary.trim()}</summary>
        ${description.trim()}
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
