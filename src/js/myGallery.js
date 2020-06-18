/*
lightGallery(document.getElementById('galleryOne'), {
    thumbnail: true
});
*/

document.getElementById('launch-img').addEventListener('click', function() {
    lightGallery(document.getElementById('launch-img'), {
        thumbnail: true,
        animateThumb: true,
        showThumbByDefault: true,
        dynamic: true,
        dynamicEl: [{
            "src": '../media/gallery/01.png',
            'thumb': '../media/gallery/01.png',
            'subHtml': '<h4>Test 1</h4><p>Testing stuff</p>'
        }, {
            'src': '../media/gallery/02.jpg',
            'thumb': '../media/gallery/02.jpg',
            'subHtml': "<h4>Test 2</h4><p>... still testing</p>"
        }, {
            'src': '../media/gallery/03.jpg',
            'thumb': '../media/gallery/03.jpg',
            'subHtml': "<h4>Test 3</h4><p>last test</p>"
        }]
      })
    });
