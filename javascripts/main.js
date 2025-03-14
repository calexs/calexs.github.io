document.addEventListener('DOMContentLoaded', () => {
    const title = document.querySelector('h1');

    // Set initial position at center
    title.style.setProperty('--x', '50%');
    title.style.setProperty('--y', '50%');

    // Check if this is a mobile device with orientation support
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    let isUsingDeviceOrientation = false;

    // Function to request device motion/orientation permission on iOS
    const requestDeviceMotionPermission = () => {
        if (typeof DeviceMotionEvent !== 'undefined' &&
            typeof DeviceMotionEvent.requestPermission === 'function') {
            // iOS 13+ requires permission
            DeviceMotionEvent.requestPermission()
                .then(response => {
                    if (response === 'granted') {
                        window.addEventListener('deviceorientation', handleDeviceOrientation);
                        isUsingDeviceOrientation = true;
                        title.classList.add('hovered'); // Show gradient right away on mobile
                    }
                })
                .catch(console.error);
        } else {
            // Non-iOS devices or older iOS versions
            window.addEventListener('deviceorientation', handleDeviceOrientation);
            isUsingDeviceOrientation = true;
            title.classList.add('hovered'); // Show gradient right away on mobile
        }
    };

    // Handler for device orientation changes
    const handleDeviceOrientation = (event) => {
        // Beta is front-to-back tilt from -180 to 180, with 0 being flat
        // Gamma is left-to-right tilt from -90 to 90, with 0 being flat
        const beta = event.beta || 0;  // Front-to-back tilt
        const gamma = event.gamma || 0; // Left-to-right tilt

        // Map the orientation values to a 0-100 range for the gradient position
        // Adjust these values to control sensitivity
        const x = Math.min(100, Math.max(0, ((gamma + 90) / 180) * 100));
        const y = Math.min(100, Math.max(0, ((beta + 180) / 360) * 100));

        // Set the gradient position based on device orientation
        title.style.setProperty('--x', `${x}%`);
        title.style.setProperty('--y', `${y}%`);
    };

    // For desktop: use mouse movement
    if (!isMobile) {
        title.addEventListener('mousemove', (e) => {
            // Get the position of the cursor relative to the title element
            const rect = title.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;

            // Set CSS variables for the gradient position
            title.style.setProperty('--x', `${x}%`);
            title.style.setProperty('--y', `${y}%`);
        });
        
        // Restore mouseenter event
        title.addEventListener('mouseenter', () => {
            title.classList.add('hovered');
        });
        
        // Add mouseleave event without removing the class
        title.addEventListener('mouseleave', () => {
            // Remove the hovered class when mouse leaves
            title.classList.remove('hovered');
        });
        
        // Track cursor position even when outside the element
        document.addEventListener('mousemove', (e) => {
            const rect = title.getBoundingClientRect();
            
            // Check if cursor is over or near the title
            if (e.clientX >= rect.left - 100 && 
                e.clientX <= rect.right + 100 && 
                e.clientY >= rect.top - 100 && 
                e.clientY <= rect.bottom + 100) {
                
                // Calculate relative position
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                
                // Clamp values between 0 and 100
                const clampedX = Math.min(100, Math.max(0, x));
                const clampedY = Math.min(100, Math.max(0, y));
                
                // Update gradient position
                title.style.setProperty('--x', `${clampedX}%`);
                title.style.setProperty('--y', `${clampedY}%`);
            }
        });
    }
    // For mobile: initialize device orientation if supported
    else if (window.DeviceOrientationEvent) {
        // Create a button for iOS devices that need permission
        if (typeof DeviceMotionEvent !== 'undefined' &&
            typeof DeviceMotionEvent.requestPermission === 'function') {

            // Add a button to request permission
            const permissionBtn = document.createElement('button');
            permissionBtn.innerText = 'Enable Motion Effects';
            permissionBtn.style.position = 'fixed';
            permissionBtn.style.bottom = '20px';
            permissionBtn.style.left = '50%';
            permissionBtn.style.transform = 'translateX(-50%)';
            permissionBtn.style.padding = '10px 15px';
            permissionBtn.style.backgroundColor = '#333';
            permissionBtn.style.color = 'white';
            permissionBtn.style.border = 'none';
            permissionBtn.style.borderRadius = '5px';
            permissionBtn.style.fontFamily = 'Inter, sans-serif';
            permissionBtn.style.zIndex = '1000';

            permissionBtn.addEventListener('click', () => {
                requestDeviceMotionPermission();
                permissionBtn.remove();
            });

            document.body.appendChild(permissionBtn);
        } else {
            // For Android and other devices that don't require permission
            requestDeviceMotionPermission();
        }
    }

    const themeToggle = document.querySelector('.theme-toggle');
    
    // Check for saved theme preference or use OS preference
    const savedTheme = localStorage.getItem('theme') || 
                       (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    
    // Apply the saved or OS-preferred theme
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Toggle theme when button is clicked
    themeToggle.addEventListener('click', () => {
        // Get current theme
        const currentTheme = document.documentElement.getAttribute('data-theme');
        
        // Switch to other theme
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        // Save the new theme preference
        localStorage.setItem('theme', newTheme);
        
        // Apply the new theme
        document.documentElement.setAttribute('data-theme', newTheme);
    });
});
