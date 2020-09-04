// logic to generate HTML from the raw data(editor.js clean output)

module.exports = class GenerateView {
  constructor(blocks) {
    this.blocks = blocks;
    this.view = "";
    return this.init();
  }

  // events
  events() {}

  // methods

  init() {
    return new Promise((resolve, reject) => {
      const subArrayFunc = createSubArray(this.blocks); // the "closure" function, if I could say so...

      let subTopicWrappers = []; // array of "subTopicWraps", the "<section class="subTopicWrap">"

      this.blocks.forEach((block) => {
        if (block.data.level === 2) subTopicWrappers.push(subArrayFunc()); // if current block is a "h2", call the innerFunction
      });

      this.subTopicWrappersHandler(subTopicWrappers);
      if (this.view) resolve(this.view);
      reject("Cannot generate Views");
    });
  }

  subTopicWrappersHandler(subTopicWrappers) {
    subTopicWrappers.forEach((wrapper) => {
      let subTopicWrapContent = "";

      wrapper.forEach((element) => {
        subTopicWrapContent += this.injectAppropriateElement(element);
      });
      this.view += `<section class="subTopicWrap">${subTopicWrapContent}</section>`;
    });
  }

  injectAppropriateElement(element) {
    let willReturn = null;
    switch (element.type) {
      case "header":
        willReturn = this.headerHandler(element.data);
        break;
      case "paragraph":
        willReturn = this.paragraphHandler(element.data);
        break;
      case "list":
        willReturn = this.listHandler(element.data);
        break;
      case "table":
        willReturn = this.tableHandler(element.data);
        break;
      case "image":
        willReturn = this.imageHandler(element.data);
        break;
      case "quote":
        willReturn = this.quoteHandler(element.data);
        break;
    }
    return willReturn;
  }

  headerHandler(data) {
    switch (data.level) {
      case 2:
        return `<h2 class="subTopic">${data.text}</h2>`;
      case 3:
        return `<h3>${data.text}</h3>`;
      case 4:
        return `<h4>${data.text}</h4>`;
    }
  }
  paragraphHandler(data) {
    data.text = this.replaceTags(data.text, ["b>", "i>"], ["strong>", "em>"]);

    if (/<(span)\sclass="ml?t?1?2?rem">/.test(data.text)) {
      return data.text.replace(/span/g, "p");
    } else return `<p>${data.text}</p>`;
  }
  listHandler(data) {
    let dtRegex = /^<dt class="helloStyle">[a-zA-Z\s?]+:?\s?<\/dt>/i;
    if (!dtRegex.test(data.items[0])) {
      switch (data.style) {
        case "ordered":
          return `
						<ol>
							${data.items.map((li) => `<li>${li}</li>`).join("")}
						</ol>
					`;
        case "unordered":
          return `
						<ul>
							${data.items.map((li) => `<li>${li}</li>`).join("")}
						</ul>
					`;
      }
      return;
    }
    let ddRegex = /<\/dt>/; // starts right after the </dt>
    let dtText = "",
      ddText = "";

    let temp = "text.substring(text.match(/</dt>/).index+5).trim();";

    return `
			<dl>
				${data.items
          .map((listItem) => {
            dtText = listItem.match(dtRegex)[0];
            ddText = listItem
              .substring(listItem.match(/<\/dt>/).index + 5)
              .trim();
            return `
					${dtText}
					<dd>${this.replaceTags(ddText, ["b>", "i>"], ["strong>", "em>"])}</dd>
			`;
          })
          .join("")}
			</dl>
		`;
  }
  tableHandler(data) {
    return `
			<table>
				${data.content
          .map((row, index) => {
            return `
						<tr>
							${row
                .map((column) => {
                  if (index === 0) {
                    return `<th>${column}</th>`;
                  } else return `<td>${column}</td>`;
                })
                .join("")}
						</tr>
					`;
          })
          .join("")}
			</table>
		`;
  }

  imageHandler(data) {
    return `<img src="${data.url}" alt="${data.caption}">`;
  }

  quoteHandler(data) {
    return `<blockquote class="blockquoteCustomStyle" data-caption="- ${data.caption}">${data.text}</blockquote>`;
  }

  replaceTags(data, oldTags, newTags) {
    let newData;
    oldTags.forEach((oldTag, index) => {
      let regex = new RegExp(oldTag, "g");
      if (!newData) newData = data.replace(regex, newTags[index]);
      // will replace <b> with <strong>
      else newData = newData.replace(regex, newTags[index]); // will replace <i> with <em>
    });
    return newData;
  }
};

// Actually, this is my first "practical" test of "closure", LOL

function createSubArray(blocks) {
  let startFrom = 0;

  return function () {
    let subArray = [];
    console.log("started from: " + startFrom);
    for (let i = startFrom; i < blocks.length; i++) {
      if (i !== startFrom && blocks[i].data.level == 2) {
        startFrom = i;
        break;
      }
      subArray.push(blocks[i]);
    }
    // return {subArray: subArray, startFrom: startFrom};
    return subArray;
  };
}
