var NtDialog = (function () {
    function NtDialog(title, settings) {
        if (settings === void 0) { settings = {}; }
        var _this = this;
        // ダイアログの移動に使用する
        this.basePos = { left: 0, top: 0 };
        this.mousePos = { x: 0, y: 0 };
        this.pagePos = { x: 0, y: 0 };
        this.headerMousedown = function (event) {
            _this.basePos = {
                left: _this.base.offsetLeft,
                top: _this.base.offsetTop
            };
            _this.mousePos = {
                x: event.clientX,
                y: event.clientY,
            };
            document.addEventListener('mousemove', _this.headerMousemove);
            document.addEventListener('mouseup', _this.headerMouseup);
            return false;
        };
        this.headerMousemove = function (event) {
            _this.pagePos = {
                x: event.clientX,
                y: event.clientY,
            };
            var width = _this.base.clientWidth;
            var height = _this.base.clientHeight;
            if (event.clientX < _this.movableArea.left) {
                _this.pagePos.x = _this.movableArea.left;
            }
            else if (event.clientX > _this.movableArea.right) {
                _this.pagePos.x = _this.movableArea.right;
            }
            if (event.clientY < _this.movableArea.top) {
                _this.pagePos.y = _this.movableArea.top;
            }
            else if (event.clientY > _this.movableArea.bottom) {
                _this.pagePos.y = _this.movableArea.bottom;
            }
            var deltaX = _this.pagePos.x - _this.mousePos.x;
            var deltaY = _this.pagePos.y - _this.mousePos.y;
            _this.basePos.left += deltaX;
            _this.basePos.top += deltaY;
            if (_this.basePos.left < _this.movableArea.left) {
                _this.basePos.left = _this.movableArea.left;
            }
            else if (_this.basePos.left > _this.movableArea.right - width) {
                _this.pagePos.x = _this.basePos.left = _this.movableArea.right - width;
            }
            if (_this.basePos.top < _this.movableArea.top) {
                _this.basePos.top = _this.movableArea.top;
            }
            else if (_this.basePos.top > _this.movableArea.bottom - height) {
                _this.pagePos.y = _this.basePos.top = _this.movableArea.bottom - height;
            }
            _this.base.setAttribute('style', 'top: ' + _this.basePos.top + 'px; left: ' + _this.basePos.left + 'px;');
            _this.mousePos = _this.pagePos;
            return false;
        };
        this.headerMouseup = function (event) {
            _this.top = _this.basePos.top;
            _this.left = _this.basePos.left;
            document.removeEventListener('mousemove', _this.headerMousemove);
            document.removeEventListener('mouseup', _this.headerMouseup);
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
        window.addEventListener('resize', function (event) {
            if (_this.isAutoSettingMovableArea) {
                _this.movableArea = {
                    top: 0,
                    left: 0,
                    right: window.innerWidth,
                    bottom: window.innerHeight,
                };
                if (_this.isMaximize) {
                    var maximizeWidth = window.innerWidth + 'px';
                    _this.base.setAttribute('style', 'top: 0; left: 0; width: ' + maximizeWidth);
                    _this.header.setAttribute('style', 'width: ' + maximizeWidth);
                    _this.body.setAttribute('style', 'width: ' + maximizeWidth + '; height: ' + (window.innerHeight - _this.header.offsetHeight) + 'px');
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
    NtDialog.prototype.show = function () {
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
    };
    NtDialog.prototype.hide = function () {
        this.base.classList.remove('show');
    };
    NtDialog.prototype.draggable = function (enable) {
        this.isDraggable = enable;
        this.setDraggable();
    };
    NtDialog.prototype.setDraggable = function () {
        if (this.isDraggable && !this.isMaximize) {
            this.header.addEventListener('mousedown', this.headerMousedown, false);
        }
        else {
            this.header.removeEventListener('mousedown', this.headerMousedown);
        }
    };
    NtDialog.prototype.minimize = function () {
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
    };
    NtDialog.prototype.maximize = function () {
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
    };
    NtDialog.prototype.createBase = function (dialog, isClone) {
        if (isClone === void 0) { isClone = false; }
        if (dialog !== undefined && dialog !== null) {
            this.base = (isClone ? dialog.cloneNode() : dialog);
        }
        else {
            this.base = document.createElement('div');
            this.base.classList.add('ntdialog');
        }
        this.base.classList.add('ntdialog-' + this.style);
    };
    NtDialog.prototype.createHeader = function (dialog) {
        var _this = this;
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
            var label = document.createElement('label');
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
        this.hMinimize.onclick = function (event) {
            _this.minimize();
        };
        this.hMaximize.onclick = function (event) {
            _this.maximize();
        };
        this.hClose.onclick = function (event) {
            _this.hide();
        };
    };
    NtDialog.prototype.createBody = function (dialog) {
        if (dialog !== undefined && dialog !== null) {
            this.body = this.base.querySelector('.ntdialog-body');
        }
        else {
            this.body = document.createElement('div');
            this.body.classList.add('ntdialog-body');
            this.base.appendChild(this.body);
        }
    };
    return NtDialog;
}());
//# sourceMappingURL=ntdialog.js.map