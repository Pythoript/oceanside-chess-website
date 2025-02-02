const hamburgerButton = document.querySelector('.hamburger');

hamburgerButton.addEventListener('click', toggleHamburger);
hamburgerButton.addEventListener('keydown', (event) => {
   if (event.key === 'Enter') {
      toggleHamburger();
   }
});

 function toggleHamburger() {
   hamburgerButton.classList.toggle('is-active');
   document.querySelector('menu.mobile-menu').classList.toggle('visible');
}

 document.querySelectorAll(".mobile-menu ul li").forEach((el)=> {
   el.addEventListener("click", () => {
      el.classList.toggle("active")
   })
})