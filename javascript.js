
        // JavaScript code for the slider
        var slideIndex = 1;
        var slides = document.getElementsByClassName("slide");
        var indicators = document.getElementsByClassName("slider-indicators")[0].getElementsByTagName("span");
        
        showSlide(slideIndex);
        
        function changeSlide(index) {
            showSlide(slideIndex = index);
        }
        
        function showSlide(index) {
            for (var i = 0; i < slides.length; i++) {
                slides[i].style.opacity = 0;
            }
          
            for (            var i = 0; i < indicators.length; i++) {
                indicators[i].className = "";
            }
          
            slides[slideIndex - 1].style.opacity = 1;
            indicators[slideIndex - 1].className = "active";
        }
        
        function nextSlide() {
            slideIndex++;
            if (slideIndex > slides.length) {
                slideIndex = 1;
            }
            showSlide(slideIndex);
        }
        
        function previousSlide() {
            slideIndex--;
            if (slideIndex < 1) {
                slideIndex = slides.length;
            }
            showSlide(slideIndex);
        }
        
        setInterval(nextSlide, 10000); // Change slide every 4 seconds. the seconds are in milliseconds

        // get the button element
        const button =button
        document.getElementById('rounded-button');

        // add click event listener to the button
        button.addEventlistener('click',function() {
            console.log('button clicked');
        })
 
// the contacts page JS code

        let loginForm = document.querySelector(".my-form");
        let email = document.getElementById("email");
        let password = document.getElementById("password");
        let number = document.getElementById("number");
        let confirmPassword = document.getElementById("confirm-password")
        
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            
            console.log('Email:', email.value);
            console.log('Password:', password.value);
        });
        
        function onChange() {
            if (confirmPassword.value === password.value) {
                confirmPassword.setCustomValidity('');
            } else {
                confirmPassword.setCustomValidity('Passwords do not match!');
            }
        }
        
        password.addEventListener('change', onChange);
        confirmPassword.addEventListener('change', onChange);




        
        
        