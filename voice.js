const micButton = document.getElementById('micButton');
const voiceResult = document.getElementById('voiceResult');
let recognition;
let isFirstClick = true;
let isProcessing = false;

console.log('Voice command script loaded.');

// Campus navigation route data
const campusRoutes = {
  "uit": {
    "name": "Unitedworld Institute of Technology (UIT)",
    "directions": "From the main entrance, go straight for 50 meters. A cascading water feature will be directly ahead. Take a right and walk 50 meters. Then take a left and walk 70 meters. You'll reach the Unitedworld Institute of Technology (UIT)."
  },
  "uwsl": {
    "name": "Unitedworld School of Law (UWSL)",
    "directions": "From the main entrance, go straight for 50 meters. You'll encounter a small waterfall directly in your path. Take a right and walk 50 meters. Then take a left and walk 70 meters. You'll reach the Unitedworld School of Law (UWSL)."
  },
  "ksd": {
    "name": "Karnavati School of Dentistry (KSD)",
    "directions": "Go straight for 50 meters from the main entrance. A water feature will be visible straight ahead. Take a right and walk 50 meters. Then take a left and go 60 meters. You'll arrive at the Karnavati School of Dentistry (KSD)."
  },
  "mess": {
    "name": "Cafeteria (MESS)",
    "directions": "Start by walking straight for 50 meters. You will find a small, decorative waterfall directly in front of you. Take a right and continue for 50 meters. Then take a left and walk 100 meters. The Cafeteria (MESS) is right there."
  },
  "ku main office": {
    "name": "KU Main Office",
    "directions": "Walk straight for 50 meters from the main entrance. A flowing water display will be right in front. Take a right turn. Then continue straight for 150 meters. You'll reach the KU Main Office."
  },
  "temple": {
    "name": "University Temple",
    "directions": "Walk 50 meters straight. You will notice a waterfall ahead. Turn right and walk 50 meters. Then take another right and walk 80 meters. You'll reach the Temple inside the campus."
  },
  "uid": {
    "name": "Unitedworld Institute of Design (UID)",
    "directions": "Walk straight for 50 meters. A small waterfall will be directly in your line of sight. Turn right. Then walk straight for 250 meters. You'll see Unitedworld Institute of Design (UID) to your left."
  },
  "container": {
    "name": "Container Cafeteria",
    "directions": "Walk straight for 50 meters. A water feature is positioned directly in front of you. Turn right. Then walk straight for 250 meters. You'll have the Container Cafeteria on your right."
  },
  "ku main ground": {
    "name": "Karnavati University Main Ground",
    "directions": "Simply walk straight from the entrance for 120 meters. The KU Main Ground will be in front of you."
  },
  "anticlockwise": {
    "name": "Anticlockwise Cafeteria",
    "directions": "Go straight for 150 meters from the entrance. The Anticlockwise Cafeteria will be on your left."
  },
  "faculty": {
    "name": "Faculty Block",
    "directions": "Walk straight for 50 meters. A small waterfall will be visible at this point. Take a left and walk 130 meters. Turn right and continue straight for 120 meters. You'll reach the Faculty Block."
  },
  "girls hostel": {
    "name": "Girls Hostel",
    "directions": "Walk straight for 50 meters from the main entrance. You'll come across a water feature directly ahead. Take a left and walk 130 meters. Turn right and continue straight for 120 meters. You'll reach the Girls Hostel."
  },
  "atm": {
    "name": "ATM",
    "directions": "Walk straight for 50 meters from the main entrance. You will encounter a small decorative waterfall. Take a left and walk 130 meters. Turn right and continue straight for 120 meters. You'll find the ATM on the ground floor of the Girls Hostel."
  },
  "sports": {
    "name": "Sports Area",
    "directions": "Walk straight for 50 meters. A small water feature will be directly in front of you. Take a left and walk 130 meters. Turn right and go 120 meters. You'll reach the Sports Area."
  },
  "gym": {
    "name": "Gym",
    "directions": "Walk straight for 50 meters. A waterfall is positioned directly in your path. Take a left and walk 130 meters. Turn right and go 120 meters. You'll reach the Gym."
  },
  "uid admin": {
    "name": "UID Admin Block",
    "directions": "From the entrance, go straight for 50 meters. You will see a small, flowing water display. Take a left and walk 130 meters. Turn right and walk 120 meters. Go straight for 50 meters. A waterfall will be visible straight ahead. Take a left and walk 60 meters. Turn right and walk another 60 meters. You'll arrive at the UID Admin Block."
  },
  "stationary": {
    "name": "Stationary Store",
    "directions": "Walk straight for 50 meters from the main entrance. You will encounter a small cascading waterfall. Turn right. Then walk straight for 250 meters until you reach the Unitedworld Institute of Design (UID). Continue a little further ahead and take a left turn. You'll find a basement entrance on your left — that's where the Stationary store is located."
  },
  "basketball court": {
    "name": "Basketball Court",
    "directions": "Walk straight for 50 meters from the main entrance. A water feature will be directly in your line of sight. Take a right turn. Then continue straight for 150 meters. The Basketball Court will be there."
  },
  "clockwise": {
    "name": "Clockwise Cafeteria",
    "directions": "Walk straight for 50 meters from the main entrance. A small waterfall will be positioned in front. Take a right turn. Then continue straight for 150 meters. The Clockwise Cafeteria will be on your right."
  },
  "i block": {
    "name": "I Block",
    "directions": "Walk straight for 50 meters from the main entrance. You will see a small waterfall directly ahead. Take a right turn. Then continue straight for 150 meters. You'll see Clockwise Cafeteria to your left, go past it and you will se I-Block to your left."
  },
  "ku Library": {
    "name": "Library",
    "directions": "Walk straight for 50 meters from the main entrance. You will see a small waterfall directly ahead. Take a right turn. Then continue straight for 150 meters. You'll see Clockwise Cafeteria to your left, go past it and you will se I-Block to your left, go the basement of I-Block there you will find library."
  }
};


