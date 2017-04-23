var vziek;
(function (vziek) {
    var VDialog = (function () {
        function VDialog(title, settings) {
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
                _this.base.setAttribute('style', 'top: ' + _this.basePos.top + 'px; left: ' + _this.basePos.left + 'px; display: block;');
                _this.mousePos = _this.pagePos;
                return false;
            };
            this.headerMouseup = function (event) {
                _this.top = _this.basePos.top;
                _this.left = _this.basePos.left;
                document.removeEventListener('mousemove', _this.headerMousemove);
                document.removeEventListener('mouseup', _this.headerMouseup);
            };
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
                        var maximizeWidth = _this.movableArea.right + 'px';
                        _this.base.setAttribute('style', 'top: 0; left: 0; width: ' + maximizeWidth);
                        _this.header.setAttribute('style', 'width: ' + maximizeWidth);
                        _this.body.setAttribute('style', 'width: ' + maximizeWidth + '; height: ' + (_this.movableArea.bottom - _this.header.clientHeight) + 'px');
                    }
                }
            }, false);
            this.createBase(settings['dialog']);
            this.createHeader(settings['dialog']);
            this.createBody(settings['dialog']);
            this.base.style.display = 'none';
            this.base.style.width = this.width + 'px';
            this.header.style.width = this.width + 'px';
            this.body.setAttribute('style', 'width: ' + (this.width) + 'px; height: ' + (this.height - this.header.clientHeight) + 'px;');
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
        VDialog.prototype.show = function () {
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
                this.base.setAttribute('style', 'top: ' + this.top + 'px; left: ' + this.left + 'px;');
            }
            this.base.style.display = 'block';
        };
        VDialog.prototype.hide = function () {
            this.base.style.display = 'none';
        };
        VDialog.prototype.draggable = function (enable) {
            this.isDraggable = enable;
            this.setDraggable();
        };
        VDialog.prototype.setDraggable = function () {
            if (this.isDraggable && !this.isMaximize) {
                this.header.addEventListener('mousedown', this.headerMousedown, false);
            }
            else {
                this.header.removeEventListener('mousedown', this.headerMousedown);
            }
        };
        VDialog.prototype.minimize = function () {
            if (this.isMaximize) {
                this.maximize();
            }
            this.isMinimize = !this.isMinimize;
            if (this.isMinimize) {
                this.header.classList.add('vdialog-minimization');
                this.body.style.display = 'none';
            }
            else {
                this.header.classList.remove('vdialog-minimization');
                this.body.style.display = 'block';
            }
        };
        VDialog.prototype.maximize = function () {
        };
        VDialog.prototype.createBase = function (dialog, isClone) {
            if (isClone === void 0) { isClone = false; }
            if (dialog !== undefined && dialog !== null) {
                this.base = (isClone ? dialog.cloneNode() : dialog);
            }
            else {
                this.base = document.createElement('div');
                this.base.classList.add('vdialog');
            }
            this.base.classList.add('vdialog-' + this.style);
        };
        VDialog.prototype.createHeader = function (dialog) {
            var _this = this;
            if (dialog !== undefined && dialog !== null) {
                this.header = this.base.querySelector('.vdialog-header');
                this.header.querySelector('.vdialog-title').textContent = this.title;
                this.hMinimize = this.header.querySelector('.vdialog-minimize');
                this.hMaximize = this.header.querySelector('.vdialog-maximize');
                this.hClose = this.header.querySelector('.vdialog-close');
            }
            else {
                this.header = document.createElement('div');
                this.header.classList.add('vdialog-header');
                var label = document.createElement('label');
                label.classList.add('vdialog-title');
                label.textContent = this.title;
                this.header.appendChild(label);
                this.hMinimize = document.createElement('button');
                this.hMinimize.classList.add('vdialog-minimize');
                this.header.appendChild(this.hMinimize);
                this.hMaximize = document.createElement('button');
                this.hMaximize.classList.add('vdialog-maximize');
                this.header.appendChild(this.hMaximize);
                this.hClose = document.createElement('button');
                this.hClose.classList.add('vdialog-close');
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
        VDialog.prototype.createBody = function (dialog) {
            if (dialog !== undefined && dialog !== null) {
                this.body = this.base.querySelector('.vdialog-body');
            }
            else {
                this.body = document.createElement('div');
                this.body.classList.add('vdialog-body');
                this.base.appendChild(this.body);
            }
        };
        return VDialog;
    }());
    vziek.VDialog = VDialog;
})(vziek || (vziek = {}));
//# sourceMappingURL=vdialog.js.map