/**
 * VARIABLES Declaration
 * CONST and LET
*/
const errorText           = document.getElementById("error-json");
const dropFilterSelected  = document.getElementById("filter-selected");
const dropMenuItems       = document.querySelector(".dropdown-items");
const dropFilterIcon      = document.getElementById("filterIcon");
const dropFilterItems     = document.querySelectorAll(".dropdown-items-link");
const dropFilterItem1     = document.getElementById("filter-1");
const dropFilterItem2     = document.getElementById("filter-2");
const photographerWorks   = document.querySelector(".b-works");
const mediaList           = document.querySelector(".mediasList");
const photographerDetails = document.querySelector(".idDetails");
const photographerPicture = document.querySelector(".idPicture");
const myLightModal        = document.getElementById("lightbox");
const closeBtn            = document.querySelector(".close-lightbox");
const myContentLight      = document.querySelector(".modalLight-content");
const prevIcon            = document.querySelector(".previous");
const nextIcon            = document.querySelector(".next");
const frmContact          = document.getElementById("frmContact");
const frmPhotoName        = document.querySelector(".photographerName");
const requestURL          = "./base.json";
const parsedUrl           = new URL(window.location.href);
const loc                 = document.location;
const url                 = document.URL;
const idWorker            = parsedUrl.searchParams.get("id");
const filterType          = parsedUrl.searchParams.get("filt");



let counter           = 1;
let filterTag         = parsedUrl.searchParams.get("tag");
let myFilterMedias    = [];
let myTagFilterMedias = [];
let aggLikes          = 0;
let slideContent      = "";
let dayPrice;
let srcType;
let slideIndex = 1;

/**
 * FETCH
*/

fetch(requestURL)
    .then(function(resp) {
        if (resp.ok) {
            resp.json().then(function(datas) { 
                showAllDatas(datas); 
                carrousel(document.querySelectorAll(".vignette"));
                updateLikes(document.querySelectorAll(".fa-heart"), document.querySelectorAll(".mediaLikes"));                    
            });
        }
        else {
            errorText.style.display="block";
            errorText.innerHTML="Erreur<br>"+resp.status+" "+resp.statusText;
        }
    });

/**
 * CLASS PHOTOGRAOHER INFO
 * Function : createPhotographer
 * Description : display the photographer's info
  */

class Photographer {
    constructor(id,info) {
        this.id = id;
        this.tags = info.tags;
        this.name = info.name;
        this.city = info.city;
        this.country = info.country;
        this.tagline = info.tagline;
        this.portrait = info.portrait;
        this.price = info.price;
    }

    getInfo() {
        let listTags = this.tags;
        let textTag="";
        for (let tag in listTags) {
            textTag +=`<li class="idDetails-tagg-link"><a aria-label="tag" href="#" tabindex="4">#${listTags[tag]}</a></li>`;
        }
            photographerDetails.innerHTML += `<h1 class="title-photographer" role="header" tabindex="2">${this.name}</h1>
                                                <p class="idDetails_city" role="text" tabindex=3>${this.city}, ${this.country}</p>
                                                <p class="idDetails_slogan" role="text" tabindex="3">${this.tagline}</p>                                            
                                                <ul class="idDetails_tagg">
                                                    ${textTag}
                                                </ul>
                                        `;    
            photographerPicture.innerHTML += `<img src="./Photos/id/${this.portrait}" aria-label="${this.name}" alt="" class="photographer_photo">`;           

            dayPrice = this.price;
            frmContact.setAttribute("aria-labelledby", "Contact-" + this.name);
            frmPhotoName.textContent = this.name;
            frmPhotoName.setAttribute("id", "Contact-" + this.name);
    }
}

/**
 * EVENT LISTENER - Click
 * DOM Element : Filter button
 * Description : 
 * On click > display the list of filters .......   function toggleFilter()
 *          > reorder the content on selection ..   function moveToFirst(element-content)
 * -----------------------------------------------------------------------------------------------------
 */

dropFilterSelected.addEventListener("click", function(e) {
    e.preventDefault();
    toggleFilter();
    moveToFirst(this.innerHTML);   
});

