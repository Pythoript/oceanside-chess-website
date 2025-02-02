const share_btn = document.querySelector('.share-btn')
const share = document.querySelector('.share')
let share_btn_img = document.querySelector('.share-btn>img')
const expanding_dot = document.querySelector('.expand')

share_btn.addEventListener("click", () => {

   if (expanding_dot.classList.contains('expanding')) {
      expanding_dot.classList.remove('expanding')
      expanding_dot.classList.add('shrink')
      share.classList.add('hide')
   } else if (expanding_dot.classList.contains('shrink')) {
      expanding_dot.classList.add('expanding')
      expanding_dot.classList.remove('shrink')
      share.classList.remove('hide')
   } else {
      expanding_dot.classList.add('expanding')
   }

   share.classList.toggle('active')
   share_btn.classList.toggle('close')

   const tmp = share_btn_img.src
   share_btn_img.src = share_btn_img.dataset.src
   share_btn_img.dataset.src = tmp

})