import Api from "./api.js";

let user = document.cookie;
if (!user){
    user = prompt("Пользователь не найден, укажите имя пользователя", "VladislavYurin");
    document.cookie = `user=${user}`;
} else {
    user = user.split("=")[1];
}

const api = new Api(user);


const container = document.querySelector(".container");
const btnAdd = document.querySelector(".btnAdd");
const popupList = document.querySelectorAll(".popup");
const popBox = document.querySelector(".popup-wrapper");

const btnDel = document.querySelector(".btnDel");
const btnUpd = document.querySelector(".btnUpd");

let catsList = localStorage.getItem("cats");
if (catsList) {
    catsList = JSON.parse(catsList);
}


const addForm = document.forms.add; 

addForm.addEventListener("submit", function(e) {
    addCat(e, api, Array.from(popupList), catsList);
});

btnDel.addEventListener("click", function () {
    delCat(catsList, api);
})





if (!catsList) {
    api.getCats()
        .then(res => res.json())
        .then(data => {
            if (data.message === "ok") {
                localStorage.setItem("cats", JSON.stringify(data.data));
                data.data.forEach(cat => {
                    createCard(cat, container, Array.from(popupList), api);
                });
            } else {
                showPopup(Array.from(popupList), "info", data.message);
            }
        });

} else {
    catsList.forEach(cat => {
        createCard(cat, container, Array.from(popupList));
    });
}


popupList.forEach(p => {
    p.firstElementChild.addEventListener("click", e => {
        p.classList.remove("active");
        popBox.classList.remove("active");
        p.classList.remove("main");
        p.lastElementChild.classList.remove("formActive");
        p.firstElementChild.nextElementSibling.classList.remove("upd")
        document.querySelector(".pickedCard").remove()
    });
});

btnAdd.addEventListener("click", e => {
    showPopup(Array.from(popupList), "add");
});


popBox.addEventListener("click", function(e) {
    if (e.target === this) {
        popBox.classList.remove("active");
        popupList.forEach(p => {
            if (p.classList.contains("active")) {
                p.classList.remove("active");
                p.classList.remove("main");
                p.firstElementChild.nextElementSibling.classList.remove("upd")
                p.lastElementChild.classList.remove("formActive");
                document.querySelector(".pickedCard").remove()
            }
        })
    }
});

window.addEventListener ("click", function(e) {
    let classList = document.querySelectorAll(".card");
    Array.from(classList).forEach(card => {
        if (e.target != btnDel) {
            card.classList.remove("delCard");
            card.classList.add("effects");
            let closeBtn = document.querySelectorAll(".closeBtn");
            closeBtn.forEach(btn => btn.remove())

        }
    })
})


let pickedCard;
        
btnUpd.addEventListener("click", function() {
    updCat(Array.from(popupList), api, "card", catId, catsList);
})