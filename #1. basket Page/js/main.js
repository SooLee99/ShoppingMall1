/* 화면 축소 시 상단헤더 버튼의 이벤트 처리 (2022-08-30 이수) */
const toggleBtn = document.querySelector('.navbar_toggleBtn');
const topmenu = document.querySelector('.navbar_topmenu');
const mainmenu = document.querySelector('.navbar_mainmenu');

toggleBtn.addEventListener('click', () => {
    topmenu.classList.toggle('active');
    mainmenu.classList.toggle('active');
});