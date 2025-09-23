
const OpenSideBar = document.querySelector('.OpenSideBar');
const CloseSideBar = document.querySelector('.CloseSideBar');
OpenSideBar.addEventListener('click', ShowSideBar);
CloseSideBar.addEventListener('click', HideSideBar);

function ShowSideBar(){
    document.querySelector('.SideBar').style.transform = 'translateX(0)';
    document.body.classList.add('DisableScroll');
}

function HideSideBar(){
    document.querySelector('.SideBar').style.transform = 'translateX(100%)';
    document.body.classList.remove('DisableScroll');
}
