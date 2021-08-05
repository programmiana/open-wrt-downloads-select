import dataWirklich from "./data-wirklich.js";

const form = document.querySelector(".input");

form.appendChild(document.createElement("input"));

const input = document.querySelector("input");
input.insertAdjacentElement("afterend", document.createElement("div"));
const searchResultsDiv = document.querySelectorAll("div")[1];

let state = {
  isSearching: false,
  foundResults: [],
  searchString: "",
};

const { profiles } = dataWirklich;

input.addEventListener("input", (e) => runSearch(e));

generateHtml(state);

function runSearch(e) {
  e.preventDefault();
  const searchString = e.currentTarget.value;
  
    const fuse = new Fuse(profiles, {
      includeScore: true,
      threshold: 0.3,
      keys: ["titles.model", "titles.variant", "titles.vendor"],
    });

    state.searchString = searchString;
    state.foundResults = fuse.search({
      $and: searchString.split(" ").map((x) => ({
        $or: [
          { "titles.model": x },
          { "titles.variant": x },
          { "titles.vendor": x },
        ],
      })),
    });
    state.isSearching = true;
    dispatch(state, fuse);
  
}

function dispatch(state) {
  if (state.isSearching) {
    generateHtml(state);
  } else {
    input.nextSibling.removeNode;
  }
}



function generateHtml(state) {
  console.log(state.searchString)
  if (state.searchString === "") {
    const html = "";
    return searchResultsDiv.innerHTML = html
  } else if (
    state.foundResults.length &&
    state.searchString.charAt(state.searchString.length - 1) !== " "
  ) {
    searchResultsDiv.classList.add("card");

    const html = `<ul class="list-group list-group-flush"> ${state.foundResults
      .map((el) =>
        profiles[el.refIndex].titles
          .map(
            (el) =>
              `<li class="list-group-item">${el.vendor} ${el.model} ${el.variant ? el.variant : ""}</li>`
          )
          .join(" ")
      )
      .join(" ")}</ul>`;
    state.foundResults = [];
    state.isSearching = false;
    state.searchString = "";
    return searchResultsDiv.innerHTML = html;
  } else if (!state.foundResults && state.isSearching){
    const html = `<p> No results, please refine your search. </p>`;
    return searchResultsDiv.innerHTML = html
  }
}
