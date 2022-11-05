document.addEventListener('DOMContentLoaded', (event) => {
    function handleDragStart(e) {
        console.log('test');
        this.style.opacity = '0.4';
    }

    function handleDragEnd(e) {
        this.style.opacity = '1';
    }

    let items = document.querySelectorAll('.container .box');
    items.forEach(function (item) {
        item.addEventListener('dragstart', handleDragStart);
        item.addEventListener('dragend', handleDragEnd);
    });
});