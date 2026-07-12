/* Casual-save deterrents for site imagery: blocks right-click saving,
   drag-out, text/image selection, and iOS long-press callouts on photos
   and videos. Honest scope: a determined visitor can always screenshot
   or read the network tab — which is why the served files themselves are
   web-resolution, metadata-stripped, and watermarked. Originals never
   leave the studio's machine. */
(function () {
  const style = document.createElement('style');
  style.textContent =
    'img, video { -webkit-user-select: none; user-select: none; ' +
    '-webkit-user-drag: none; -webkit-touch-callout: none; }';
  document.head.appendChild(style);

  document.addEventListener('contextmenu', (e) => {
    if (e.target.closest('img, video, .tile, .card, .phone, .band, .lightbox, .exp-img')) {
      e.preventDefault();
    }
  });

  document.addEventListener('dragstart', (e) => {
    if (e.target.closest('img, video')) e.preventDefault();
  });
})();
