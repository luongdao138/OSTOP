function Tabs() {
  var bindAll = function () {
    var tabs = document.querySelectorAll('[data-tab]');
    for (var i = 0; i < tabs.length; i++) {
      tabs[i].addEventListener('click', change, false);
    }
  }

  var clear = function () {
    var tabs = document.querySelectorAll('[data-tab]');
    for (var i = 0; i < tabs.length; i++) {
      tabs[i].classList.remove('active-tab');
      var id = tabs[i].getAttribute('data-tab');
      document.getElementById(id).classList.remove('active-tab');
    }
  }

  var change = function (e) {
    clear();
    e.currentTarget.classList.add('active-tab');
    var id = e.currentTarget.getAttribute('data-tab');
    document.getElementById(id).classList.add('active-tab');
  }

  bindAll();
}