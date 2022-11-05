document.addEventListener('DOMContentLoaded', (event) => {
    var dragSrcEl = null;

    function handleDragStart(e) {
        this.style.opacity = '0.4';

        dragSrcEl = this;

        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', this.innerHTML);
    }

    function handleDragEnd(e) {
        this.style.opacity = '1';

        items.forEach(function (item) {
            item.classList.remove('over');
        });
    }

    function handleDragOver(e) {
        if (e.preventDefault) {
            e.preventDefault();
        }
        e.dataTransfer.dropEffect = 'move';
        return false;
    }

    function handleDragEnter(e) {
        this.classList.add('over');
    }

    function handleDragLeave(e) {
        this.classList.remove('over');
    }

    function handleDrop(e) {
        if (dragSrcEl != this) {
            dragSrcEl.innerHTML = this.innerHTML;
            this.innerHTML = e.dataTransfer.getData('text/html');
        }
    }

    let items = document.querySelectorAll('.zad1 .box');
    items.forEach(function (item) {
        item.addEventListener('dragstart', handleDragStart);
        item.addEventListener('dragend', handleDragEnd);
        item.addEventListener('dragover', handleDragOver);
        item.addEventListener('dragenter', handleDragEnter);
        item.addEventListener('dragleave', handleDragLeave);
        item.addEventListener('drop', handleDrop);
    });

    var width = window.innerWidth;
    var height = window.innerHeight;

    var stage = new Konva.Stage({
        container: 'canva',
        width: width,
        height: height,
        margin: 0,
    });

    var layer = new Konva.Layer();
    var rectX = stage.width() / 2 - 50;
    var rectY = stage.height() / 2 - 25;

    var box = new Konva.Rect();

    var layer = new Konva.Layer();
    stage.add(layer);

    var tr = new Konva.Transformer();
    layer.add(tr);
    layer.draw();
    layer.add(box);

    document.getElementById('create').addEventListener('click', addShape);
    addShape();

    function addShape() {
        var random = Math.floor(Math.random() * 3);
        if (random == 0) {
            layer.add(
                new Konva.RegularPolygon({
                    x: 100,
                    y: 150,
                    sides: 3,
                    radius: 70,
                    fill: Konva.Util.getRandomColor(),
                    draggable: true,
                }),
            );
        }
        else if (random == 1) {
            layer.add(
                new Konva.Circle({
                    x: Math.random() * 100 + 100,
                    y: Math.random() * 100 + 100,
                    radius: 70,
                    fill: Konva.Util.getRandomColor(),
                    draggable: true,
                }),
            );
        }
        else if (random == 2) {
            layer.add(
                new Konva.Rect({
                    x: Math.random() * 10,
                    y: Math.random() * 10,
                    width: 200,
                    height: 200,
                    fill: Konva.Util.getRandomColor(),
                    draggable: true,
                })
            );
        }

        tr.forceUpdate();
        layer.draw();
    }
});