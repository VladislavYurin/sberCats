const createCard = (data, parent, arr, api) => {
    const card = document.createElement("div");
    card.className = "card effects";
  
    // card.setAttribute("data-id", data.id);
    card.dataset.id = data.id;

    const infoCat = document.createElement("div");
    infoCat.className = "infoCat";

    const age = document.createElement("div");
    age.className = "age";
    
    if (data.age===undefined){
        age.innerText = "##";
    }
    else {
        age.innerText = `Возраст: ${data.age}`;
    }

    const rate = document.createElement("div");
    rate.className = "rate";
    for (let i=0; i<(`${data.rate}`)/2; i++){
        rate.innerHTML += "<span>★</span>";
    }


    const pic = document.createElement("div");
    pic.className = "pic";
    pic.style.backgroundImage = `url(${data.img_link || "https://nakleikashop.ru/images/detailed/22/CAT-094.png"})`;

    const name = document.createElement("div");
    name.className = "name";
    name.innerText = data.name;

    infoCat.append(name, age, rate);

    card.append(pic, infoCat);
    card.addEventListener("click", function(e) {


        pickedCard = e.currentTarget;
        console.log(pickedCard)
        showPopup(arr, "card", data.age, data.img_link, data.name, data.description, pickedCard, api);
    });
    parent.append(card);
    
    
}

var catId

// ---------------------------------------------------------------------- ПОПАП ---------------------------------------------------------------------------

const showPopup = (list, type, catAge, catPic, catName, content, pickedCard) => {
    let el = list.filter(el => el.dataset.type === type)[0];
    // console.log(id)
    if (type === "card") {
        catId = pickedCard.getAttribute("data-id");
        el.classList.add("main")
        console.log(pickedCard)
        
        let card = document.createElement("div")
        card.classList.add("pickedCard");
        el.append(card)

        let pic = document.createElement("div");
        pic.classList.add("pickedCard__pic");
        pic.style.backgroundImage = `url(${catPic || "https://nakleikashop.ru/images/detailed/22/CAT-094.png"})`;
        

        let descr = document.createElement("div")
        let catDesr = document.createElement("h3");
        catDesr.classList.add("catDesr")
        let catinfo = document.createElement("p")
        catinfo.classList.add("catinfo")

        descr.classList.add("pickedCard__decsr");
        descr.append(catDesr, catinfo);
        catDesr.innerText = "Описание:"
        if (content===undefined){
            catinfo.innerText = "Нет описания :(";
        } else {
        catinfo.innerText = content;
        }

        let name = document.createElement("div")
        let catNnickname = document.createElement("h3");
        let nickname = document.createElement("p")
        name.append(catNnickname, nickname)
        catNnickname.innerText = "Имя:"
        name.classList.add("pickedCard__name");
        nickname.innerText = catName     

        let age = document.createElement("div");
        let catText = document.createElement("h3");
        let  ageNumber= document.createElement("p")
        age.append(catText, ageNumber)
        age.classList.add("pickedCard__age");
        catText.innerText =  `Возраст: `
        
        if (catAge===undefined){
            ageNumber.innerText = "##";
        } else {
            ageNumber.innerText =  catAge;
        }

        let rate = document.createElement("div");
        rate.classList.add("pickedCard__rate");
        
        for (let i=0; i<(pickedCard.lastElementChild.lastElementChild.childElementCount)/2; i++){
            rate.innerHTML += "<span>★</span>";
        }

        let aboutCat = document.createElement("div");
        aboutCat.classList.add("aboutCat");
        aboutCat.append(name, age, rate, descr)
        card.append(pic, aboutCat)
    }
    
    el.classList.add("active");
    el.parentElement.classList.add("active");
   
}

// ---------------------------------------------------------------------------- ИЗМЕНЕНИЕ КОТА -----------------------------------------------------------------------------

const updCat = (list, api, type, catId, catsList) => {
    document.querySelector(".btnUpd").classList.add("upd")
    let el = list.filter(el => el.dataset.type === type)[0];
    let updForm = document.forms.upd;
    updForm.classList.add("formActive");
    el.lastElementChild.remove();

    updForm.addEventListener("submit", (e) => {
            
    e.preventDefault();
    console.log(e.target, "xxxx")
    let body = {}
    let index;
    let newCat;
    for (let i = 0; i < e.target.elements.length; i++) {
        let el = e.target.elements[i]; 
        if (el.name) {
            if (el.type === "checkbox") {
                body[el.name] = el.checked;
            } else if (el.value) {
                body[el.name] = el.value;
            }
        }
    }

    for (let j =0; j < catsList.length; j++) {
        if (catsList[j].id === +catId) {
            console.log(typeof(catsList[j].id), typeof(+catId))
            index = catsList.indexOf(catsList[j]);
            newCat = {...catsList[j], ...body}
        
        }
        
    }
    console.log(newCat, +catId);

    api.updCat(+catId, body)
        .then(res => res.json())
        .then(data => {
            if (data.message === "ok") {
                catsList.splice(index, 1, newCat);
                console.log(catsList);
                localStorage.setItem("cats", JSON.stringify(catsList));
                location.reload();
            }
    })

    
})
}

// ---------------------------------------------------------- ДОБАВЛЕНИЕ КОТА ------------------------------------------------------------------

const addCat = (e, api, popupList, store) => {
    e.preventDefault();
    let body = {}; 
    for (let i = 0; i < e.target.elements.length; i++) {
        let el = e.target.elements[i]; 
        if (el.name) {
            if (el.type === "checkbox") {
                body[el.name] = el.checked;
            } else if (el.value) {
                body[el.name] = el.value;
            }
        }
    }
    api.addCat(body)
        .then(res => res.json())
        .then(data => {
            if (data.message === "ok") {
                createCard(body, document.querySelector(".container"));
                store.push(body);
                localStorage.setItem("cats", JSON.stringify(store));
                e.target.reset();
                document.querySelector(".popup-wrapper").classList.remove("active");
                location.reload();
            }
        })
}

// ------------------------------------------------- УДАЛЕНИЕ КОТА --------------------------------------------------------------------

const delCat = (catsList, api) => {
    let catId;
    let index;

    let cardList = document.querySelectorAll(".card");
    for (let i =0; i < cardList.length; i++) {

        cardList[i].classList.add("delCard");
        cardList[i].classList.remove("effects");
        let closeBtn = document.createElement("button");
        closeBtn.innerText = "+";
        closeBtn.classList.add("closeBtn");
        closeBtn.setAttribute("type", "button");
        let main = document.querySelector("main");
        cardList[i].append(closeBtn);

        closeBtn.addEventListener ("click", (e) => {
            cardList[i].style.overflow = "hidden";
            e.stopPropagation()
            catId = e.target.parentElement.getAttribute("data-id");
            let catsList = localStorage.getItem("cats");
            if (catsList) {
                catsList = JSON.parse(catsList);
            };
            
            for (let j =0; j < catsList.length; j++) {
                if (catsList[j].id === +catId) {
                    index = catsList.indexOf(catsList[j]);;
                }
            }
            
            api.delCat(catId)
                .then(res => res.json())
                .then(data => {
                    if (data.message === "ok") {
                        catsList.splice(index, 1);
                        console.log(catsList);
                        localStorage.setItem("cats", JSON.stringify(catsList));
                        location.reload();
                    }
            })
           
        })
        
    }
    
}
    