/**
 * FUNCTION toggleFilter()
 * Description : 
 * display the filter menu with aria-expanded attribute
 */

function toggleFilter () {
    if (!dropMenuItems.getAttribute("style") || dropMenuItems.getAttribute("style") === "display: none;" ) {
        dropMenuItems.style.display = "block";
        dropFilterSelected.setAttribute("aria-expanded", "true");
        dropFilterIcon.classList.remove("fa-chevron-down");
        dropFilterIcon.classList.add("fa-chevron-up");
    }
    else {
        dropMenuItems.style.display = "none";
        dropFilterSelected.setAttribute("aria-expanded", "false");        
        dropFilterIcon.classList.remove("fa-chevron-up");
        dropFilterIcon.classList.add("fa-chevron-down");
    }
}

/**
 * FUNCTION moveToFirst()
 * Parameter : element content (Popularité / Date / Titre)
 * Description : reorganize the menu according the user's choice
 */

function moveToFirst (valItem) {
    switch (valItem) {
        case "Popularité" :
            dropFilterSelected.textContent = "Popularité";
            dropFilterItem1.textContent = "Date";
            dropFilterItem2.textContent = "Titre";
            break;
        case "Date" : 
            dropFilterSelected.textContent = "Date";
            dropFilterItem1.textContent = "Popularité";
            dropFilterItem2.textContent = "Titre";
            break;
        case "Titre" :
            dropFilterSelected.textContent = "Titre";
            dropFilterItem1.textContent = "Date";
            dropFilterItem2.textContent = "Popularité";
            break;
    }
}

/**
 * FILTER SELECTED VALUE  
 * Description : 
 * according the URL parameter "filt", change the filter selected
 */
switch (filterType) {
    case "Popular" : 
        dropFilterSelected.textContent = "Popularité"; 
        break;
    case "Date" :
        dropFilterSelected.textContent = "Date";
        break;
    case "Title" :
        dropFilterSelected.textContent = "Titre";
        break;
}

/**
 * EVENT LISTENER - Click
 * DOM Element : filter list element
 * Description : 
 * On click > display the list of filters .......   function toggleFilter()
 *          > reorder the content on selection ..   function moveToFirst(element-content)
 *          > reload page and replace the value of the filter selected by the user
 */

dropFilterItems.forEach(item => {
    item.addEventListener("click", function(e) {  
        e.preventDefault();       
        toggleFilter();
        moveToFirst(this.innerHTML);  

        switch (dropFilterSelected.textContent) {
            case "Popularité" :
                loc.assign(url.replace(url.substring(url.indexOf("&filt=")),"&filt=Popular&tag=off"));
                break;
            case "Date" :
                loc.assign(url.replace(url.substring(url.indexOf("&filt=")),"&filt=Date&tag=off"));
                break;
            case "Titre" :
                loc.assign(url.replace(url.substring(url.indexOf("&filt=")),"&filt=Title&tag=off"));
                break;
        }
    });
});

/** description: add likes
* functions: addLikes()  , getLikes(), saveLikes()
***/
function addLikes(id) {
    let listOfLikes = getLikes(); 
    listOfLikes.push(id);
    saveLikes(listOfLikes);   
}

function getLikes() {
    let listId = localStorage.getItem("newLikes");
    
    if (listId == null) { 
        return [];
    }
    else {
       return JSON.parse(listId);
    }
}

function saveLikes(list) {
    localStorage.setItem("newLikes",JSON.stringify(list));
}
 function clearLocalStorage(){
     localStorage.clear();
 }
    
/**
 * CREATE NEW ARRAY MEDIAS FILTERED
 * Class : ArrayFilterBy
 * Description : creating a new array of medias filtered
 * Method :
 *       >> getCreateArray() : create a new array of media's photographer
 *       >> getFilterBy() : sort the previous array according url parameter
 */

