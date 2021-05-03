import React from "react";
import marked from "marked";

marked.setOptions({
  gfm: true,
});

// Override function
const renderer = {
  heading(text, level) {
    let className = "";
    switch (level) {
      case 2:
        className = "note__unitName";
        break;
      case 3:
        className = "note__title";
        break;
      case 4:
        className = "note__subTitle";
        break;
    }

    return `
            <h${level} class="heading ${className}">
              ${text}
            </h${level}>`;
  },
};

marked.use({ renderer });

export default function RenderedNote({ unit }) {
  return (
    <article
      className="note__content"
      dangerouslySetInnerHTML={{ __html: marked(unit.note) }}
    />
  );
}
