// Create decorative bubbles
function createBubbles() {
    const container = document.getElementById('countdown');
    const colors = ['#ff9aa2', '#ffb7b2', '#ffdac1', '#e2f0cb', '#b5ead7', '#c7ceea'];
    
    for (let i = 0; i < 8; i++) {
        const bubble = document.createElement('div');
        bubble.classList.add('bubble');
        
        // Random size and position
        const size = Math.random() * 40 + 20;
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        bubble.style.left = `${posX}%`;
        bubble.style.top = `${posY}%`;
        bubble.style.background = colors[Math.floor(Math.random() * colors.length)];
        bubble.style.opacity = Math.random() * 0.4 + 0.1;
        bubble.style.animationDuration = `${Math.random() * 10 + 5}s`;
        bubble.style.animationDelay = `${Math.random() * 5}s`;
        
        container.appendChild(bubble);
    }
}

// Calculate the countdown
function calculateCountdown() {
    // Gregorian birthday (August 23rd)
    const today = new Date();
    const currentYear = today.getFullYear();
    let solarBirthday = new Date(currentYear, 7, 23); // Months are 0-11, 7 represents August
    
    // If this year's birthday has passed, calculate for next year
    if (today > solarBirthday) {
        solarBirthday.setFullYear(currentYear + 1);
    }
    
    // Calculate the difference in days
    const timeDiff = solarBirthday.getTime() - today.getTime();
    return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
}

// Update the countdown display
function updateCountdown() {
    const days = calculateCountdown();
    document.getElementById('days').textContent = days;
    
    // If it's more than 90 days, hide the countdown
    const countdown = document.getElementById('countdown');
    if (days > 90) {
        countdown.style.display = 'none';
    } else {
        countdown.style.display = 'flex';
    }
}

// Initialize
createBubbles();
updateCountdown();
setInterval(updateCountdown, 1000 * 60 * 60); // Update once per hour
