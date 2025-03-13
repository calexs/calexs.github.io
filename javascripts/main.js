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

        title.addEventListener('mouseenter', () => {
            title.classList.add('hovered');
        });

        title.addEventListener('mouseleave', () => {
            // Simply remove the hover class without repositioning
            // This keeps the gradient at its last position as it fades out
            setTimeout(() => {
                title.classList.remove('hovered');
            }, 50);
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
});
