class NtDialog {
    /**
     * コンストラクタ
     * @param title タイトル
     * @param settings 設定
     */
    constructor(title, settings = {}) {
        // ダイアログの移動に使用する
        this.basePos = { left: 0, top: 0 };
        this.mousePos = { x: 0, y: 0 };
        this.pagePos = { x: 0, y: 0 };
        this.headerMousedown = (event) => {
            this.basePos = {
                left: this.base.offsetLeft,
                top: this.base.offsetTop
            };
            this.mousePos = {
                x: event.clientX,
                y: event.clientY,
            };
            document.addEventListener('mousemove', this.headerMousemove);
            document.addEventListener('mouseup', this.headerMouseup);
            return false;
        };
        this.headerMousemove = (event) => {
            this.pagePos = {
                x: event.clientX,
                y: event.clientY,
            };
            let width = this.base.clientWidth;
            let height = this.base.clientHeight;
            if (event.clientX < this.movableArea.left) {
                this.pagePos.x = this.movableArea.left;
            }
            else if (event.clientX > this.movableArea.right) {
                this.pagePos.x = this.movableArea.right;
            }
            if (event.clientY < this.movableArea.top) {
                this.pagePos.y = this.movableArea.top;
            }
            else if (event.clientY > this.movableArea.bottom) {
                this.pagePos.y = this.movableArea.bottom;
            }
            let deltaX = this.pagePos.x - this.mousePos.x;
            let deltaY = this.pagePos.y - this.mousePos.y;
            this.basePos.left += deltaX;
            this.basePos.top += deltaY;
            if (this.basePos.left < this.movableArea.left) {
                this.basePos.left = this.movableArea.left;
            }
            else if (this.basePos.left > this.movableArea.right - width) {
                this.pagePos.x = this.basePos.left = this.movableArea.right - width;
            }
            if (this.basePos.top < this.movableArea.top) {
                this.basePos.top = this.movableArea.top;
            }
            else if (this.basePos.top > this.movableArea.bottom - height) {
                this.pagePos.y = this.basePos.top = this.movableArea.bottom - height;
            }
            this.base.setAttribute('style', 'top: ' + this.basePos.top + 'px; left: ' + this.basePos.left + 'px;');
            this.mousePos = this.pagePos;
            return false;
        };
        this.headerMouseup = (event) => {
            this.top = this.basePos.top;
            this.left = this.basePos.left;
            document.removeEventListener('mousemove', this.headerMousemove);
            document.removeEventListener('mouseup', this.headerMouseup);
        };
        this.originPosition = { top: "0px", left: "0px" };
        this.title = title;
        this.style = settings['style'] || 'default';
        this.top = settings['top'] || 0;
        this.left = settings['left'] || 0;
        this.width = settings['width'] || 300;
        this.height = settings['height'] || 300;
        this.movableArea = {
            top: 0,
            left: 0,
            right: window.innerWidth,
            bottom: window.innerHeight,
        };
        this.isAutoSettingMovableArea = true;
        if (settings['movableArea'] !== undefined && settings['movableArea'] !== null) {
            this.movableArea.top = settings['movableArea']['top'] || this.movableArea.top;
            this.movableArea.left = settings['movableArea']['left'] || this.movableArea.left;
            this.movableArea.right = settings['movableArea']['right'] || this.movableArea.right;
            this.movableArea.bottom = settings['movableArea']['bottom'] || this.movableArea.bottom;
            this.isAutoSettingMovableArea = false;
        }
        window.addEventListener('resize', (event) => {
            if (this.isAutoSettingMovableArea) {
                this.movableArea = {
                    top: 0,
                    left: 0,
                    right: window.innerWidth,
                    bottom: window.innerHeight,
                };
                if (this.isMaximize) {
                    let maximizeWidth = window.innerWidth + 'px';
                    this.base.setAttribute('style', 'top: 0; left: 0; width: ' + maximizeWidth);
                    this.header.setAttribute('style', 'width: ' + maximizeWidth);
                    this.body.setAttribute('style', 'width: ' + maximizeWidth + '; height: ' + (window.innerHeight - this.header.offsetHeight) + 'px');
                }
            }
        }, false);
        this.createBase(settings['dialog']);
        this.createHeader(settings['dialog']);
        this.createBody(settings['dialog']);
        this.base.style.display = 'none';
        this.base.style.width = this.width + 'px';
        this.header.style.width = this.width + 'px';
        this.body.setAttribute('style', 'width: ' + (this.width) + 'px; height: ' + (this.height - this.header.offsetHeight) + 'px;');
        document.body.appendChild(this.base);
        this.isMaximize = false;
        this.isMinimize = false;
        if (settings['draggable'] === true) {
            this.draggable(true);
        }
        else {
            this.draggable(false);
        }
    }
    /**
     * ダイアログを表示する
     * @param callback 使用するコールバック関数
     */
    show(callback) {
        if (!this.isMaximize) {
            if (this.top < this.movableArea.top) {
                this.top = this.movableArea.top;
            }
            if (this.left < this.movableArea.left) {
                this.left = this.movableArea.left;
            }
            if (this.top + this.base.clientHeight > this.movableArea.bottom) {
                this.top = this.movableArea.bottom - this.base.clientHeight;
            }
            if (this.left + this.base.clientWidth > this.movableArea.right) {
                this.left = this.movableArea.right - this.base.clientWidth;
            }
            this.base.setAttribute('style', 'top: ' + this.top + 'px; left: ' + this.left + 'px; width: ' + this.width + 'px');
        }
        this.base.classList.add('show');
        if (this.onshow) {
            this.onshow();
        }
        if (callback) {
            callback();
        }
    }
    /**
     * ダイアログを非表示する
     * @param callback 使用するコールバック関数
     */
    hide(callback) {
        this.base.classList.remove('show');
        if (this.onhide) {
            this.onhide();
        }
        if (callback) {
            callback();
        }
    }
    /**
     * ドラッグ移動を可能にするかどうかを設定する
     * @param enable ドラッグ移動を可能にするかどうか
     */
    draggable(enable) {
        this.isDraggable = enable;
        this.setDraggable();
    }
    /**
     * ドラッグ移動の設定を行う
     */
    setDraggable() {
        if (this.isDraggable && !this.isMaximize) {
            this.header.addEventListener('mousedown', this.headerMousedown, false);
        }
        else {
            this.header.removeEventListener('mousedown', this.headerMousedown);
        }
    }
    minimize() {
        if (this.isMaximize) {
            this.maximize();
        }
        this.isMinimize = !this.isMinimize;
        if (this.isMinimize) {
            this.header.classList.add('ntdialog-minimization');
            this.body.style.display = 'none';
        }
        else {
            this.header.classList.remove('ntdialog-minimization');
            this.body.style.display = 'block';
        }
    }
    maximize() {
        if (this.isMinimize) {
            this.minimize();
        }
        this.isMaximize = !this.isMaximize;
        if (this.isMaximize) {
            this.header.classList.add('ntdialog-maximization');
            this.originPosition.top = this.base.style.top;
            this.originPosition.left = this.base.style.left;
            this.base.style.top = "0px";
            this.base.style.left = "0px";
            this.base.style.width = window.innerWidth + 'px';
            this.header.style.width = this.base.clientWidth + 'px';
            this.body.setAttribute('style', 'width: ' + (this.base.clientWidth) + 'px; height: ' + (window.innerHeight - this.header.offsetHeight) + 'px;');
        }
        else {
            this.header.classList.remove('ntdialog-maximization');
            this.base.style.top = this.originPosition.top;
            this.base.style.left = this.originPosition.left;
            this.base.style.width = this.width + 'px';
            this.header.style.width = this.width + 'px';
            this.body.setAttribute('style', 'width: ' + (this.width) + 'px; height: ' + (this.height - this.header.offsetHeight) + 'px;');
        }
        this.setDraggable();
    }
    createBase(dialog, isClone = false) {
        if (dialog !== undefined && dialog !== null) {
            this.base = (isClone ? dialog.cloneNode() : dialog);
        }
        else {
            this.base = document.createElement('div');
            this.base.classList.add('ntdialog');
        }
        this.base.classList.add('ntdialog-' + this.style);
    }
    createHeader(dialog) {
        if (dialog !== undefined && dialog !== null) {
            this.header = this.base.querySelector('.ntdialog-header');
            this.header.querySelector('.ntdialog-title').textContent = this.title;
            this.hMinimize = this.header.querySelector('.ntdialog-minimize');
            this.hMaximize = this.header.querySelector('.ntdialog-maximize');
            this.hClose = this.header.querySelector('.ntdialog-close');
        }
        else {
            this.header = document.createElement('div');
            this.header.classList.add('ntdialog-header');
            let label = document.createElement('label');
            label.classList.add('ntdialog-title');
            label.textContent = this.title;
            this.header.appendChild(label);
            this.hMinimize = document.createElement('button');
            this.hMinimize.classList.add('ntdialog-minimize');
            this.header.appendChild(this.hMinimize);
            this.hMaximize = document.createElement('button');
            this.hMaximize.classList.add('ntdialog-maximize');
            this.header.appendChild(this.hMaximize);
            this.hClose = document.createElement('button');
            this.hClose.classList.add('ntdialog-close');
            this.header.appendChild(this.hClose);
            this.base.appendChild(this.header);
        }
        this.hMinimize.onclick = (event) => {
            this.minimize();
        };
        this.hMaximize.onclick = (event) => {
            this.maximize();
        };
        this.hClose.onclick = (event) => {
            this.hide();
        };
    }
    createBody(dialog) {
        if (dialog !== undefined && dialog !== null) {
            this.body = this.base.querySelector('.ntdialog-body');
        }
        else {
            this.body = document.createElement('div');
            this.body.classList.add('ntdialog-body');
            this.base.appendChild(this.body);
        }
    }
}
//# sourceMappingURL=ntdialog.js.map