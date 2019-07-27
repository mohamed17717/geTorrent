// events

function changeInputDirection(event) {
  let firstLetter = event.target.value[0];

  if (firstLetter && firstLetter.toUpperCase() != firstLetter.toLowerCase()) {
    event.target.style.direction = "ltr";
  } else {
    event.target.style.direction = "rtl";
  }
}

function shrinkText(text, num) {
  let l = Math.floor((num - 3) / 2);
  return text.slice(0, l) + "..." + text.slice(-l);
}

function getYearGoogleLink(event, outputSelector) {
  let movieName = event.target.value;
  let a = document.querySelector(outputSelector);
  if (movieName) {
    let link = `https://www.google.com/search?q=${movieName} movie year`;
    let prefix = "ابحث عن السنة";
    prefix += "<br>";
    a.href = link;
    a.innerHTML = prefix + shrinkText(link, 50);
  } else {
    a.innerText = "";
  }
}

function handleHeader() {
  const headerMovieName = document.querySelector("header #movie-name");
  const header = document.querySelector("header div");

  headerMovieName.addEventListener("keyup", function(e) {
    changeInputDirection(e);
    getYearGoogleLink(e, "#google-link a");
  });

  // header fixed
  document.addEventListener("scroll", e => {
    if (window.scrollY > header.clientHeight) {
      header.style.position = "fixed";
      header.style.boxShadow = "rgb(158, 158, 158) 0px 5px 8px -4px";
      header.style.width = "90%";
    } else {
      header.style.position = "";
      header.style.boxShadow = "";
      header.style.width = "";
    }
  });
}
