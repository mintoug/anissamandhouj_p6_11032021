/**
 * VARIABLES Declaration
*/
const errorText = document.getElementById("error-json");
const dropFilterSelected = document.getElementById("filter-selected");
const dropMenuItems = document.querySelector(".dropdown-items");
const dropFilterIcon = document.getElementById("filterIcon");
const dropFilterItems = document.querySelectorAll(".dropdown-items_link");
const dropFilterItem1 = document.getElementById("filter-1");
const dropFilterItem2 = document.getElementById("filter-2");
const photographerWorks = document.querySelector(".b-works");
const mediaList = document.querySelector(".mediasList");
const photographerDetails = document.querySelector(".idDetails");
const photographerPicture = document.querySelector(".idPicture");

const requestURL = "./base.json";
const parsedUrl = new URL(window.location.href);
const loc = document.location;
const url = document.URL;
const idWorker = parsedUrl.searchParams.get("id");
const filterType = parsedUrl.searchParams.get("filt");

/**
 * FETCH

*/

fetch(requestURL)
    .then(function(resp) {
        if (resp.ok) {
            resp.json().then(function(datas) { 
                showAllDatas(datas); 
                                   
            })
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
 * ------------------
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
        let textTag=``;
        for (let tag in listTags) {
            textTag +=`<li class="idDetails_tagg_link"><a aria-label="tag" href="#" tabindex="4">#${listTags[tag]}</a></li>`;
        }
            photographerDetails.innerHTML += `<h1 class="title-photographer" role="header" tabindex="2">${this.name}</h1>
                                                <p class="idDetails_city" role="text" tabindex=3>${this.city}, ${this.country}</p>
                                                <p class="idDetails_slogan" role="text" tabindex="3">${this.tagline}</p>                                            
                                                <ul class="idDetails_tagg">
                                                    ${textTag}
                                                </ul>
                                            `;    
            photographerPicture.innerHTML += `<img src="./photos/id/${this.portrait}" aria-label="${this.name}" alt="" class="photographer_photo">`;           

            
    }
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
 * FUNCTION showAllDatas(object JSON)

 */

 function showAllDatas(obj) {

    // display the photographer info
    let photographerInfo = obj.photographers;
    for (let info of photographerInfo) {
        if (info.id == idWorker) {
            new Photographer(idWorker,info).getInfo();
        }
    }
 }


 