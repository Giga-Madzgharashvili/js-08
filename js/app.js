let postBlock = document.getElementById("post-block");
let overlay = document.getElementById("overlay");
let postContent = document.getElementById("postcontent");
let closePopup = document.getElementById("close");
let addPost = document.getElementById("add");
let postOverlayAdd = document.getElementById("postForm");
let form = document.getElementById("addPostForm");
let input = document.getElementById("posttitle");

function ajax(url, callback) {
  let requistAjax = new XMLHttpRequest();
  requistAjax.open("GET", url);
  requistAjax.addEventListener("load", function () {
    let getData = JSON.parse(requistAjax.responseText);
    callback(getData);
  });

  requistAjax.send();
}
function createPost(item) {
  let divTag = document.createElement("div");
  divTag.classList.add("posts");
  divTag.setAttribute("data-id", item.id);

  let postId = document.createElement("h2");
  postId.innerText = item.id;

  let postTitle = document.createElement("h3");
  postTitle.innerText = item.title;

  let deleteButton = document.createElement("i");
  deleteButton.classList.add("fa-solid", "fa-trash");
  deleteButton.setAttribute("data-id", item.id);
  divTag.appendChild(postId);
  divTag.appendChild(postTitle);
  divTag.appendChild(deleteButton);

  divTag.addEventListener("click", function (event) {
    let id = event.target.getAttribute("data-id");
    overlay.classList.add("active");
    let url = `https://jsonplaceholder.typicode.com/posts/${id}`;
    ajax(url, function (getData) {
      overflayFunction(getData);
    });
  });

  deleteButton.addEventListener("click", function (event) {
    event.stopPropagation();
    let id = event.target.getAttribute("data-id");
    let url = `https://jsonplaceholder.typicode.com/posts/${id}`;
    fetch(url, {
      method: "DELETE",
    }).then(() => divTag.remove());
  });

  postBlock.appendChild(divTag);
}

ajax("https://jsonplaceholder.typicode.com/posts", function (getData) {
  getData.forEach((item) => {
    createPost(item);
  });
});

function overflayFunction(item) {
  let postDescription = document.createElement("p");
  postDescription.innerText = item.body;
  postDescription.classList.add("postis-teksti");

  postContent.appendChild(postDescription);
}

closePopup.addEventListener("click", function () {
  overlay.classList.remove("active");
  postContent.innerHTML = "";
});

addPost.addEventListener("click", function () {
  postOverlayAdd.classList.add("addActive");
  input.value = "";
});

form.addEventListener("submit", function (event) {
  event.preventDefault();
  let formData = {
    title: event.target[0].value,
  };
  fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    body: JSON.stringify(formData),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then((response) => response.json())
    .then((post) => {
      postOverlayAdd.classList.remove("addActive");
      createPost(post);
    });
});