const ArrayFilterBy = class {
    constructor(medias,filter,type,source,counter) {
        this.medias = medias;
        this.id = medias.id;
        this.photographId = medias.photographerId;
        this.likes = medias.likes;
        this.date = medias.date;
        this.title = medias["alt-text"];
        this.tags = medias.tags;
        this.price = medias.price;
        this.filter = filter;
        this.type = type;
        this.source = source;
        this.counter = counter;
    }
    
    getCreateArray() {
        myFilterMedias.push({
            "id": this.id,
            "photographerId": this.photographId,
            "type": this.type,
            "source": this.source,
            "likes": this.likes,
            "date": this.date,
            "alt-text": this.title,
            "price": this.price,
            "tag" : this.tags
        });
        aggLikes += this.likes;
    }

    getFilterBy(){
        switch (this.filter) {
        case "Popular":
            myFilterMedias.sort((a,b)=>{
                return b.likes - a.likes;
            });
            break;
        case "Date" :
            myFilterMedias.reverse((a,b)=>{
                return a.date - b.date;
            });
            break;
        case "Title" :
            myFilterMedias.sort(function(a,b){                
                let string1=a["alt-text"];
                let string2=b["alt-text"];
                return(string1.toString().localeCompare(string2.toString()));
            });
            break;
        }
    }

    getMedias(){

        // Factory Use ---------------------------      
        let mediaType = factory(this.type,this.medias,this.counter);
        mediaType.getRender_Page();  
           
    }
};

/**
 * FOR THE TOTAL LIKES
 * class : Likes
 * Description : display the total of likes and price per day
 * Parameters :
 *      >> totalLikes : sum of likes for the photographer
 *      >> pricePerDay : price per day
 * Method :
 *      >> getTotal() : display the total of likes and the price per day
 */
const Likes = class {
    constructor(total,price) {
        this.total = total;
        this.price = price;
    }

    getTotal() {
        photographerWorks.innerHTML += `<div class="b-likes-price" tabindex="7">
                                            <span class="b-likes-price-content">${this.total} <i class="fas fa-heart"></i></span>
                                            <span class="b-likes-price-content">${this.price}€ / jour</span>
                                        </div
                                        `;

    }
};


/**
 * FUNCTION showAllDatas(object JSON)
 * ---------------------------------------------------------------------
 */

function showAllDatas(obj) {

    // display the photographer info
    let photographerInfo = obj.photographers;
    for (let info of photographerInfo) {
        if (info.id == idWorker) {
            new Photographer(idWorker,info).getInfo();
        }
    }
    // create and do filter of medias
    let photographerWork = obj.media;
    myFilterMedias.splice(0,myFilterMedias.length);
    for (let media of photographerWork) {
        if (media.photographerId == idWorker) {
            let type, source;
            if((media.image !=null) && (media.video == null)) {
                type = "image";
                source = media.image;
            } else if((media.video !=null) && (media.image == null)) {
                type = "video";
                source = media.video;
            }
            new ArrayFilterBy(media,filterType,type,source,counter).getCreateArray();
            new ArrayFilterBy(media,filterType,type,source,counter).getFilterBy();
          
        }
    }
    
    // do filter by tag
    const tagItems = document.querySelectorAll(".idDetails-tagg-link");
    tagItems.forEach(item => {
        item.addEventListener("click", function(e) {
            let valueTag = item.textContent;
            valueTag = valueTag.substring(1,valueTag.length);
            let myItem = (filterTag=="off" || filterTag!= valueTag) ? valueTag : filterTag;
            e.preventDefault();
            for (let media of myFilterMedias) {
                for (let j=0; j < media.tag.length; j++) {
                    if (myItem == media.tag[j] || filterTag == media.tag[j]) {
                        loc.assign(url.replace(url.substring(url.indexOf("&tag=")),"&tag=" + myItem));
                    }
                }
            }
        });
    });
    
    for (let tagMedia of myFilterMedias) {
        if (filterTag !="off" && filterTag == tagMedia.tag) {
            myTagFilterMedias.push(tagMedia);
        }
    }
    if (filterTag !=null && filterTag !="off") {
        myFilterMedias = myTagFilterMedias;
    }
    
    // display medias filtered or by default
    for (let media of myFilterMedias) {
        new ArrayFilterBy(media,media.filterType,media.type,media.source,counter).getMedias();
        counter ++;
    }

    // display the total of likes
    new Likes(aggLikes,dayPrice).getTotal();
    
} 

