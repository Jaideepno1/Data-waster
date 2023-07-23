mdc.autoInit();

$(".option--mbs").hide();

String.prototype.cycle = function(arr) {
  const i = arr.indexOf(this.toString());
  if (i === -1) return undefined;
  return arr[(i + 1) % arr.length];
};

const handleTheme = () => {
  switch (localStorage.getItem("theme")) {
    case "light":
      $(".theme-toggle--svg").html(
        `<path fill="none" d="M0 0h24v24H0V0z"/><path d="M20 8.69V4h-4.69L12 .69 8.69 4H4v4.69L.69 12 4 15.31V20h4.69L12 23.31 15.31 20H20v-4.69L23.31 12 20 8.69zm-2 5.79V18h-3.52L12 20.48 9.52 18H6v-3.52L3.52 12 6 9.52V6h3.52L12 3.52 14.48 6H18v3.52L20.48 12 18 14.48zM12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/><circle cx="12" cy="12" r="2.5"/>`
      );
      $("body").removeClass("setting--dark");
      break;
    case "dark":
      $(".theme-toggle--svg").html(
        `<path fill="none" d="M0 0h24v24H0V0z"/><path d="M20 8.69V4h-4.69L12 .69 8.69 4H4v4.69L.69 12 4 15.31V20h4.69L12 23.31 15.31 20H20v-4.69L23.31 12 20 8.69zm-2 5.79V18h-3.52L12 20.48 9.52 18H6v-3.52L3.52 12 6 9.52V6h3.52L12 3.52 14.48 6H18v3.52L20.48 12 18 14.48zM12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/>`
      );
      $("body").addClass("setting--dark");
      break;
    default:
      $(".theme-toggle--svg").html(
        `<path fill="none" d="M0 0h24v24H0V0z"/><path d="M11 7l-3.2 9h1.9l.7-2h3.2l.7 2h1.9L13 7h-2zm-.15 5.65L12 9l1.15 3.65h-2.3zM20 8.69V4h-4.69L12 .69 8.69 4H4v4.69L.69 12 4 15.31V20h4.69L12 23.31 15.31 20H20v-4.69L23.31 12 20 8.69zm-2 5.79V18h-3.52L12 20.48 9.52 18H6v-3.52L3.52 12 6 9.52V6h3.52L12 3.52 14.48 6H18v3.52L20.48 12 18 14.48z"/>`
      );
      const hours = new Date().getHours();
      $("body").toggleClass(
        "setting--dark",
        hours <= 6 ||
          hours >= 20 ||
          window.matchMedia("(prefers-color-scheme: dark)").matches ||
          window.matchMedia("(-ms-high-contrast: white-on-black)").matches
      );
  }
};

if (!localStorage.getItem("theme")) localStorage.setItem("theme", "auto");
handleTheme();
$("body").addClass("setting--animate-colours");

$(".theme-toggle").click(() => {
  localStorage.setItem(
    "theme",
    localStorage.getItem("theme").cycle(["auto", "light", "dark"])
  );
  handleTheme();
});

const stopwatch = new Stopwatch();
let running = false;
let wasted = 0;
let xhr = [];
let threads = 8;
let time = 0;
let goal = 0;
const chunk = 800000;
const v = 2;
const int = null;
const stopped = false;
let speed = 0;
let url = "";

const getmbs = () =>
  $(".option--unlimited").get(0).MDCSwitch.checked
    ? 0
    : parseInt($(".option--mbs").get(0).MDCTextField.value);

const download = id => {
  if (xhr[id] && xhr[id].status == 200) {
    wasted += chunk;
    $(".output--byte").html(((0 | (wasted * 100 / 1048576)) / 100).toFixed(2));
    speed = wasted / (new Date().getTime() - time) * 1000;
    speed = (0 | (speed * 100 / 1048576)) / 100;
    $(".output--speed").html(speed.toFixed(2));
    if (
      getmbs() !== 0 &&
      parseInt($(".output--byte").html()) /
        parseInt($(".option--mbs").get(0).MDCTextField.value) <
        1.0
    ) {
      $(".output--progress").get(0).MDCLinearProgress.progress =
        parseInt($(".output--byte").html()) /
        parseInt($(".option--mbs").get(0).MDCTextField.value);
    } else {
      $(".output--progress").get(0).MDCLinearProgress.progress = 1.0;
    }
    if (goal !== 0 && wasted >= goal * 1048576) {
      $(".snackbar--done")
        .get(0)
        .MDCSnackbar.open();
      stop();
    }
  }
  if (running == true)
    xhr[id] = $.get(
      `https://sao.snu.ac.kr/datawaster/dummy15?${Math.random()}`,
      () => download(id)
    );
};

let ticker;

const start = () => {
  stopwatch.reset();
  $(".output--seconds").html("0 seconds");
  stopwatch.start();
  ticker = setInterval(
    () => $(".output--seconds").html(humanizeDuration(stopwatch.value * 1000)),
    1000
  );
  threads = $(".option--threads").get(0).MDCSlider.value;
  $(".option--mbs").get(0).MDCTextField.disabled = true;
  $(".option--unlimited").get(0).MDCSwitch.disabled = true;
  $(".option--threads").get(0).MDCSlider.disabled = true;
  $(".option--unlimited").get(0).MDCSwitch.disabled = true;
  $(".output--progress").get(0).MDCLinearProgress.determinate = getmbs() !== 0;
  $(".output--progress")
    .get(0)
    .MDCLinearProgress.open();
  $(".option--waste > .mdc-fab__label").html("Stop Wasting");
  $(".option--waste > .mdc-fab__icon").html(
    '<path fill="none" d="M0 0h24v24H0V0z"/><path d="M16 8v8H8V8h8m2-2H6v12h12V6z"/>'
  );

  running = true;
  wasted = 0;
  xhr = [];
  time = new Date().getTime();
  goal = getmbs();
  for (let i = 0; i < threads; i++) download(i);
};

const stop = () => {
  stopwatch.stop();
  clearInterval(ticker);
  running = false;
  document.querySelector(
    ".option--mbs"
  ).MDCTextField.disabled = document.querySelector(
    ".option--unlimited"
  ).MDCSwitch.checked;
  $(".option--unlimited").get(0).MDCSwitch.disabled = false;
  $(".option--threads").get(0).MDCSlider.disabled = false;
  $(".output--progress")
    .get(0)
    .MDCLinearProgress.close();
  $(".option--waste > .mdc-fab__label").html("Start Wasting");
  $(".option--waste > .mdc-fab__icon").html(
    '<path fill="none" d="M0 0h24v24H0V0z"/><path d="M10 8.64L15.27 12 10 15.36V8.64M8 5v14l11-7L8 5z"/>'
  );
};

const unlimitedChanged = () => {
  const on = $(".option--unlimited").get(0).MDCSwitch.checked;
  $(".option--mbs").get(0).MDCTextField.disabled = on;
  $(".option--mbs").toggle(!on);
  document.querySelector(
    ".output--progress"
  ).MDCLinearProgress.determinate = !on;
};

$(".option--unlimited")
  .get(0)
  .MDCSwitch.listen("change", () => unlimitedChanged());

$(".option--waste").click(() => {
  if ($(".option--mbs").get(0).MDCTextField.value === "") {
    $(".option--unlimited").get(0).MDCSwitch.checked = true;
    unlimitedChanged();
  }
  if (running === false && stopped === false) start();
  else if (stopped === false) stop();
});
