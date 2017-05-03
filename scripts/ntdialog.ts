
class NtDialog {
	protected base: HTMLDivElement;
	protected title: string;
	protected style: string;

	// 移動可能範囲
	protected movableArea: { top: number; left: number; right: number; bottom: number; };

	// 左上からの位置
	protected top: number;
	protected left: number;

	// ダイアログの大きさ
	protected width;
	protected height;

	// header部分
	protected header: HTMLDivElement;
	protected hMinimize: HTMLButtonElement;
	protected hMaximize: HTMLButtonElement;
	protected hClose: HTMLButtonElement;

	// body部分
	protected body: HTMLDivElement;

	// 処理用
	protected isMinimize: boolean; // 最小化状態
	protected isMaximize: boolean; // 最大化状態
	protected isDraggable: boolean; // ドラッグ移動可能状態
	protected isAutoSettingMovableArea: boolean; // 移動可能範囲自動割り当て

	constructor(title: string, settings: { [ key: string ]: any } = {}) {
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

		if(settings['movableArea'] !== undefined && settings['movableArea'] !== null) {
			this.movableArea.top = settings['movableArea']['top'] || this.movableArea.top;
			this.movableArea.left = settings['movableArea']['left'] || this.movableArea.left;
			this.movableArea.right = settings['movableArea']['right'] || this.movableArea.right;
			this.movableArea.bottom = settings['movableArea']['bottom'] || this.movableArea.bottom;
			this.isAutoSettingMovableArea = false;
		}

		window.addEventListener('resize', (event: Event) => {
			if(this.isAutoSettingMovableArea) {
				this.movableArea = {
					top: 0,
					left: 0,
					right: window.innerWidth,
					bottom: window.innerHeight,
				};

				if(this.isMaximize) {
					let maximizeWidth = window.innerWidth + 'px';

					this.base.setAttribute('style', 'top: 0; left: 0; width: '+ maximizeWidth);
					this.header.setAttribute('style', 'width: '+ maximizeWidth);
					this.body.setAttribute('style', 'width: '+ maximizeWidth +'; height: '+ (window.innerHeight - this.header.offsetHeight) +'px')
				}
			}
		}, false);

		this.createBase(settings['dialog']);
		this.createHeader(settings['dialog']);
		this.createBody(settings['dialog']);

		this.base.style.display = 'none';
		this.base.style.width = this.width +'px';
		this.header.style.width = this.width +'px';
		this.body.setAttribute('style', 'width: '+ (this.width) +'px; height: '+ (this.height - this.header.offsetHeight) +'px;');

		document.body.appendChild(this.base);

		this.isMaximize = false;
		this.isMinimize = false;
		if(settings['draggable'] === true) {
			this.draggable(true);
		}
		else {
			this.draggable(false);
		}
	}

	public show(): void {
		if(!this.isMaximize) {
			if(this.top < this.movableArea.top) { this.top = this.movableArea.top; }
			if(this.left < this.movableArea.left) { this.left = this.movableArea.left; }
			if(this.top + this.base.clientHeight > this.movableArea.bottom) { this.top = this.movableArea.bottom - this.base.clientHeight; }
			if(this.left + this.base.clientWidth > this.movableArea.right) { this.left = this.movableArea.right - this.base.clientWidth; }

			this.base.setAttribute('style', 'top: '+ this.top +'px; left: '+ this.left +'px;');
		}

		this.base.style.display = 'block';
	}

	public hide(): void {
		this.base.style.display = 'none';
	}

	public draggable(enable: boolean): void {
		this.isDraggable = enable;
		this.setDraggable();
	}

	private setDraggable(): void {
		if (this.isDraggable && !this.isMaximize) {
			this.header.addEventListener('mousedown', this.headerMousedown, false);
		}
		else {
		 	this.header.removeEventListener('mousedown', this.headerMousedown);
		}
	}

	// ダイアログの移動に使用する
	private basePos = { left: 0, top: 0 };
	private mousePos = { x: 0, y: 0 };
	private pagePos = { x: 0, y: 0 };

