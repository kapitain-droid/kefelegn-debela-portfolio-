// Vibe Type Test - JavaScript
const sampleText = document.getElementById('sampleText');
const typingInput = document.getElementById('typingInput');
const timerDisplay = document.getElementById('timer');
const wpmDisplay = document.getElementById('wpm');
const accuracyDisplay = document.getElementById('accuracy');
const resetBtn = document.getElementById('resetBtn');
const newTextBtn = document.getElementById('newTextBtn');

let startTime;
let timerInterval;
let isRunning = false;

// Sample texts for the typing test
const sampleTexts = [
    "The quick brown fox jumps over the lazy dog. Programming is fun when you vibe with it.",
    "Hello world! This is a typing speed test. Practice makes perfect, so keep typing away.",
    "JavaScript is the language of the web. Building projects is the best way to learn coding skills.",
    "Vibe coding means building iteratively and having fun while creating something useful.",
    "Typing fast and accurately is a valuable skill in today's digital world. Keep practicing!",
    "The best way to learn programming is by building real projects and solving actual problems.",
    "Consistent practice improves your typing speed and accuracy over time. Don't give up!",
    "Web development combines creativity with technical skills to build amazing applications."
];

// Initialize the typing test
function initTypingTest() {
    const randomText = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
    sampleText.innerHTML = '';
    
    // Create spans for each character
    randomText.split('').forEach(char => {
        const span = document.createElement('span');
        span.textContent = char;
        sampleText.appendChild(span);
    });
    
    // Reset all values
    typingInput.value = '';
    typingInput.disabled = false;
    clearInterval(timerInterval);
    isRunning = false;
    timerDisplay.textContent = '0';
    wpmDisplay.textContent = '0';
    accuracyDisplay.textContent = '0';
    
    // Focus on input
    typingInput.focus();
}

// Start timer on first keypress
typingInput.addEventListener('input', function() {
    if (!isRunning && this.value.length > 0) {
        startTime = new Date();
        isRunning = true;
        timerInterval = setInterval(updateTimer, 1000);
    }
    highlightCharacters();
    calculateStats();
});

// Update timer display
function updateTimer() {
    const currentTime = new Date();
    const elapsed = Math.floor((currentTime - startTime) / 1000);
    timerDisplay.textContent = elapsed;
}

// Highlight characters based on user input
function highlightCharacters() {
    const typedText = typingInput.value;
    const characterSpans = sampleText.querySelectorAll('span');
    
    characterSpans.forEach((span, index) => {
        span.className = '';
        
        if (index < typedText.length) {
            if (typedText[index] === span.textContent) {
                span.classList.add('correct');
            } else {
                span.classList.add('incorrect');
            }
        }
        
        if (index === typedText.length) {
            span.classList.add('current');
        }
    });
}

// Calculate typing statistics
function calculateStats() {
    const typedText = typingInput.value;
    const originalText = sampleText.textContent;
    
    // Calculate accuracy
    let correctChars = 0;
    for (let i = 0; i < typedText.length; i++) {
        if (typedText[i] === originalText[i]) {
            correctChars++;
        }
    }
    
    const accuracy = typedText.length > 0 ? Math.round((correctChars / typedText.length) * 100) : 0;
    accuracyDisplay.textContent = accuracy;

    // Calculate WPM (words per minute)
    const timeInMinutes = (new Date() - startTime) / 60000;
    const words = typedText.length / 5; // Standard: 5 characters = 1 word
    const wpm = timeInMinutes > 0 ? Math.round(words / timeInMinutes) : 0;
    wpmDisplay.textContent = wpm;

    // Check if test is completed
    if (typedText.length === originalText.length) {
        completeTest(accuracy);
    }
}

// Handle test completion
function completeTest(accuracy) {
    clearInterval(timerInterval);
    typingInput.disabled = true;
    
    // Add celebration effect
    sampleText.classList.add('celebrate');
    
    // Show results message
    let message = '';
    if (accuracy >= 95) {
        message = `🎉 Outstanding! ${accuracy}% accuracy - You're a typing master!`;
    } else if (accuracy >= 85) {
        message = `👍 Excellent work! ${accuracy}% accuracy - Very impressive!`;
    } else if (accuracy >= 70) {
        message = `👏 Good job! ${accuracy}% accuracy - Keep practicing!`;
    } else {
        message = `✍️ Completed! ${accuracy}% accuracy - Don't give up, practice makes perfect!`;
    }
    
    sampleText.innerHTML = message;
    
    // Remove celebration class after animation
    setTimeout(() => {
        sampleText.classList.remove('celebrate');
    }, 1000);
}

// Event listeners for buttons
resetBtn.addEventListener('click', initTypingTest);
newTextBtn.addEventListener('click', initTypingTest);

// Initialize the test when page loads
document.addEventListener('DOMContentLoaded', initTypingTest);

// Prevent paste in typing input (for accurate testing)
typingInput.addEventListener('paste', function(e) {
    e.preventDefault();
    alert('Pasting is disabled for accurate typing test results!');
});
// Add this function to save results to phone cloud
async function saveToPhoneCloud(wpm, accuracy, duration, totalChars) {
  try {
    const response = await fetch('http://localhost:8080/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        wpm: wpm,
        accuracy: accuracy,
        duration: duration,
        totalChars: totalChars,
        timestamp: new Date().toLocaleString()
      })
    });
    
    const result = await response.json();
    console.log('Saved to phone cloud:', result);
  } catch (error) {
    console.log('Phone cloud not available, using localStorage');
    
    // Phone Cloud Storage Functions
async function saveToPhoneCloud(typingData) {
    try {
        const response = await fetch('http://localhost:8080/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                wpm: typingData.wpm,
                accuracy: typingData.accuracy,
                duration: typingData.duration,
                totalChars: typingData.totalChars,
                textSample: typingData.textSample,
                timestamp: new Date().toLocaleString()
            })
        });
        
        const result = await response.json();
        console.log('✅ Saved to phone cloud:', result);
        return true;
    } catch (error) {
        console.log('❌ Phone cloud not available');
        return false;
    }
}

async function loadFromPhoneCloud() {
    try {
        const response = await fetch('http://localhost:8080/data');
        const data = await response.json();
        console.log('📊 Loaded from cloud:', data.length + ' records');
        return data;
    } catch (error) {
        console.log('❌ Could not load from cloud');
        return [];
    }
}
    // You can add localStorage fallback here
    // In your completeTest function, add this:
    function completeTest(wpm, accuracy) {
    // Your existing code...
    
    // ADD THIS PART:
    const typingData = {
        wpm: wpm,
        accuracy: accuracy,
        duration: Math.floor((new Date() - startTime) / 1000),
        totalChars: typingInput.value.length,
        textSample: sampleText.textContent.substring(0, 50) + '...'
    };
    
    // Save to phone cloud
    saveToPhoneCloud(typingData);
    
    // Rest of your existing code...
}
saveToPhoneCloud(wpm, accuracy, duration, totalChars);

async function viewCloudHistory() {
    const data = await loadFromPhoneCloud();
    
    if (data.length === 0) {
        alert('No data in cloud storage yet!');
        return;
    }
    
    let message = `📊 Cloud Storage - ${data.length} tests:\n\n`;
    data.forEach((test, index) => {
        message += `${index + 1}. ${test.wpm} WPM, ${test.accuracy}% accuracy\n`;
    });
    
    alert(message);
}

  }
}