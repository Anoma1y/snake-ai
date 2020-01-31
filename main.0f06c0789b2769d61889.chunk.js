(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{17:function(t,i,e){t.exports=e(45)},18:function(t,i,e){},45:function(t,i,e){"use strict";e.r(i);e(18);function n(t){return Math.floor(Math.random()*t)}function o(t,i){return t[0]===i[0]&&t[1]===i[1]}function r(t,i){void 0===i&&(i=!0);var e=i?t[0]:t;return[[e[0]-1,e[1]],[e[0]+1,e[1]],[e[0],e[1]-1],[e[0],e[1]+1]]}function a(t){for(var i=1;i<t.length;i++)if(t[0][0]===t[i][0]&&t[0][1]===t[i][1])return!0;return!1}var h=e(0),s=e.n(h),u=function(){function t(t,i){var e,n,o,r;if(this.canvasEl=t,this.opt=i,this.ctx=null,this._grid=[[]],this.width=0,this.height=0,this._options={width:400,height:400,gridSize:20,gridMargin:0,gridColor:"#000000"},this._options=(e=this._options,n=i,Object.assign(e,n)),!this.canvasEl)throw new Error("Canvas element not found");if(t.width=this._options.width,t.height=this._options.height,this.ctx=t.getContext("2d"),!this.ctx)throw new Error("Canvas context not found");this.width=Math.floor(t.width/this._options.gridSize),this.height=Math.floor(t.height/this._options.gridSize),this._grid=this.renderGrid(),this.drawGrid(),this._dimensions={width:this.width,height:this.height,area:(o=this.width,r=this.height,o*r),grid_margin:0,grid_size:20}}return t.prototype.getDimensions=function(){return this._dimensions},t.prototype.getGrid=function(){return this._grid},t.prototype.renderGrid=function(){for(var t=[],i=0;i<this.height;i++)for(var e=0;e<this.width;e++)t.push([i,e]);return t},t.prototype.drawGrid=function(){for(var t=this.getGrid(),i=0;i<t.length;i++)this.drawCell(t[i][0],t[i][1],this._options.gridColor)},t.prototype.drawCell=function(t,i,e){var n=this._options,o=n.gridSize,r=n.gridMargin;this.ctx.fillStyle=e,this.ctx.fillRect(o*i+r,o*t+r,o-2*r,o-2*r)},t}(),f=function(){function t(t){this.gridDimensions=t;var i=t.width,e=t.height;this._snake=[[n(i),n(e)]]}return t.prototype.getSnake=function(){return this._snake},t.prototype.getLength=function(){return this._snake.length},t.prototype.appendToHead=function(t){this._snake.unshift(t)},t.prototype.appendToTail=function(t){this._snake.push(t)},t.prototype.getHead=function(){return this._snake[0]},t.prototype.removeTail=function(){return this._snake.pop()},t}(),g=function(){function t(t,i){this.grid=t,this.snake=i,this._food=[],this.availablePosition=[[]],this.recalculateAvailablePosition()}return t.prototype.recalculateAvailablePosition=function(){var t=this;this.availablePosition=[],s.a.forEach(this.grid,(function(i){var e=!0;s.a.forEach(t.snake,(function(t){t[0]!==i[0]||t[1]!==i[1]||(e=!1)})),e&&t.availablePosition.push(i)})),this._food=this.availablePosition[n(this.availablePosition.length)]},t.prototype.getFood=function(){return this._food},t}(),d=function(){function t(){}return t.interpolationColors=function(i,e,n){var o=[t.getRGBFromString(i),t.getRGBFromString(e)];if(1===n)return["rgb("+o[0][0]+", "+o[0][1]+", "+o[0][2]+")"];for(var r=1/(n-1),a=[],h=0;h<n;h++){for(var s=o[0].slice(),u=0;u<3;u++)s[u]=Math.round(s[u]+r*h*(o[1][u]-o[0][u]));a.push(s)}return a.map((function(i){return t.getRGB(i)}))},t.getRGBFromString=function(t){return t.match(/\d+/g).map(Number)},t.getRGB=function(t){return Array.isArray(t)?"rgb("+t[0]+", "+t[1]+", "+t[2]+")":"rgb("+t.red+", "+t.green+", "+t.blue+")"},t}(),l=function(){for(var t=0,i=0,e=arguments.length;i<e;i++)t+=arguments[i].length;var n=Array(t),o=0;for(i=0;i<e;i++)for(var r=arguments[i],a=0,h=r.length;a<h;a++,o++)n[o]=r[a];return n};(new(function(){function t(){var t=document.getElementById("snake");this.render=new u(t),this.snake=new f(this.render.getDimensions()),this.food=new g(this.render.getGrid(),this.snake.getSnake()),document.title="Snake AI [Start]"}return t.prototype.checkBoundary=function(t){var i=this.render.getDimensions(),e=i.width,n=i.height;return t[0]>=0&&t[0]<n&&t[1]>=0&&t[1]<e},t.prototype.createBoard=function(t,i){void 0===i&&(i=!1);for(var e=this.render.getDimensions(),n=e.width,o=e.height,r=[],a=0;a<o;a++){r.push([]);for(var h=0;h<n;h++)r[r.length-1].push(null)}var u=t.slice(1,i?t.length-1:void 0);return s.a.forEach(u,(function(t){return r[t[0]][t[1]]=-1})),r},t.prototype.getSafeMove=function(t){var i=this,e=[],n=r(t);return s.a.forEach(n,(function(n){var o=l(t);o.unshift(n),o.pop(),i.checkBoundary(n)&&!a(o)&&e.push(n)})),e},t.prototype.distanceToFood=function(t,i){var e=t[0];if(o(e,i))return 0;var n=this.createBoard(t),a=[[e]];for(n[e[0]][e[1]]=0;;){if(0===a[a.length-1].length)return 1/0;a.push([]);for(var h=a[a.length-2],s=0;s<h.length;s++)for(var u=h[s],f=r(u,!1),g=0;g<f.length;g++){var d=f[g];if(this.checkBoundary(d)&&null===n[d[0]][d[1]]&&(a[a.length-1].push(d),n[d[0]][d[1]]=n[u[0]][u[1]]+1,d[0]===i[0]&&d[1]===i[1]))return n[d[0]][d[1]]}}},t.prototype.getShortDistinationPath=function(t,i,e){var n=this,o=[];return s.a.forEach(e,(function(e){var r=l(t);r.unshift(e),e[0]===i[0]&&e[1]===i[1]||r.pop(),o.push(n.distanceToFood(r,i))})),o},t.prototype.getAlternativeShortDistinationPath=function(t,i,e){var n=this,o=[];return s.a.forEach(i,(function(i){var r=l(t);r.unshift(i),e&&i[0]===e[0]&&i[1]===e[1]||r.pop(),o.push(n.distanceAlternativeToFood(r))})),o},t.prototype.getSafePathToFood=function(t,i){for(var e,n=this.getSafeMove(t),o=this.getShortDistinationPath(t,i,n),r=1/0,a=0;a<o.length;a++)r>o[a]&&(r=o[a],e=a);return{availability:void 0!==e,position:n[e]}},t.prototype.distanceAlternativeToFood=function(t){if(1===t.length)return 0;var i=this.createBoard(t,!0),e=t[0],n=t[t.length-1],o=[[e]];for(i[e[0]][e[1]]=0;;){if(0===o[o.length-1].length)return 1/0;o.push([]);for(var a=o[o.length-2],h=0;h<a.length;h++)for(var s=r(a[h],!1),u=0;u<s.length;u++)if(this.checkBoundary(s[u])&&null===i[s[u][0]][s[u][1]]&&(i[s[u][0]][s[u][1]]=i[a[h][0]][a[h][1]]+1,o[o.length-1].push(s[u]),s[u][0]===n[0]&&s[u][1]===n[1]))return i[s[u][0]][s[u][1]]}},t.prototype.getAlternativeSafePathToFood=function(t,i){for(var e,o=this.getSafeMove(t),r=this.getAlternativeShortDistinationPath(t,o,i),a=-1/0,h=0;h<r.length;h++)isFinite(r[h])&&r[h]>a&&(a=r[h],e=h);var s=void 0!==e;return{availability:s,position:s?o[e]:o[n(o.length)]}},t.prototype.checkSafePosition=function(t,i){for(var e=this.render.getDimensions().area,n=l(t);;){var o=this.getSafePathToFood(n,i),r=o.availability,a=o.position;if(!r)return!1;if(n.unshift(a),n[0][0]===i[0]&&n[0][1]===i[1])return n.length===e||this.getAlternativeSafePathToFood(n).availability;n.pop()}},t.prototype.getNextPosition=function(t,i){var e=this.getSafePathToFood(t,i),n=this.checkSafePosition(t,i);return e.availability&&n?e.position:this.getAlternativeSafePathToFood(t,i).position},t.prototype.gameUpdate=function(){var t=this;if(!this.food.getFood()||0===this.food.getFood().length||0===this.getSafeMove(this.snake.getSnake()).length)return this.ggwp();this.snake.appendToHead(this.getNextPosition(this.snake.getSnake(),this.food.getFood()));var i=this.snake.getHead();if(!this.checkBoundary(i))return this.ggwp();if(o(i,this.food.getFood()))this.food.recalculateAvailablePosition();else{var e=this.snake.removeTail();if(a(this.snake.getSnake()))return this.ggwp();Array.isArray(e)&&this.render.drawCell(e[0],e[1],"#000000")}var n=d.interpolationColors("rgb(255, 171, 41)","rgb(39, 169, 255)",this.snake.getLength());this.food.getFood()&&this.render.drawCell(this.food.getFood()[0],this.food.getFood()[1],"#d73a49"),s.a.forEach(this.snake.getSnake(),(function(i,e){t.render.drawCell(i[0],i[1],n[e])}))},t.prototype.ggwp=function(){console.log("[GGWP] Good Game, Well Played!"),document.title="Snake AI [End]",this.timer&&clearInterval(this.timer)},t.prototype.run=function(t){var i=this;void 0===t&&(t=10),this.timer=setInterval((function(){i.gameUpdate()}),t)},t}())).run(1e3/60)}},[[17,1,2]]]);