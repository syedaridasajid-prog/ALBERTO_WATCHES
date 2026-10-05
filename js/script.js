/* ============================================================
   ALBERTO WATCH COMPANY — script.js  (Single Page App)
   Simple JS only: functions, loops, events, validation
   ============================================================ */

/* ---------------------------------------------------------
   1. LIVE DATE & TIME  (updates footer + every ticker copy)
--------------------------------------------------------- */
function updateDateTime() {
    var d = new Date();

    var dateStr = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    var hours = d.getHours();
    var minutes = d.getMinutes();
    var seconds = d.getSeconds();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    if (hours === 0) { hours = 12; }
    if (minutes < 10) { minutes = '0' + minutes; }
    if (seconds < 10) { seconds = '0' + seconds; }
    var timeStr = hours + ':' + minutes + ':' + seconds + ' ' + ampm;

    var i;
    var dateEls = document.getElementsByClassName('tDate');
    for (i = 0; i < dateEls.length; i++) { dateEls[i].innerHTML = dateStr; }
    var timeEls = document.getElementsByClassName('tTime');
    for (i = 0; i < timeEls.length; i++) { timeEls[i].innerHTML = timeStr; }
}
updateDateTime();
setInterval(updateDateTime, 1000);

/* ---------------------------------------------------------
   2. LOCATION — HTML5 Geolocation API (fallback: Karachi)
--------------------------------------------------------- */
function setLocation(text) {
    var locEls = document.getElementsByClassName('tLoc');
    for (var i = 0; i < locEls.length; i++) { locEls[i].innerHTML = text; }
}
function updateLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function (pos) {
                var lat = pos.coords.latitude.toFixed(2);
                var lon = pos.coords.longitude.toFixed(2);
                setLocation('Lat ' + lat + ', Lon ' + lon);
            },
            function () { setLocation('Karachi, Pakistan'); }
        );
    } else {
        setLocation('Karachi, Pakistan');
    }
}
updateLocation();

/* ---------------------------------------------------------
   3. VISITOR COUNTER (localStorage)
--------------------------------------------------------- */
function updateVisitorCounter() {
    var count = 1250;
    var saved = localStorage.getItem('albertoVisitors');
    if (saved !== null) { count = parseInt(saved) + 1; }
    else { count = count + 1; }
    localStorage.setItem('albertoVisitors', count);

    var navCounter = document.getElementById('visitorCountNav');
    var footCounter = document.getElementById('visitorCountFoot');
    if (navCounter) { navCounter.innerHTML = count; }
    if (footCounter) { footCounter.innerHTML = count; }
}
updateVisitorCounter();

/* ---------------------------------------------------------
   4. PRODUCT / GALLERY CATEGORY FILTER (DOM + events)
--------------------------------------------------------- */
function filterItems(category) {
    var cards = document.getElementsByClassName('filter-card');
    var buttons = document.getElementsByClassName('filter-btn');

    // highlight the clicked button
    for (var b = 0; b < buttons.length; b++) {
        buttons[b].classList.remove('active');
        if (buttons[b].getAttribute('data-filter') === category) {
            buttons[b].classList.add('active');
        }
    }
    // show / hide cards
    for (var i = 0; i < cards.length; i++) {
        var cats = cards[i].getAttribute('data-category');
        if (category === 'all' || cats.indexOf(category) !== -1) {
            cards[i].style.display = '';
        } else {
            cards[i].style.display = 'none';
        }
    }
}
var filterButtons = document.getElementsByClassName('filter-btn');
for (var f = 0; f < filterButtons.length; f++) {
    filterButtons[f].onclick = function () {
        filterItems(this.getAttribute('data-filter'));
    };
}

// Dropdown category links: scroll to products AND apply filter
var dropdownFilters = document.getElementsByClassName('dropdown-filter');
for (var df = 0; df < dropdownFilters.length; df++) {
    dropdownFilters[df].onclick = function () {
        setTimeout(function () {
            filterItems(this.getAttribute('data-filter'));
        }.bind(this), 400);
    };
}

