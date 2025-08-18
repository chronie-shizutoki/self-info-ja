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
            bubble.style.zIndex = 1;
            bubble.style.position = 'absolute';
            bubble.style.zIndex = 1;
                        
            container.appendChild(bubble);
        }
    }
// Calculate the countdown
function calculateCountdown() {
    // Gregorian birthday (August 23rd)
    const today = new Date();
    // Set time to midnight to compare dates accurately
    today.setHours(0, 0, 0, 0);
    
    const currentYear = today.getFullYear();
    let solarBirthday = new Date(currentYear, 7, 23); // Months are 0-11, 7 represents August
    // Set time to midnight
    solarBirthday.setHours(0, 0, 0, 0);
    
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
    const countdown = document.getElementById('countdown');
    
    if (countdown) {
        if (days === 0) {
            // Today is birthday
            countdown.innerHTML = `
                <span class="cake-icon">🎂</span>
                <span class="birthday-today">今日は、私の誕生日なんだよ～！(＊´∀｀*)ﾉ</span>
            `;
            countdown.style.display = 'flex';
            // Add a special class for birthday
            countdown.classList.add('birthday-today');
        } else if (days > 90) {
            countdown.style.display = 'none';
            bubble.style.visibility = 'hidden';
        } else {
            // Regular countdown
            countdown.innerHTML = `
                <span class="cake-icon">🎂</span>
                <span>お誕生日まで</span>
                <span>あと</span>
                <span class="days-count" id="days">${days}</span>
                <span>日なの～♡</span>
            `;
            countdown.style.display = 'flex';
            // Remove birthday class if it exists
            countdown.classList.remove('birthday-today');
        }
    }
}

// Initialize
    updateCountdown();
    setInterval(updateCountdown, 1000 * 60 * 60); // Update once per hour
    createBubbles();