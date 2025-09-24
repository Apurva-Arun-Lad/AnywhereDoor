// Helper to get URL parameters
function getQueryParam(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

const door = document.getElementById('door');
const formArea = document.getElementById('form-area');
const sendForm = document.getElementById('send-form');
const linkResult = document.getElementById('link-result');
const receiveArea = document.getElementById('receive-area');
const foodMessage = document.getElementById('food-message');
const replyForm = document.getElementById('reply-form');
const replyLink = document.getElementById('reply-link');

const dish = getQueryParam('dish');
const sender = getQueryParam('from');

// Animation & logic for food reveal
function openDoorAnimation(callback) {
  if (!door.classList.contains('open')) {
    door.classList.add('open');
    setTimeout(callback, 850); // Show food after animation
  }
}

if (dish && sender) {
  // Recipient view: hide form, show door
  formArea.classList.add('hidden');
  receiveArea.classList.add('hidden');
  door.parentElement.style.display = 'flex';
  door.onclick = function () {
    openDoorAnimation(function() {
      // Show food message, enable reply
      door.parentElement.style.display = 'none';
      receiveArea.classList.remove('hidden');
      foodMessage.textContent = `You received "${dish}" from ${sender}!`;
      foodMessage.classList.remove('hidden');
    });
  };
} else {
  // Sender view: show form, hide receive
  formArea.classList.remove('hidden');
  receiveArea.classList.add('hidden');
  door.parentElement.style.display = 'flex';
  door.onclick = function () {
    // Animate but just open form (no food reveal needed)
    openDoorAnimation(function() {
      formArea.classList.remove('hidden');
      receiveArea.classList.add('hidden');
    });
  };
}

// Handle sender form
sendForm && sendForm.addEventListener('submit', function (e) {
  e.preventDefault();
  const senderName = document.getElementById('sender').value.trim();
  const dishName = document.getElementById('dish').value.trim();
  if (senderName && dishName) {
    // Generate link
    const baseUrl = window.location.origin + window.location.pathname;
    const link =
      `${baseUrl}?dish=${encodeURIComponent(dishName)}&from=${encodeURIComponent(senderName)}`;
    linkResult.classList.remove('hidden');
    linkResult.innerHTML = `
      <strong>Share this link with your friend:</strong><br>
      <a href="${link}" target="_blank">${link}</a>
    `;
  }
});

// Handle reply form (recipient sending back)
replyForm && replyForm.addEventListener('submit', function (e) {
  e.preventDefault();
  const replyDish = document.getElementById('reply-dish').value.trim();
  if (replyDish && sender) {
    // Generate link back to sender
    const baseUrl = window.location.origin + window.location.pathname;
    const link =
      `${baseUrl}?dish=${encodeURIComponent(replyDish)}&from=You`;
    replyLink.classList.remove('hidden');
    replyLink.innerHTML = `
      <strong>Send this link back to your friend:</strong><br>
      <a href="${link}" target="_blank">${link}</a>
    `;
  }
});