/* ---------------------------------------------------------
   5. PRODUCT DETAILS POPUP (Bootstrap Modal)
--------------------------------------------------------- */
function showProductDetails(btn) {
    document.getElementById('modalImg').src = btn.getAttribute('data-img');
    document.getElementById('modalName').innerHTML = btn.getAttribute('data-name');
    document.getElementById('modalCat').innerHTML = btn.getAttribute('data-cat');
    document.getElementById('modalDesc').innerHTML = btn.getAttribute('data-desc');
    document.getElementById('modalBrand').innerHTML = btn.getAttribute('data-brand');
    document.getElementById('modalCategory').innerHTML = btn.getAttribute('data-cat');
    document.getElementById('modalMovement').innerHTML = btn.getAttribute('data-movement');
    document.getElementById('modalWater').innerHTML = btn.getAttribute('data-water');
    document.getElementById('modalMaterial').innerHTML = btn.getAttribute('data-material');
    document.getElementById('modalPrice').innerHTML = btn.getAttribute('data-price');
}
var detailButtons = document.getElementsByClassName('view-details-btn');
for (var d = 0; d < detailButtons.length; d++) {
    detailButtons[d].onclick = function () { showProductDetails(this); };
}

/* ---------------------------------------------------------
   6. GALLERY LIGHTBOX
--------------------------------------------------------- */
function openLightbox(item) {
    document.getElementById('lightboxImg').src = item.getAttribute('data-img');
    document.getElementById('lightboxCaption').innerHTML = item.getAttribute('data-cap');
}
var galleryItems = document.getElementsByClassName('gallery-item');
for (var g = 0; g < galleryItems.length; g++) {
    galleryItems[g].onclick = function () { openLightbox(this); };
}

/* ---------------------------------------------------------
   7. FADE-IN SECTIONS ON SCROLL
--------------------------------------------------------- */
function fadeOnScroll() {
    var sections = document.getElementsByClassName('fade-section');
    for (var s = 0; s < sections.length; s++) {
        var rect = sections[s].getBoundingClientRect();
        if (rect.top < window.innerHeight - 80) {
            sections[s].classList.add('visible');
        }
    }
}
window.onscroll = fadeOnScroll;
fadeOnScroll();

/* ---------------------------------------------------------
   8. CONTACT FORM VALIDATION
--------------------------------------------------------- */
function validateContactForm() {
    var isValid = true;

    var name = document.getElementById('cName');
    var email = document.getElementById('cEmail');
    var subject = document.getElementById('cSubject');
    var message = document.getElementById('cMessage');

    // Name: required, at least 3 characters
    if (name.value.trim().length < 3) {
        document.getElementById('errName').innerHTML = 'Please enter your full name (min 3 characters).';
        name.classList.add('invalid'); isValid = false;
    } else {
        document.getElementById('errName').innerHTML = '';
        name.classList.remove('invalid');
    }

    // Email: required, valid pattern
    var emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!emailPattern.test(email.value.trim())) {
        document.getElementById('errEmail').innerHTML = 'Please enter a valid email address.';
        email.classList.add('invalid'); isValid = false;
    } else {
        document.getElementById('errEmail').innerHTML = '';
        email.classList.remove('invalid');
    }

    // Subject: must be selected
    if (subject.value === '') {
        document.getElementById('errSubject').innerHTML = 'Please select a subject.';
        subject.classList.add('invalid'); isValid = false;
    } else {
        document.getElementById('errSubject').innerHTML = '';
        subject.classList.remove('invalid');
    }

    // Message: required, at least 10 characters
    if (message.value.trim().length < 10) {
        document.getElementById('errMessage').innerHTML = 'Message must be at least 10 characters long.';
        message.classList.add('invalid'); isValid = false;
    } else {
        document.getElementById('errMessage').innerHTML = '';
        message.classList.remove('invalid');
    }

    var successBox = document.getElementById('formSuccess');
    if (isValid) {
        successBox.style.display = 'block';
        document.getElementById('contactForm').reset();
    } else {
        successBox.style.display = 'none';
    }
    return false; // demo form — no server
}
var contactForm = document.getElementById('contactForm');
if (contactForm) { contactForm.onsubmit = validateContactForm; }

/* ---------------------------------------------------------
   9. PRICE LIST — print / download
--------------------------------------------------------- */
function printPriceList() { window.print(); }