/**
 * FACTORY METHOD
 * Use :Type of Media (image or video)
*/

class MediasType {
    constructor(obj,counter) {    
        this.photographerId = obj.photographerId;
        this.id = obj.id;
        this.source = obj.source;
        this.src = obj.src;
        this.title = obj["alt-text"];
        this.slidTitle = obj.title;
        this.price = obj.price;
        this.likes = obj.likes;
        this.counter = counter;
    }
    getRender_Page() {
        mediaList.innerHTML += "";
    }
    getRender_Slide() {
        slideContent +="";
    }
}

class Image extends MediasType {
       
    getRender_Page() {      
        mediaList.innerHTML += `<li class="medias-card">
                                <a href="#" onkeypress="openLightbox(myLightModal)"><img src="./Photos/Medias/${this.photographerId}/${this.source}" aria-label="${this.title} agrandissement"  alt="" class="vignette" tabindex="${this.counter}0"  title="${this.title}" id="${this.id}" slide="${this.counter}" role="image link"></a> 
                                <div class="b-pictureInfo" aria-label="Information média">
                                    <span class="mediaText" tabindex="${this.counter}1" role="text">${this.title}</span>
                                    <span class="mediaLikes" data-id="${this.id}" role="text">${this.likes}<i class="fas fa-heart like mediaHeart" tabindex="${this.counter}3" data-id="${this.id}" aria-label="likes" role="image"></i></span>
                                </div>
                            </li>`;    
    }
    getRender_Slide() {
        slideContent +=`<div class="slide">
                            <img src="${this.src}" alt="${this.slidTitle}" class="media-slide" role="image" aria-label="${this.slidTitle}">
                            <span class="mediaText" role="text" aria-label="${this.slidTitle}">${this.slidTitle}</span>
                        </div>`;
    }
}

class Video extends MediasType {
    getRender_Page() {        
        mediaList.innerHTML += `<li class="medias-card">
                                <a href="#" onkeypress="openLightbox(myLightModal)"><video src="./Photos/Medias/${this.photographerId}/${this.source}" aria-label="${this.title} agrandissement" class="vignette" tabindex="${this.counter}0" id="${this.id}" slide="${this.counter}" title="${this.title}" role="image link"></video></a> 
                                <div class="b-pictureInfo">
                                    <span class="mediaText" tabindex="${this.counter}1" role="text">${this.title}</span>
                                    <span class="mediaLikes" data-id="${this.id}" role="text">${this.likes}<i class="fas fa-heart like mediaHeart" tabindex="${this.counter}3" data-id="${this.id}" aria-label="likes" role="image"></i></span>
                                </div>
                            </li>`;    
    }
    getRender_Slide() {
        let source = this.src;
        let extension = source.substring(source.length-3);
        slideContent +=`<div class="slide">
                            <video controls id="video" aria-label="lancer la vidéo">
                                <source src="${this.src}" alt="${this.slidTitle}" type="video/${extension}" class="media-slide" controls role="image" aria-label="${this.slidTitle}"> 
                                Votre navigateur ne prend pas en charge ce type de vidéo (${extension})                               
                            </video>
                            <span class="mediaText" aria-label="${this.slidTitle}">${this.slidTitle}</span>
                        </div>`;
    }
}

function factory(type,obj,counter) {
    switch (type) {
    case "image":
        return new Image(obj,counter);
    case "video":
        return new Video(obj,counter);
    }
}

/**
 * FUNCTIONS FOR LIGHTBOX
 * Description: 
 *      > carrousel : modal lightbox calling next functions :
 *               openLightbox : open the modal
 *               closeLightbox : close the modal
 *               showSlide : display media as slide
 *               changeSlide : navigate on slide
 *               toSlide : display the media clicked
 */

