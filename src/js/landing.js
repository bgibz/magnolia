/*
 * Landing Page Animation & Redirect
 */

$(document).ready(function() {
  $("#landing-title").addClass("fade-in");
  //setTimeout(redirectHome, 7000);
});

function redirectHome() {
  window.location.href = "./home.html";
}
