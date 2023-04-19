// 1. После нажатия на кнопку вызываем срабатывание кода
// 2. Если есть параметр, добавляем на кнопки события.
// 3. Если нет, то пишем "Квиз не найден"



chrome.runtime.onMessage.addListener(function GetMessage (message) {

  if (!message.data) {
    document.querySelector('.info').textContent = "Квиз не найден";
    return
  }

  document.querySelector('.info').textContent = "Квиз найден";
  document.querySelector('.menu').classList.add('active');
  document.querySelector('#inputQuizId').value = message.data.id;
  document.querySelector('#inputUserId').value = message.data.userId;
  if (message.data.region === 'eu') {
    document.querySelector('.editor').href = `https://panel.marquiz.ru/quizzes/${message.data.id}/edit#start_page`;
    document.querySelector('.admin').href = `https://panel.marquiz.ru/admin/user/${message.data.userId}`;
  } else if (message.data.region === 'us') {
    document.querySelector('.editor').href = `https://app.marquiz.io/quizzes/${message.data.id}/edit#start_page`;
    document.querySelector('.admin').href = `https://app.marquiz.io/admin/user/${message.data.userId}`;
  }

  document.querySelector("#copyQuizId").addEventListener("click", () => {
    copy('inputQuizId')
  });
  document.querySelector("#copyUserId").addEventListener("click", ()=> {
    copy('inputUserId')
  });
  setTimeout(() => {
    document.querySelector('.info').textContent = ''
  }, 2000);
});


function copy(id) {
  var copyText = document.querySelector(`#${id}`);
  window.navigator.clipboard.writeText(copyText.value)
  document.querySelector('.info').textContent = "Скопированно";
  setTimeout(() => {
    document.querySelector('.info').textContent = ''
  }, 2000);
}


var tabId;
chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
  tabId = tabs[0].id;
  myAction();
});

function myAction() {
  chrome.scripting.executeScript({
    target: { tabId } ,
    func: () => { startSearch() }
  })
}


