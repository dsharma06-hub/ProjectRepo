// main site functionality
document.addEventListener('DOMContentLoaded', () => {
    const micButton = document.getElementById('micButton');
    const voiceResult = document.getElementById('voiceResult');
    
    // micButton and voiceResult 
    if (!micButton || !voiceResult) {
        console.error('Voice recognition elements not found.');
        return;
    }
    
    if (window.performance && performance.navigation.type === 1) { 
        const currentPage = window.location.pathname.split('/').pop();
        if (currentPage && currentPage !== 'index.html') {
            window.location.href = 'index.html';
            return;
        }
    }

    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && document.getElementById('micButton').classList.contains('listening')) {
            recognition.stop();
            document.getElementById('micButton').classList.remove('listening');
            document.getElementById('voiceResult').innerHTML = '<p>Voice recognition cancelled</p>';
        }
    });

    const mainContent = document.querySelector('main');
    if (mainContent) {
        mainContent.setAttribute('tabindex', '-1');
        mainContent.focus();
    }

    // Voice recognition setup
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.onstart = function() {
        micButton.classList.add('listening');
        voiceResult.innerHTML = '<p>Listening...</p>';
    };

    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript.toLowerCase();
        voiceResult.innerHTML = `<p>You said: ${transcript}</p>`;
        
        if (transcript.includes('open feedback')) {
            window.location.href = 'feedback.html';
        }
    };

    micButton.addEventListener('click', () => {
        recognition.start();
    });

    // Hamburger menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navList = document.querySelector('.nav-list');
    if (hamburger && navList) {
        hamburger.addEventListener('click', () => {
            navList.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
        // Allow keyboard toggle
        hamburger.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                navList.classList.toggle('active');
                hamburger.classList.toggle('active');
            }
        });
    }

    // Collapsible text toggle
    const collapsibleTexts = document.querySelectorAll('.collapsible-text');
    collapsibleTexts.forEach(el => {
        el.addEventListener('click', () => {
            el.classList.toggle('expanded');
        });
    });
});