// Text-to-speech function
function speak(text) {
  console.log('Speaking:', text);
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    speechSynthesis.speak(utterance);
  }
}

// Reset state on page load/refresh
function resetApplicationState() {
    console.log('Resetting application state');
    if (micButton) {
        micButton.classList.remove('listening');
    }
    if (voiceResult) {
        voiceResult.innerHTML = '<p>Welcome to Karnavati University! How can I help you?</p>';
        speak('Welcome to Karnavati University! How can I help you?');
    }
    if (recognition) {
        recognition.stop();
    }
    speechSynthesis.cancel();
    isFirstClick = true;
    isProcessing = false;
}

// Handle page refresh
window.addEventListener('beforeunload', () => {
    resetApplicationState();
    // Redirect to home page if not already there
    if (!window.location.href.endsWith('index.html')) {
        window.location.href = 'index.html';
    }
});

// Handle initial page load
if (window.performance && performance.navigation.type === 1) { 
    resetApplicationState();
}

// Check for browser support
if ('webkitSpeechRecognition' in window) {
    recognition = new webkitSpeechRecognition();
    console.log('Using webkitSpeechRecognition');
} else if ('SpeechRecognition' in window) {
    recognition = new SpeechRecognition();
    console.log('Using SpeechRecognition');
} else {
    voiceResult.innerHTML = '<p>Voice recognition is not supported in your browser. Please try Chrome or Edge.</p>';
    micButton.disabled = true;
    console.log('Speech recognition not supported');
}

if (recognition) {
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    micButton.addEventListener('click', () => {
        console.log('Mic button clicked');
        if (micButton.classList.contains('listening')) {
            recognition.stop();
            micButton.classList.remove('listening');
            voiceResult.innerHTML = '<p>Voice recognition stopped</p>';
            console.log('Recognition stopped');
        } else {
            micButton.classList.add('listening');
            if (isFirstClick) {
                voiceResult.innerHTML = '<p>Welcome to Karnavati University! How can I help you?</p>';
                speak('Welcome to Karnavati University! How can I help you?');
                isFirstClick = false;
                isProcessing = true;
                setTimeout(() => {
                    recognition.start();
                    voiceResult.innerHTML = '<p>Listening... Please tell us your destination</p>';
                    console.log('Recognition started after welcome');
                }, 3000);
            } else {
                recognition.start();
                voiceResult.innerHTML = '<p>Listening... Where would you like to go?</p>';
                console.log('Recognition started');
            }
        }
    });

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        voiceResult.innerHTML = `<p>You asked: <strong>${transcript}</strong></p>`;
        console.log('Recognition result:', transcript);
        processVoiceCommand(transcript);
        micButton.classList.remove('listening');
    };

    recognition.onerror = (event) => {
        voiceResult.innerHTML = `<p>Error occurred: ${event.error}</p>`;
        micButton.classList.remove('listening');
        console.log('Recognition error:', event.error);
    };
}