function carrousel(listMedia) {    
    
    for(let media of listMedia) {      
        media.localName == "img" ? srcType = "image" : srcType = "video";
        const mediaType = factory(srcType,media,counter);
        mediaType.getRender_Slide();
    }

    myContentLight.innerHTML += slideContent;

    listMedia.forEach(media => {
        media.addEventListener("click", function(e) {
            e.preventDefault();
            openLightbox(myLightModal);
            toSlide(parseInt(media.getAttribute("slide")));
        });
    });

    showSlide(slideIndex);
    
    closeBtn.addEventListener("click", function(e) {
        e.preventDefault();
        closeLightbox(myLightModal);
    });

    prevIcon.addEventListener("click", function(e) {
        e.preventDefault();
        changeSlide(-1);
    });

    nextIcon.addEventListener("click", function(e) {
        e.preventDefault();
        changeSlide(1);
    });    
}

function openLightbox(modal) {
    modal.style.display= "block";
}

function closeLightbox(modal) {
    modal.style.display = "none";
}

function showSlide(n) {
    let mediaSlides = document.querySelectorAll(".slide");
    if (n > mediaSlides.length) {
        slideIndex = 1;
    }    
    if (n < 1) {
        slideIndex = mediaSlides.length;
    }    
    for (let i = 0; i < mediaSlides.length; i++) {
        mediaSlides[i].style.display = "none";
    }
    
    mediaSlides[slideIndex - 1].style.display = "block";
}

function changeSlide(n) {
    showSlide(slideIndex += parseInt(n));
}

function toSlide(n) {
    showSlide(slideIndex = n);
}

/**
 * FUNCTIONS/EVENTLISTENER FOR LIKES
 * Description: 
 *      > upgrade the total of likes and the number of likes
 */
//localStorage.clear();


function updateLikes(likes,nbLikes) {
   
    likes.forEach(like => {
        like.addEventListener("click", function(e) {
            e.preventDefault();
    
            if(!like.classList.contains("liked")) {
                addLikes(this.dataset.id, this.dataset.likes);             
                like.classList.add("liked");
                aggLikes += 1 ;
                              
                nbLikes.forEach(nb => {
                    if (nb.dataset.id == like.dataset.id) {
                        nb.innerHTML = (parseInt(nb.textContent) + 1) +" <i class='fas fa-heart liked mediaHeart'></i>";                     
                        document.querySelector(".b-likes-price-content").innerHTML = parseInt(document.querySelector(".b-likes-price-content").textContent) + 1 +" <i class='fas fa-heart'></i>";
                    }
                });

            } 
               
        });
    
        if(localStorage.getItem("newLikes") !=null) {
            for(let i of JSON.parse(localStorage.getItem("newLikes"))) {
               if (i == like.dataset.id ) {
                like.classList.add("liked");
                nbLikes.forEach(nb => {
                    if (nb.dataset.id == like.dataset.id) {
                        nb.innerHTML = (parseInt(nb.textContent) + 1) +" <i class='fas fa-heart liked mediaHeart'></i>"; 
                        document.querySelector(".b-likes-price-content").innerHTML = parseInt(document.querySelector(".b-likes-price-content").textContent) + 1 +" <i class='fas fa-heart'></i>";
                    }
                    else {
                        clearLocalStorage();
                    }
                });  
               }
            }
       } 
    });     
}



/**
 * KEYEVENT CONFIGURATION
 */

 window.addEventListener("keydown", function(e) {
    if(e.defaultPrevented){
        return;     // comportement par défaut inhibé
    }
    if (e.key === "Escape" || e.key === "Esc") {
        closeLightbox(myLightModal);
    } 
    if ((e.key==="ArrowDown") && (dropMenuItems.getAttribute("style") === "display: none;" || dropMenuItems.getAttribute("style") === null) ) {
        toggleFilter();
        moveToFirst(dropFilterSelected.textContent);
    } 
    if (e.key==="ArrowRight" && myLightModal.style.display=="block") {
        changeSlide(1);
    }   
    if (e.key==="ArrowLeft" && myLightModal.style.display=="block") {
        changeSlide(-1);
    }   
    if (e.key==="Enter" && myLightModal.style.display=="block") {
        document.getElementById("video").play();
    }       
    if (e.key==="p" && myLightModal.style.display=="block") {
        document.getElementById("video").pause();
    } 

});





