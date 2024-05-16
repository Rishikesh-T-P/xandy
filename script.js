// Smooth Scrolling
const navLinks = document.querySelectorAll('nav a');

navLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const targetId = e.currentTarget.getAttribute('href');
    const targetElement = document.querySelector(targetId);

    targetElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  });
});

// Animated Sections
const sections = document.querySelectorAll('.section');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate');
    } else {
      entry.target.classList.remove('animate');
    }
  });
}, { threshold: 0.5 });

sections.forEach(section => {
  observer.observe(section);
});

// Interactive Form
const form = document.getElementById('contact-form');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const messageInput = document.getElementById('message');
const formMessages = document.getElementById('form-messages');

form.addEventListener('submit', e => {
  e.preventDefault();

  // Clear previous messages
  formMessages.innerHTML = '';

  // Form validation
  let isValid = true;
  if (nameInput.value.trim() === '') {
    displayFormMessage('Name is required', 'error');
    isValid = false;
  }

  if (emailInput.value.trim() === '') {
    displayFormMessage('Email is required', 'error');
    isValid = false;
  } else if (!isValidEmail(emailInput.value.trim())) {
    displayFormMessage('Please enter a valid email address', 'error');
    isValid = false;
  }

  if (messageInput.value.trim() === '') {
    displayFormMessage('Message is required', 'error');
    isValid = false;
  }

  // Submit the form via AJAX if valid
  if (isValid) {
    const formData = new FormData(form);
    fetch(form.action, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    }).then(response => {
      if (response.ok) {
        displayFormMessage('Thank you for your message!', 'success');
        form.reset();
      } else {
        response.json().then(data => {
          if (Object.hasOwn(data, 'errors')) {
            data.errors.forEach(error => {
              displayFormMessage(error.message, 'error');
            });
          } else {
            displayFormMessage('Oops! There was a problem submitting your form', 'error');
          }
        });
      }
    }).catch(() => {
      displayFormMessage('Oops! There was a problem submitting your form', 'error');
    });
  }
});

// Display form validation messages
function displayFormMessage(message, type) {
  const messageElement = document.createElement('div');
  messageElement.textContent = message;
  messageElement.classList.add('form-message', type);
  formMessages.appendChild(messageElement);

  // Remove message after 3 seconds
  setTimeout(() => messageElement.remove(), 3000);
}

// Email validation function
function isValidEmail(email) {
  const emailRegex = /\S+@\S+\.\S+/;
  return emailRegex.test(email);
}
