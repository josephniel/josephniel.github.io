'use strict';

(function () {

    /**
     * 
     */
    fullpage.initialize('#fullpage', {
        menu: '.menu',
        anchors: ['about', 'experience', 'projects'],
        navigation: true
    });

    /**
     * This particular block of code enables the rendering of moving 
     * particles in the page through a canvas inside the DIV 
     * element with ID attribute set to 'particles'.
     */
    particleground(document.getElementById('particles'), {
        density: 8000,
        directionX: 'right',
        directionY: 'up',
        dotColor: '#333',
        lineColor: '#555',
        maxSpeedX: 0.9,
        maxSpeedY: 0.9,
        minSpeedX: 0.4,
        minSpeedY: 0.4,
        parallaxMultiplier: 10,
        particleRadius: 8,
        proximity: 90
    });
})();