	private headerMousedown = (event: MouseEvent): boolean => {
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

	private headerMousemove = (event: MouseEvent): boolean => {
		this.pagePos = {
			x: event.clientX,
			y: event.clientY,
		};

		let width = this.base.clientWidth;
		let height = this.base.clientHeight;

		if(event.clientX < this.movableArea.left) { this.pagePos.x = this.movableArea.left; }
		else if(event.clientX > this.movableArea.right) { this.pagePos.x = this.movableArea.right; }

		if (event.clientY < this.movableArea.top) { this.pagePos.y = this.movableArea.top; }
		else if(event.clientY > this.movableArea.bottom) { this.pagePos.y = this.movableArea.bottom; }

		let deltaX = this.pagePos.x - this.mousePos.x;
		let deltaY = this.pagePos.y - this.mousePos.y;
		this.basePos.left += deltaX;
		this.basePos.top += deltaY;

		if (this.basePos.left < this.movableArea.left) { this.basePos.left = this.movableArea.left; }
		else if(this.basePos.left > this.movableArea.right - width) { this.pagePos.x = this.basePos.left = this.movableArea.right - width; }

		if (this.basePos.top < this.movableArea.top) { this.basePos.top = this.movableArea.top; }
		else if(this.basePos.top > this.movableArea.bottom - height) { this.pagePos.y = this.basePos.top = this.movableArea.bottom - height; }

		this.base.setAttribute('style', 'top: '+ this.basePos.top +'px; left: '+ this.basePos.left +'px; display: block;');
		this.mousePos = this.pagePos;

		return false;
	};

	private headerMouseup = (event: MouseEvent) => {
		this.top = this.basePos.top;
		this.left = this.basePos.left;

		document.removeEventListener('mousemove', this.headerMousemove);
		document.removeEventListener('mouseup', this.headerMouseup);
	}

	protected minimize() {
		if(this.isMaximize) {
			this.maximize();
		}

		this.isMinimize = !this.isMinimize;

		if(this.isMinimize) {
			this.header.classList.add('ntdialog-minimization');
			this.body.style.display = 'none';
		}
		else {
			this.header.classList.remove('ntdialog-minimization');
			this.body.style.display = 'block';
		}
	}

	private originPosition = { top: "0px", left: "0px" }
	protected maximize() {
		if(this.isMinimize) {
			this.minimize();
		}

		this.isMaximize = !this.isMaximize

		if(this.isMaximize) {
			this.header.classList.add('ntdialog-maximization');

			this.originPosition.top = this.base.style.top;
			this.originPosition.left = this.base.style.left;

			this.base.style.top = "0px";
			this.base.style.left = "0px";

			this.base.style.width = window.innerWidth +'px';
			this.header.style.width = this.base.clientWidth +'px';
			this.body.setAttribute('style', 'width: '+ (this.base.clientWidth) +'px; height: '+ (window.innerHeight - this.header.offsetHeight) +'px;');
		}
		else {
			this.header.classList.remove('ntdialog-maximization');

			this.base.style.top = this.originPosition.top;
			this.base.style.left = this.originPosition.left;

			this.base.style.width = this.width +'px';
			this.header.style.width = this.width +'px';
			this.body.setAttribute('style', 'width: '+ (this.width) +'px; height: '+ (this.height - this.header.offsetHeight) +'px;');
		}

		this.setDraggable();
	}

	private createBase(dialog?: HTMLDivElement, isClone: boolean = false): void {
		if(dialog !== undefined && dialog !== null) {
			this.base = (isClone ? dialog.cloneNode() : dialog) as HTMLDivElement;
		}
		else {
			this.base = document.createElement('div');
			this.base.classList.add('ntdialog');
		}

		this.base.classList.add('ntdialog-'+ this.style);
	}

	private createHeader(dialog?: HTMLDivElement): void {
		if(dialog !== undefined && dialog !== null) {
			this.header = this.base.querySelector('.ntdialog-header') as HTMLDivElement;
			(this.header.querySelector('.ntdialog-title') as HTMLLabelElement).textContent = this.title;

			this.hMinimize = this.header.querySelector('.ntdialog-minimize') as HTMLButtonElement;
			this.hMaximize = this.header.querySelector('.ntdialog-maximize') as HTMLButtonElement;
			this.hClose = this.header.querySelector('.ntdialog-close') as HTMLButtonElement;
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

		this.hMinimize.onclick = (event: Event) => {
			this.minimize();
		}

		this.hMaximize.onclick = (event: Event) => {
			this.maximize();
		}

		this.hClose.onclick = (event: Event) => {
			this.hide();
		}
	}

	private createBody(dialog?: HTMLDivElement): void {
		if(dialog !== undefined && dialog !== null) {
			this.body = this.base.querySelector('.ntdialog-body') as HTMLDivElement;
		}
		else {
			this.body = document.createElement('div');
			this.body.classList.add('ntdialog-body');
			this.base.appendChild(this.body);
		}
	}
}


