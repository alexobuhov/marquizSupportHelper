// Создание функций на странице браузера

function searchUserId(message) {
  try {
      let userId = Array.from(document.querySelectorAll('.property-title')).find(node => node.innerText === 'User ID').nextElementSibling.textContent.trim();

      if (userId.length > 15 && document.querySelectorAll('.go_marquiz').length < 1) {
        let block = document.querySelector('cq-user-location')

        let button = document.createElement('a');
        button.innerHTML = 'Админка';
        button.setAttribute("href", "https://panel.marquiz.ru/admin/user/" + userId);
        button.setAttribute("target", "_blank");
        button.setAttribute("class", "go_marquiz");
        button.setAttribute("style", "background: #d34085; width: 86%; color: #fff; border-radius: 4px; padding: 7px 24px; display: flex; justify-content: center; margin: 0 0 10px 19px;");
        block.after(button)
        if (message === 'dashly') {
          let button2 = document.createElement('a');
          button2.innerHTML = 'Админка IO';
          button2.setAttribute("href", "https://app.marquiz.io/admin/user/" + userId);
          button2.setAttribute("target", "_blank");
          button2.setAttribute("class", "go_marquiz");
          button2.setAttribute("style", "background: #d34085; width: 86%; color: #fff; border-radius: 4px; padding: 7px 24px; display: flex; justify-content: center; margin: 0 0 10px 19px;")
          block.after(button2)
        }
      }
  } catch (err) {
    console.log(err)
  }
}

function searchQuizId () { // функция ищет id квиза и возвращает его если надет
  return new Promise ((resolve) => {
    let link = document.querySelector('.whitelabel__container a')
    idElem = document.querySelector('iframe[class^="marquiz"]');
    ids = "";
    let array, id;

    if (link) {
      const href = link.getAttribute('href')
      array= href.split(/=|&/);
      id = array[array.indexOf('utm_content') + 1]
    } else if (idElem) {
      idElem = document.querySelector('iframe[class^="marquiz"]').getAttribute('id');
      array = idElem.split('_');
      id = array[array.length-1 ]
    } else if (document.querySelector('[href^="#popup:marquiz"]')) {
      id = document.querySelector('[href^="#popup:marquiz"]').getAttribute("href").replace('#popup:marquiz_', '');
    } else if (window.location.origin == "https://vk.com") {
      vkIframe = document.querySelector('.app_container iframe').getAttribute('src');
      window.open(vkIframe, '_blank');
    } else if (window.location.origin == "https://quiz.marquiz.ru") {
      for (var i = 0; i < localStorage.length; i++){
          infoQuiz = localStorage.getItem(localStorage.key(i));
      }
      var mySubString = JSON.parse(infoQuiz);
      id = mySubString.id;
    } else {
      function listCookies() {
          var theCookies = document.cookie.split(';');
          aString = "";
          for (var i = 0 ; i < theCookies.length; i++) {
                  if (theCookies[i].includes("uuid_")) {
                    aString=theCookies[i];
                  }
          }
          return aString;
      }
      cookieGet = listCookies();
      var mySubString = cookieGet.substring(
        cookieGet.lastIndexOf("uuid_") + 1,
        cookieGet.lastIndexOf("=")
      );
      id = mySubString.replace('uid_', '');
    }
    resolve (id)
  })
}

async function getHttp(quizId) {
  // Функция делает Get запрос на сервр, чтобы получить данные по квизу
  let result, region;
  try {
    if (quizId.length > 20) {
      result = await fetch(`https://api.marquiz.ru/v1/Quizzes/${quizId}`);
      region = 'eu'
    }
    if (quizId.length > 20 && result && result.status === 404) {
      result = await fetch(`https://api.us.marquiz.io/v1/Quizzes/${quizId}`);
      region = 'us'
    }
    if (result && result.status === 200) {
      let data = await result.json()
      return { ...data, region }
    } else {
      console.log('Квиз не найден')
    }
  } catch (err) {
    console.log(err);
  }
}

function startSearch () {
  searchQuizId ()
    .then((quizId) => getHttp(quizId))
    .then((data) => {
      chrome.runtime.sendMessage({
        domain: '*://*',
        data
      });
    }).catch((err) => {
      console.log(err)
      chrome.runtime.sendMessage({
        domain: '*://*',
        data : null
        });
    })
}

chrome.runtime.onMessage.addListener((message) => {
  setInterval(searchUserId, 2000, message)
})
