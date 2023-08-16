const mainTitle = document.querySelector(".main_title");
const convertTextToArray = mainTitle.innerHTML.split("");
mainTitle.innerHTML = "";

let idx = 0;
const addNextSymbol = () => {
  if (idx < convertTextToArray.length) {
    mainTitle.innerHTML += convertTextToArray[idx];
    idx++;
    setTimeout(addNextSymbol, 100);
  }
};
addNextSymbol();