function processVoiceCommand(command) {
    let response = '';
    let shouldNavigate = false;
    let navigateTo = '';
    
    if (command.includes('stop')) {
        recognition.stop();
        speechSynthesis.cancel();
        micButton.classList.remove('listening');
        voiceResult.innerHTML = '<p>Voice recognition stopped</p>';
        isFirstClick = true;
        isProcessing = false;
        return;
    }

    // Check for location queries
    if (command.includes('show me the nearest cafeteria')) {
        const nearestCafeteria = campusRoutes.anticlockwise; 
        response = `The nearest cafeteria is ${nearestCafeteria.name}. Here are the directions to reach it: ${nearestCafeteria.directions}`;
        voiceResult.innerHTML = `<p>${response}</p>`;
        speak(response);
        isProcessing = false;
        return;
    } else if (command.includes('how many cafeterias are there in this university')) {
        response = 'There are three cafeterias in this university: Clockwise, Anticlockwise, and Container. The nearest one is Anticlockwise cafeteria.'; 
        voiceResult.innerHTML = `<p>${response}</p>`;
        speak(response);
        
        const nearestCafeteria = campusRoutes.anticlockwise; 
        setTimeout(() => {
            voiceResult.innerHTML += `<p>Here are the directions to reach it: ${nearestCafeteria.directions}</p>`;
            speak(`Here are the directions to reach it: ${nearestCafeteria.directions}`);
        }, 2000);
        isProcessing = false;
        return;
    }
    for (const [key, location] of Object.entries(campusRoutes)) {
        if (command.includes(key) || 
            command.includes(location.name.toLowerCase()) ||
            command.includes(`where is ${key}`) ||
            command.includes(`how to get to ${key}`) ||
            command.includes(`take me to ${key}`) ||
            command.includes(`guide me to ${key}`)) {
            
            response = `<p>To get to ${location.name}:</p><p>${location.directions}</p>`;
            voiceResult.innerHTML = response;
            speak(response.replace(/<[^>]*>/g, ''));
            isProcessing = false;
            setTimeout(() => {
                micButton.classList.remove('listening');
                isFirstClick = true;
            }, 1000);
            return; 
        }
    }
    if (!response) {
        // Navigation commands
        if (command.includes('open about')) {
            navigateTo = 'about.html';
            response = 'Opening About page';
            shouldNavigate = true;
        } else if (command.includes('open campus')) {
            navigateTo = 'campus.html';
            response = 'Opening Campus page';
            shouldNavigate = true;
        } else if (command.includes('open places')) {
            navigateTo = 'places.html';
            response = 'Opening Places page';
            shouldNavigate = true;
        } else if (command.includes('open contacts')) {
            navigateTo = 'contacts.html';
            response = 'Opening Contacts page';
            shouldNavigate = true;
        } else if (command.includes('open courses')) {
            navigateTo = 'courses.html';
            response = 'Opening Courses page';
            shouldNavigate = true;
        } else if (command.includes('open home')) {
            navigateTo = 'index.html';
            response = 'Opening Home page';
            shouldNavigate = true;
        } else if (command.includes('open feedback')) {
            navigateTo = 'feedback.html';
            response = 'Opening Feedback page';
            shouldNavigate = true;
        }
        // Existing functionality
        else if (command.includes('library')) {
            response = 'The main library is located in Building A, ground floor. It is open from 8 AM to 8 PM.';
        } else if (command.includes('admission') || command.includes('admissions')) {
            response = 'The admissions office is in the Administration Building, room 101. Office hours are 9 AM to 5 PM.';
        } else if (command.includes('cafeteria') || command.includes('food')) {
            response = 'There are three cafeterias on campus. The nearest one is in the Student Center, first floor.';
        } else if (command.includes('course') || command.includes('program') || command.includes('study')) {
            if (command.includes('computer') || command.includes('cs')) {
                response = 'We offer B.Tech and M.Tech in Computer Science. Visit the Courses page for details.';
            } else if (command.includes('business') || command.includes('bba') || command.includes('mba')) {
                response = 'We offer BBA and MBA programs. Visit the Courses page for details.';
            } else {
                response = 'We offer various undergraduate and postgraduate programs. Visit the Courses page or ask about specific courses.';
            }
        } else if (command.includes('help') || command.includes('what can i ask')) {
            response = 'You can ask about locations, courses, or services. Try: "Where is the library?" or "What computer courses are available?" or "Open About"';
        } else {
            response = 'I didn\'t understand that. Try asking about locations or courses, or say "Open [page name]". Example: "Where is the UIT?" or "Open Campus"';
        }
    }

    if (response && !shouldNavigate && !isProcessing) {
        voiceResult.innerHTML += `<p>${response}</p>`;
        speak(response);
    }
    
    // Navigate if needed 
    if (shouldNavigate && navigateTo) {
        setTimeout(() => {
            window.location.href = navigateTo;
        }, 1000);
    }
}
