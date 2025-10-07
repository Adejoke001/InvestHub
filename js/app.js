$(document).ready(function(){
    // Initialize all carousels
    initializeHeroCarousel();
    initializeStatsCarousel();
    
    // Initialize AOS animations
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false,
        offset: 100,
        delay: 0
    });
});

// Hero Slider Initialization
function initializeHeroCarousel() {
    const $heroSlider = $('#hero-slider');
    
    // Destroy existing instance if any
    if ($heroSlider.hasClass('owl-loaded')) {
        $heroSlider.trigger('destroy.owl.carousel').removeClass('owl-loaded owl-hidden owl-drag');
        $heroSlider.find('.owl-stage-outer, .owl-dots, .owl-nav').remove();
    }
    
    // Initialize hero slider
    $heroSlider.owlCarousel({
        items: 1,
        loop: true,
        autoplay: true,
        autoplayTimeout: 5000,
        autoplayHoverPause: true,
        smartSpeed: 1000,
        nav: false,
        dots: true,
        responsive: {
            0: { dots: true },
            768: { dots: true }
        }
    });
}

// Stats Slider Initialization
function initializeStatsCarousel() {
    const $statsSlider = $("#stats-slider");
    
    // Destroy existing instance if any
    if ($statsSlider.hasClass('owl-loaded')) {
        $statsSlider.trigger('destroy.owl.carousel');
        $statsSlider.removeClass('owl-loaded owl-hidden owl-drag');
    }
    
    // Initialize stats slider
    $statsSlider.owlCarousel({
        items: 1,
        loop: true,
        autoplay: true,
        autoplayTimeout: 4000,
        autoplayHoverPause: true,
        autoplaySpeed: 800,
        smartSpeed: 800,
        nav: true,
        dots: true,
        navText: [
            '<i class="fas fa-chevron-left"></i>',
            '<i class="fas fa-chevron-right"></i>'
        ],
        responsive: {
            0: {
                nav: false,
                dots: true
            },
            768: {
                nav: true,
                dots: true
            }
        }
    });
}

// Signup Form Functionality
document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.getElementById('signupForm');
    if (!signupForm) return; // Exit if form doesn't exist

    const submitBtn = document.getElementById('submitBtn');
    const successAlert = document.getElementById('successAlert');

    // Password toggle functionality
    document.querySelectorAll('.toggle-password').forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const passwordInput = document.getElementById(targetId);
            const icon = this.querySelector('i');
            
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                icon.classList.replace('fa-eye', 'fa-eye-slash');
            } else {
                passwordInput.type = 'password';
                icon.classList.replace('fa-eye-slash', 'fa-eye');
            }
        });
    });

    // Real-time password validation
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');

    if (password && confirmPassword) {
        password.addEventListener('input', validatePassword);
        confirmPassword.addEventListener('input', validatePassword);
    }

    function validatePassword() {
        let isValid = true;
        const passwordValue = password.value;
        const confirmValue = confirmPassword.value;

        // Password strength validation
        if (passwordValue.length > 0) {
            const hasLetter = /[a-zA-Z]/.test(passwordValue);
            const hasNumber = /[0-9]/.test(passwordValue);
            
            if (passwordValue.length < 8 || !hasLetter || !hasNumber) {
                password.classList.add('is-invalid');
                isValid = false;
            } else {
                password.classList.remove('is-invalid');
                password.classList.add('is-valid');
            }
        }

        // Confirm password match
        if (confirmValue.length > 0) {
            if (passwordValue !== confirmValue) {
                confirmPassword.classList.add('is-invalid');
                isValid = false;
            } else {
                confirmPassword.classList.remove('is-invalid');
                confirmPassword.classList.add('is-valid');
            }
        }

        return isValid;
    }

    // Form submission
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            handleFormSubmission();
        }
    });

    function validateForm() {
        let isValid = true;

        // Required fields validation
        const requiredFields = signupForm.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.classList.add('is-invalid');
                isValid = false;
            } else {
                field.classList.remove('is-invalid');
            }
        });

        // Email validation
        const email = document.getElementById('email');
        if (email.value && !isValidEmail(email.value)) {
            email.classList.add('is-invalid');
            isValid = false;
        }

        // Terms agreement validation
        const terms = document.getElementById('terms');
        if (!terms.checked) {
            terms.classList.add('is-invalid');
            isValid = false;
        }

        // Password validation
        if (!validatePassword()) {
            isValid = false;
        }

        if (!isValid) {
            const firstInvalid = signupForm.querySelector('.is-invalid');
            if (firstInvalid) firstInvalid.focus();
            showAlert('Please fill in all required fields correctly.', 'danger');
        }

        return isValid;
    }

    function handleFormSubmission() {
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.classList.add('btn-loading');
        submitBtn.innerHTML = 'Creating Account...';

        // Simulate API call
        setTimeout(() => {
            resetForm();
            showSuccess();
            resetButton();
        }, 2000);
    }

    function resetForm() {
        signupForm.reset();
        signupForm.classList.remove('was-validated');
        
        // Remove validation classes
        document.querySelectorAll('.is-valid, .is-invalid').forEach(el => {
            el.classList.remove('is-valid', 'is-invalid');
        });

        // Hide modal if it exists
        const modalElement = document.getElementById('signupModal');
        if (modalElement) {
            const modal = bootstrap.Modal.getInstance(modalElement);
            if (modal) modal.hide();
        }
    }

    function showSuccess() {
        // Show success alert if it exists
        if (successAlert) {
            successAlert.style.display = 'block';
            successAlert.classList.add('show');

            // Auto-hide alert after 5 seconds
            setTimeout(() => {
                successAlert.classList.remove('show');
                setTimeout(() => {
                    successAlert.style.display = 'none';
                }, 150);
            }, 5000);
        }

        showWelcomeMessage();
    }

    function resetButton() {
        submitBtn.disabled = false;
        submitBtn.classList.remove('btn-loading');
        submitBtn.innerHTML = '<i class="fas fa-rocket me-2"></i>Create Free Account';
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function showAlert(message, type) {
        // Remove existing alerts (except success alert)
        const existingAlert = document.querySelector('.alert:not(#successAlert)');
        if (existingAlert) {
            existingAlert.remove();
        }

        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show fixed-top m-3`;
        alertDiv.style.cssText = 'z-index: 9999; margin-top: 80px; right: 20px; left: auto; max-width: 400px;';
        alertDiv.innerHTML = `
            <i class="fas fa-${type === 'danger' ? 'exclamation-triangle' : 'info-circle'} me-2"></i>
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(alertDiv);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.classList.remove('show');
                setTimeout(() => alertDiv.remove(), 150);
            }
        }, 5000);
    }

    function showWelcomeMessage() {
        console.log('Welcome to InvestHub! Account created successfully.');
        showAlert('Welcome to InvestHub! Your account has been created successfully.', 'success');
    }

    // Update CTA buttons to open modal
    document.querySelectorAll('.btn-cta-primary').forEach(button => {
        button.setAttribute('data-bs-toggle', 'modal');
        button.setAttribute('data-bs-target', '#signupModal');
    });
});

// Reinitialize carousels when page becomes visible again
document.addEventListener('visibilitychange', function(){
    if (!document.hidden) {
        setTimeout(() => {
            initializeHeroCarousel();
            initializeStatsCarousel();
        }, 100);
    }
});