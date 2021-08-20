/**
 * VARIABLES Declaration
*/
const accesslink = document.getElementById("accessible");
const photographersList = document.querySelector(".photographer");
const navTags = document.querySelector(".navigation-tags");
const requestURL = "./base.json";
let parsedUrl = new URL(window.location.href);
let filterTag = parsedUrl.searchParams.get("tag");

let myTagArray = [];
let myTagFilter = [];

/**
 * FETCH METHOD
*/

fetch(requestURL)
  .then(response => {
    if (response.ok) {
      response.json().then(data => {
        showAllTags(data.photographers);
        showPhotographers(data.photographers);
      });
    }
    else {
      document.getElementById("error-json").style.display = "block";
      document.getElementById("error-json").innerHTML = "Erreur avec le fichier JSON<br>" + response.status + " " + response.statusText;
    }
  });

/**
 * KEYBOARD EVENT 
 * Keyboard navigation
 */

window.addEventListener("keydown", function (e) {
  if (e.defaultPrevented) {
    return;
  }
  if (e.key === "Tab" && accesslink.getAttribute("style") == null) {
    accesslink.style.visibility = "visible";
  }
});



/**
 * CLASS PHOTOGRAOHER
 * Function : createPhotographer
 * Description : display the photographer's info

*/

class Photographer {
  constructor(id, info) {
    this.id = id;
    this.tags = info.tags;
    this.name = info.name;
    this.city = info.city;
    this.country = info.country;
    this.tagline = info.tagline;
    this.portrait = info.portrait;
    this.price = info.price;
  }


  getHomeInfo() {
    let listTags = this.tags;
    let textTag = "";
    for (let tag in listTags) {
      textTag += `<li class="photographer-tags-link"><a href="index.html?tag=${listTags[tag]}"><span aria-label="tag">#${listTags[tag]}</span></a></li>`;
    }
    photographersList.innerHTML += `<li class="space-card">
                                            <a href="page-photographer.html?id=${this.id}&filt=Popular&tag=off" aria-label="${this.name}">
                                                <img src="./Photos/id/${this.portrait}" aria-label="${this.name}" class="photographer-photo-home"><br>
                                                <h2 class="name">${this.name}</h2>
                                            </a>
                                            <p role="text paragraph" class="comment">
                                                <span class="local">${this.city}, ${this.country}</span>
                                                <span class="photographer_desc">${this.tagline}</span>
                                                <span class="price">${this.price}€/jour</span>
                                            </p>
                                            <ul class="tags">
                                                ${textTag}
                                            </ul>
                                            </li>`;
  }
}

/**
 * FUNCTION showAllTags()
 * Description : create an array of tags and display them in a list
 */

function showAllTags(obj) {
  for (let i = 0; i < obj.length; i++) {
    for (let tag of obj[i].tags) {
      if (myTagArray.indexOf(tag) == -1) {
        myTagArray.push(tag);
      }
    }
  }

  for (let tags of myTagArray) {
    navTags.innerHTML += `<li aria-label="Tag" class="tagg-link"><a href="index.html?tag=${tags}">#${tags}</a></li>`;
  }
}

/**
 * FUNCTION showPhotographers()
 * Description : 
 *      display the photographers's list
 *      and by a tag's click, filtering the list * 
 */
function showPhotographers(obj) {
  for (let item of obj) {
    for (let tag of item.tags) {
      if (filterTag != null && tag == filterTag) {
        myTagFilter.push(item);
      }
    }
  }

  myTagFilter.length > 0 ? obj = myTagFilter : obj;

  for (let info of obj) {
    const newPhotographer = new Photographer(info.id, info);
    newPhotographer.getHomeInfo();
  }

  const tagItems = document.querySelectorAll(".photographer-tags-link");

  tagItems.forEach(item => {
    item.addEventListener("click", function (e) {
      let valueTag = item.textContent;
      let myItem = valueTag.substring(1, valueTag.length);
      e.preventDefault();

      for (let photographer of obj) {
        for (let j = 0; j < photographer.tags.length; j++) {
          if (myItem == photographer.tags[j]) {
            document.location.assign(document.URL.replace(document.URL.substring(document.URL.indexOf("?tag=")), "?tag=" + myItem));
          }
        }
      }
    });
  });
}