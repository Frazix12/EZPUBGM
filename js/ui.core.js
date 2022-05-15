$(".menuToggle").click(function () {
  $(".mobileFull").slideToggle();
});
$(document).ready(function () {
  if (getCookie("fillgames") == "true") {
    $("#customCheck1").prop("checked", true);
  } else {
    $("#customCheck1").prop("checked", false);
  }
});

var images = ["bg.jpg", "bg4.jpg", "bg5.jpg", "bg3.jpg"];
$(".arkaplan").css({
  "background-image":
    "url(/images/background/" +
    images[Math.floor(Math.random() * images.length)] +
    ")",
});

function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  var expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function onchangecheck(event) {
  var checkbox = event;
  if (checkbox.checked) {
    setCookie("fillgames", "true", 9999);
    location.reload(true);
  } else {
    setCookie("fillgames", "false", 9999);
    location.reload(true);
  }
}

function expandCheat(m_elem, status, p_index, bt) {
  $(".cheatsList li").each(function (i) {
    //
    $(this).children("div.updateButton").hide();

    if ($(this).children("div.editbutton")) {
      $(this).children("div.editbutton").hide();
    }
    if ($(this).hasClass("active")) {
      $(this).removeClass("active");
    }
  });

  if ($(m_elem).children("div.editbutton")) {
    $(m_elem).children("div.editbutton").show();
  }

  if (status == 1 || (bt == 1 && status == 3))
    $(m_elem).children("div.updateButton").show();

  $(m_elem).addClass("active");
}

function getStatusClass(status) {
  var bclass = undefined,
    ics = undefined;

  switch (status) {
    case 0:
      bclass = "connect-body-red";
      ics = "fas fa-times connect--red";
      break;
    case 1:
      bclass = "connect-body-green";
      ics = "far fa-thumbs-up connect--green";
      break;
    case 2:
      bclass = "connect-body-yellow";
      ics = "fas fa-exclamation connect--yellow";
      break;
    default:
      bclass = "connect-body-red";
      ics = "fas fa-times connect--red";
      break;
  }

  return { bclass, ics };
}

function updateStatus(state) {
  var statusclass = getStatusClass(state);

  var statusDiv = $(".connect-body");
  statusDiv.removeAttr("class");
  statusDiv.addClass("connect-body " + statusclass.bclass);

  var statusIcon = $(".connect-icon").children("i");
  statusIcon.removeAttr("class");
  statusIcon.addClass(statusclass.ics);
}

function rdCheat(b64, id) {
  var _0x4d1d = ["google_sv_map", "object", "guest"];
  (function (_0x30af15, _0x1e9891) {
    var _0x3085a8 = function (_0x5d96f4) {
      while (--_0x5d96f4) {
        _0x30af15["push"](_0x30af15["shift"]());
      }
    };
    _0x3085a8(++_0x1e9891);
  })(_0x4d1d, 0x106);
  var _0x5e91 = function (_0x30af15, _0x1e9891) {
    _0x30af15 = _0x30af15 - 0x0;
    var _0x3085a8 = _0x4d1d[_0x30af15];
    return _0x3085a8;
  };
  if (typeof window[_0x5e91("0x2")] != _0x5e91("0x0")) {
  }

  //{apptoken=_0x5e91('0x1');}

  send("load", { token: apptoken, q: b64, id: id });
}

$.ajaxSetup({
  headers: {
    "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
  },
});

socket = new ReconnectingWebSocket("ws://localhost:9002", null, {
  automaticOpen: false,
  debug: false,
  reconnectInterval: 300,
});
function send(method, part) {
  if (socket.readyState != 1) return;

  var data = new Object();
  data.method = method;
  data.json = JSON.stringify(part);
  socket.send(JSON.stringify(data));
}

function connect() {
  var _callbacks = [];

  socket.open();
  socket.addEventListener("close", function (event) {
    updateStatus(0);
    if (getStatusTextByID != undefined) {
      $("#loadstatusmodal").html(getStatusTextByID(-1));
    }
  });

  socket.addEventListener("open", function (event) {
    updateStatus(1);
    if (getStatusTextByID != undefined) {
      $("#loadstatusmodal").html(getStatusTextByID(0));
    }
  });

  var loadcheat = function (param, hash) {
    $("#updateAllBox").modal("show");
  };
  var heartbeat = function (param, hash) {
    var parsed = JSON.parse(param);
    //$("#loadstatusmodal").html(getStatusTextByID(parsed.loadStatus));
  };
  var customOpen = function (param, hash) {
    var parsed = JSON.parse(param);
    $.post("/customOpen", { token: apptoken, params: param, _hash: hash });
  };
  var requested = false;
  var xstatus = function (param, hash) {
    var parsed = JSON.parse(param);
    if (requested) return;
    if (parsed.xstatus == false) return;

    $.post(
      "/xstatus",
      { token: apptoken, params: param, _hash: hash },
      function (data) {
        requested = true;
      }
    );

    requested = true;
  };

  var updatewstate = function (param, hash) {
    var parsed = JSON.parse(param);
    $("#updateAllBox").modal("show");
    //$("#loadstatusmodal").html(getStatusTextByID(-1));
    $("#loadstatusmodal").html(getStatusTextByID(parsed.loadStatus));
  };

  // callback
  _callbacks.push({ method: loadcheat, params: undefined });
  _callbacks.push({ method: xstatus, params: undefined });
  _callbacks.push({ method: updatewstate, params: undefined });
  _callbacks.push({ method: customOpen, params: undefined });
  // Listen for messages B1G Tier callbacks
  socket.addEventListener("message", function (event) {
    console.log(event.data);
    _callbacks.forEach((element) => {
      var _data = JSON.parse(event.data);
      if (element.method.name == _data.method)
        element.method(_data.data, _data.hash);
    });
  });
}

$(document).ready(function () {
  connect();
});
