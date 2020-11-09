/*
 * Landing Page Animation & Redirect
 */

$(document).ready(function() {
  $("#splash-title").addClass("fade-in");
  $("#splash-date").addClass("fade-in");
  $("#enter-link").addClass("fade-in");
  setTimeout(delay_overlay_fade, 3000);
});

function delay_overlay_fade() {
  $("#overlay").addClass("fade-in");
}
